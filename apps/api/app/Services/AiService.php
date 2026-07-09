<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AiService
{
    private bool $lastResponseTruncated = false;

    public function __construct(private SettingsService $settings) {}

    public function ensureConfigured(): void
    {
        if (! $this->settings->aiApiKey()) {
            abort(422, 'Please configure the AI API key in Settings → AI before using this feature.');
        }
    }

    public function generate(
        string $type,
        string $prompt,
        ?string $context = null,
        ?string $selectedHtml = null,
        ?string $selectedText = null,
    ): array {
        $this->ensureConfigured();

        if ($type === 'image') {
            return $this->generateImage($prompt);
        }

        $this->lastResponseTruncated = false;
        $system = $this->systemPrompt($type);
        $user = $this->userPrompt($type, $prompt, $context, $selectedHtml, $selectedText);
        $raw = $this->chat($system, $user);

        $html = match ($type) {
            'content' => $this->wrapContentHtml($raw),
            'section' => $this->extractHtml($raw, 'section', $selectedHtml),
            'page' => $this->extractHtml($raw, 'page', $selectedHtml),
            default => abort(422, 'Unsupported AI generation type.'),
        };

        $css = $this->extractCss($raw);
        $js = $this->sanitizeJs($this->extractJs($raw));

        $wantsMotion = $this->promptWantsMotion($prompt);
        $effectOnly = $this->promptIsEffectOnly($prompt);

        // Effect-only / weak AI HTML must never wipe a richer selection (common when model returns only <script>).
        $keptExisting = false;
        if (filled($selectedHtml)) {
            $selectedClean = $this->coerceHtml($selectedHtml);
            if ($selectedClean === '') {
                $selectedClean = trim(preg_replace('/<(style|script)\b[^>]*>.*?<\/\1>/is', '', $selectedHtml) ?? $selectedHtml);
            }
            if ($selectedClean !== '' && $this->shouldKeepExistingHtml($html, $selectedClean, $prompt)) {
                $html = $selectedClean;
                $keptExisting = true;
            }
        }

        // Section/page keep a small CSS fallback when the model omitted styles.
        if (($type === 'section' || $type === 'page') && ! filled($css) && ! $keptExisting) {
            $css = $this->fallbackSectionCss();
        }

        if ($wantsMotion || $effectOnly) {
            if (! filled($css) || ! preg_match('/@keyframes\b|transition\b|transform\b/i', (string) $css)) {
                $css = trim((string) $css."\n\n".$this->fallbackMotionCss());
            }
            if (! filled($js)) {
                $js = $this->fallbackMouseEffectJs();
            }
        }

        return [
            'type' => $type,
            'html' => $html,
            'text' => strip_tags($html),
            'css' => $css,
            'js' => $js,
            'truncated' => $this->lastResponseTruncated || $this->looksTruncatedHtml($html),
            'kept_existing' => $keptExisting,
            'effect_only' => $effectOnly,
        ];
    }

    private function chat(string $system, string $user): string
    {
        $providerKey = $this->settings->aiProvider();
        $config = $this->settings->providerConfig($providerKey);
        $model = $this->settings->aiModel();
        $apiKey = $this->settings->aiApiKey();

        if (! $config || ! $apiKey) {
            abort(422, 'AI provider is not configured.');
        }

        // MiniMax / long models can exceed PHP's default 30s and kill `artisan serve`.
        if (function_exists('set_time_limit')) {
            @set_time_limit(180);
        }

        try {
            $text = match ($config['driver']) {
                'anthropic' => $this->chatAnthropic($config, $model, $apiKey, $system, $user),
                'gemini' => $this->chatGemini($config, $model, $apiKey, $system, $user),
                default => $this->chatOpenAiCompatible($config, $model, $apiKey, $system, $user, $providerKey),
            };
        } catch (HttpException $e) {
            throw $e;
        } catch (RequestException $e) {
            $body = $e->response?->json();
            $message = data_get($body, 'error.message')
                ?? data_get($body, 'base_resp.status_msg')
                ?? data_get($body, 'message')
                ?? $e->getMessage();

            abort(422, 'AI provider error ('.$providerKey.'): '.$message);
        } catch (\Throwable $e) {
            abort(422, 'AI request failed: '.$e->getMessage());
        }

        $text = $this->normalizeModelText($text);
        if ($text === '') {
            abort(422, 'AI returned an empty response. Check the model name and try again.');
        }

        return $text;
    }

    private function chatOpenAiCompatible(
        array $config,
        string $model,
        string $apiKey,
        string $system,
        string $user,
        string $providerKey,
    ): string {
        $base = rtrim((string) $config['base_url'], '/');
        $headers = [
            'Authorization' => 'Bearer '.$apiKey,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        if ($providerKey === 'openrouter') {
            $headers['HTTP-Referer'] = config('app.url', 'http://localhost');
            $headers['X-Title'] = config('app.name', 'PageBuilder V2');
        }

        // 6+ cards with CSS/JS need a high ceiling — older 800–1200 limits cut HTML mid-card.
        $maxTokens = match ($providerKey) {
            'groq' => 8192,
            'minimax' => 8192,
            default => 8192,
        };

        $payload = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $user],
            ],
            'temperature' => 0.55,
            'max_tokens' => $maxTokens,
            'max_completion_tokens' => $maxTokens,
        ];

        // MiniMax-M* models think by default and can take >30s; disable for pagebuilder latency.
        if ($providerKey === 'minimax') {
            $payload['thinking'] = ['type' => 'disabled'];
        }

        $response = Http::timeout(150)
            ->connectTimeout(15)
            ->retry(1, 800, throw: false)
            ->withHeaders($headers)
            ->post($base.'/chat/completions', $payload);

        if ($response->failed()) {
            $json = $response->json();
            $message = data_get($json, 'error.message')
                ?? data_get($json, 'base_resp.status_msg')
                ?? data_get($json, 'message')
                ?? ('HTTP '.$response->status());

            abort(422, 'AI provider error ('.$providerKey.'): '.$message);
        }

        $json = $response->json();
        $statusCode = data_get($json, 'base_resp.status_code');
        if (is_numeric($statusCode) && (int) $statusCode !== 0) {
            abort(422, 'AI provider error ('.$providerKey.'): '.(string) data_get($json, 'base_resp.status_msg', 'Unknown MiniMax error'));
        }

        $content = data_get($json, 'choices.0.message.content');
        if (! is_string($content) || trim($content) === '') {
            // Some MiniMax responses put the final answer after reasoning fields.
            $content = data_get($json, 'choices.0.message.reasoning_content');
        }

        $finish = strtolower((string) data_get($json, 'choices.0.finish_reason', ''));
        if (is_string($content) && in_array($finish, ['length', 'max_tokens'], true)) {
            $this->lastResponseTruncated = true;
            logger()->warning('AI response truncated by max_tokens', [
                'provider' => $providerKey,
                'model' => $model,
                'finish_reason' => $finish,
                'chars' => strlen($content),
            ]);
        }

        return is_string($content) ? $content : '';
    }

    private function normalizeModelText(string $text): string
    {
        $text = trim($text);
        // Strip MiniMax / reasoning wrappers that leak into content
        $text = preg_replace('/<think\b[^>]*>.*?<\/think>/is', '', $text) ?? $text;
        $text = preg_replace('/<\/?think\b[^>]*>/i', '', $text) ?? $text;

        return trim($text);
    }

    private function chatAnthropic(
        array $config,
        string $model,
        string $apiKey,
        string $system,
        string $user,
    ): string {
        $base = rtrim((string) $config['base_url'], '/');

        $response = Http::timeout(150)
            ->withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'Accept' => 'application/json',
            ])
            ->post($base.'/v1/messages', [
                'model' => $model,
                'max_tokens' => 8192,
                'system' => $system,
                'messages' => [
                    ['role' => 'user', 'content' => $user],
                ],
            ])
            ->throw();

        $stop = strtolower((string) data_get($response->json(), 'stop_reason', ''));
        if (in_array($stop, ['max_tokens', 'length'], true)) {
            $this->lastResponseTruncated = true;
            logger()->warning('AI response truncated by max_tokens', [
                'provider' => 'anthropic',
                'model' => $model,
                'finish_reason' => $stop,
            ]);
        }

        $blocks = data_get($response->json(), 'content', []);
        $parts = [];
        foreach ($blocks as $block) {
            if (($block['type'] ?? null) === 'text' && isset($block['text'])) {
                $parts[] = $block['text'];
            }
        }

        return implode("\n", $parts);
    }

    private function chatGemini(
        array $config,
        string $model,
        string $apiKey,
        string $system,
        string $user,
    ): string {
        $base = rtrim((string) $config['base_url'], '/');
        $url = $base.'/models/'.$model.':generateContent?key='.urlencode($apiKey);

        $response = Http::timeout(150)
            ->acceptJson()
            ->post($url, [
                'systemInstruction' => [
                    'parts' => [['text' => $system]],
                ],
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [['text' => $user]],
                    ],
                ],
                'generationConfig' => [
                    'temperature' => 0.55,
                    'maxOutputTokens' => 8192,
                ],
            ])
            ->throw();

        $json = $response->json();
        $finish = strtolower((string) data_get($json, 'candidates.0.finishReason', ''));
        if (in_array($finish, ['max_tokens', 'length'], true)) {
            $this->lastResponseTruncated = true;
            logger()->warning('AI response truncated by max_tokens', [
                'provider' => 'gemini',
                'model' => $model,
                'finish_reason' => $finish,
            ]);
        }

        $parts = data_get($json, 'candidates.0.content.parts', []);
        $texts = [];
        foreach ($parts as $part) {
            if (isset($part['text'])) {
                $texts[] = $part['text'];
            }
        }

        return implode("\n", $texts);
    }

    private function generateImage(string $prompt): array
    {
        // Image APIs vary widely; keep a deterministic placeholder until per-provider image wiring lands.
        return [
            'type' => 'image',
            'url' => 'https://picsum.photos/seed/'.Str::slug(Str::limit($prompt, 40, '')).'/1200/800',
            'alt' => $prompt,
            'note' => 'Placeholder image URL. Text/HTML generation uses your configured AI provider; image models can be wired next.',
        ];
    }

    private function systemPrompt(string $type): string
    {
        $common = <<<'TXT'
You are a front-end generator for a visual page builder CMS.
CRITICAL OUTPUT RULES (always follow):
1. Return markup the builder can apply — never plain prose alone.
2. Do NOT wrap the whole answer in markdown code fences.
3. Do NOT include explanations, introductions, or closing notes.
4. Prefer class names prefixed with pb-ai- (or inline styles).
5. If CURRENT HTML is provided, update/improve that markup instead of inventing an unrelated layout.
6. When the user asks for animation, mouse effect, interaction, carousel, tabs, counters, hover, etc.:
   - Put structure in HTML (NEVER omit existing cards/content)
   - Put animation/visual rules in a <style>...</style> block
   - Put behavior in a <script>...</script> block (vanilla JS, no imports, no JSX)
7. Output order: HTML first, then optional <style>, then optional <script>.
8. Scripts must be self-contained and safe: use an IIFE. NEVER use document.write, NEVER set innerHTML on body/documentElement/main, NEVER clear or replace the whole page.
9. If the user only asks to add an effect/animation/JS to existing content, copy CURRENT HTML unchanged (all cards intact), then append style/script only.
TXT;

        $specific = match ($type) {
            'content' => <<<'TXT'
TASK: Rewrite the selected content block.
- Return one HTML element (p, h1-h3, div, ul/ol, or span wrapper).
- Keep a similar tag/structure when CURRENT HTML is provided.
- You may append <style> / <script> if animation or interaction is requested.
- Finish the full response — do not stop mid-tag.
TXT,
            'section' => <<<'TXT'
TASK: Create or update one website section.
- Return exactly one <section>...</section> that is COMPLETE (all cards/items included).
- If the user asks for N cards/points/features, output exactly N items — never fewer.
- Each card MUST be a full element: <article class="pb-ai-card"> with icon/emoji, <h3> title, and <p> body (2–3 sentences). Never leave empty cards.
- Prefer compact copy so all N cards fit; do not stop after 1–2 cards.
- Use a CSS grid layout so all items are visible (e.g. repeat(3,1fr) for 6 cards → 3x2).
- Append <style>...</style> for layout/animation CSS (include @keyframes / transitions when animation is requested).
- Append <script>...</script> whenever animation/interaction is requested. Prefer CSS + a small IIFE; do not rely only on DOMContentLoaded.
- Close every tag. Always end with complete </section>, then style/script if any.
- If CURRENT HTML is provided and the user only wants an effect/animation/JS: return that CURRENT HTML unchanged (same cards/text), then append style/script. Do not invent an empty section.
TXT,
            'page' => <<<'TXT'
TASK: Create or rewrite a full landing page body.
- Return multiple COMPLETE <section>...</section> blocks.
- If counts are specified (e.g. 6 features), include all of them.
- Append shared <style> and <script> blocks at the end when animation/interaction is needed.
- If CURRENT HTML is provided, revise that page unless a full redesign is requested.
TXT,
            default => 'Return valid HTML (plus optional style/script).',
        };

        return $common."\n\n".$specific;
    }

    private function userPrompt(
        string $type,
        string $prompt,
        ?string $context,
        ?string $selectedHtml,
        ?string $selectedText,
    ): string {
        $countHint = null;
        if (preg_match('/\b(\d+)\b.*\b(card|cards|point|points|feature|features|pros?|benefit|benefits|item|items)\b/i', $prompt, $m)
            || preg_match('/\b(card|cards|point|points|feature|features|pros?|benefit|benefits|item|items)\b.*\b(\d+)\b/i', $prompt, $m2)) {
            $countHint = isset($m[1]) ? (int) $m[1] : (int) ($m2[2] ?? 0);
        }

        $wantsMotion = $this->promptWantsMotion($prompt);
        $effectOnly = $this->promptIsEffectOnly($prompt);

        $parts = [
            'MODE: '.$type,
            'USER REQUEST:',
            trim($prompt),
            '',
            'OUTPUT REQUIREMENT:',
            '- Return COMPLETE HTML for the canvas (never truncate mid-card).',
            '- If CSS is needed, include a full <style>...</style> block.',
            '- If JS/animation/interactivity is needed, include a full <script>...</script> block with working vanilla JS.',
            '- Scripts must NOT clear or replace page content (no document.write / body.innerHTML).',
            '- No markdown fences, no commentary outside those tags.',
        ];

        if ($countHint && $countHint > 0) {
            $parts[] = "- REQUIRED COUNT: output exactly {$countHint} complete <article class=\"pb-ai-card\">…</article> cards (title + paragraph each). Do not stop early.";
            $parts[] = '- Keep each card short (title + 2 sentences) so the full set fits in one response.';
        }
        if ($wantsMotion || $effectOnly) {
            $parts[] = '- REQUIRED: include <style> (transitions/transform/@keyframes) PLUS a <script> IIFE for the mouse/animation effect.';
        }
        if ($effectOnly && filled($selectedHtml)) {
            $parts[] = '- EFFECT-ONLY: copy CURRENT HTML verbatim (keep every card and all text). Only add/adjust class names if needed for the effect, then append <style> and <script>.';
        }

        if (filled($selectedHtml)) {
            $parts[] = '';
            $parts[] = 'CURRENT HTML (selected on canvas — update this):';
            $parts[] = trim($selectedHtml);
            $parts[] = $effectOnly
                ? 'Keep CURRENT HTML content intact. Append CSS/JS for the requested effect only.'
                : 'Revise the CURRENT HTML according to the user request. Include any required CSS/JS and keep the full item count.';
        } elseif (filled($selectedText)) {
            $parts[] = '';
            $parts[] = 'CURRENT TEXT:';
            $parts[] = trim($selectedText);
            $parts[] = 'Rewrite this as HTML (plus CSS/JS if needed).';
        } else {
            $parts[] = '';
            $parts[] = 'No selection was provided — create new HTML for this request.';
        }

        if (filled($context)) {
            $parts[] = '';
            $parts[] = 'EXTRA CONTEXT:';
            $parts[] = trim($context);
        }

        return implode("\n", $parts);
    }

    private function wrapContentHtml(string $raw): string
    {
        $html = $this->coerceHtml($raw);
        if ($html !== '') {
            return $html;
        }

        $plain = trim(strip_tags($this->stripFences($raw)));

        return $plain !== '' ? '<p>'.e($plain).'</p>' : '<p></p>';
    }

    private function extractHtml(string $raw, string $mode = 'section', ?string $selectedHtml = null): string
    {
        $html = $this->coerceHtml($raw);
        if ($html !== '') {
            // Ensure section mode has a section wrapper when model returns a fragment
            if ($mode === 'section' && ! preg_match('/<section\b/i', $html)) {
                return '<section class="pb-ai-section">'.$html.'</section>';
            }

            return $html;
        }

        // Prefer keeping the canvas selection over inventing an empty stub section.
        if (filled($selectedHtml)) {
            $kept = $this->coerceHtml($selectedHtml);
            if ($kept !== '') {
                return $kept;
            }
        }

        return $this->fallbackSectionHtml($raw);
    }

    /** Pull usable HTML out of model output even if it includes prose or fences. */
    private function coerceHtml(string $raw): string
    {
        $raw = $this->stripFences($this->normalizeModelText($raw));
        if ($raw === '') {
            return '';
        }

        // Prefer fenced html blocks if still present mid-response
        if (preg_match('/```(?:html|xml)?\s*([\s\S]*?)```/i', $raw, $m)) {
            $raw = trim($m[1]);
        }

        // Drop style/script from the HTML body extract (handled separately).
        // Also strip unclosed style/script tails (common when the model hits max tokens).
        $body = preg_replace('/<style\b[^>]*>.*?<\/style>/is', '', $raw) ?? $raw;
        $body = preg_replace('/<script\b[^>]*>.*?<\/script>/is', '', $body) ?? $body;
        $body = preg_replace('/<style\b[^>]*>[\s\S]*$/i', '', $body) ?? $body;
        $body = preg_replace('/<script\b[^>]*>[\s\S]*$/i', '', $body) ?? $body;
        $body = trim($body);

        if ($body !== '' && str_contains($body, '<')) {
            // If model added preamble text, keep from first tag onward
            if (preg_match('/(<[\s\S]+)/', $body, $m)) {
                return trim($m[1]);
            }

            return $body;
        }

        return '';
    }

    private function extractCss(string $raw): ?string
    {
        $parts = [];

        if (preg_match_all('/<style\b[^>]*>(.*?)<\/style>/is', $raw, $matches)) {
            foreach ($matches[1] as $css) {
                $css = trim($css);
                if ($css !== '') {
                    $parts[] = $css;
                }
            }
        }

        if (preg_match_all('/```(?:css)\s*([\s\S]*?)```/i', $raw, $matches)) {
            foreach ($matches[1] as $css) {
                $css = trim($css);
                if ($css !== '') {
                    $parts[] = $css;
                }
            }
        }

        $parts = array_values(array_unique($parts));

        return $parts === [] ? null : implode("\n\n", $parts);
    }

    private function extractJs(string $raw): ?string
    {
        $parts = [];

        if (preg_match_all('/<script\b([^>]*)>(.*?)<\/script>/is', $raw, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $attrs = $match[1] ?? '';
                $code = trim($match[2] ?? '');
                // Skip external src-only scripts without inline code
                if ($code === '') {
                    if (preg_match('/\bsrc\s*=\s*([\'"])(.*?)\1/i', $attrs, $src)) {
                        $parts[] = '// External script: '.$src[2];
                    }

                    continue;
                }
                $parts[] = $code;
            }
        }

        if (preg_match_all('/```(?:js|javascript)\s*([\s\S]*?)```/i', $raw, $matches)) {
            foreach ($matches[1] as $js) {
                $js = trim($js);
                if ($js !== '') {
                    $parts[] = $js;
                }
            }
        }

        $parts = array_values(array_unique($parts));

        return $parts === [] ? null : implode("\n\n", $parts);
    }

    private function sanitizeJs(?string $js): ?string
    {
        if (! filled($js)) {
            return null;
        }

        $js = trim($js);

        // Strip patterns that wipe the canvas / live page when previewed.
        $dangerous = [
            '/\bdocument\.write\s*\(/i',
            '/\bdocument\.writeln\s*\(/i',
            '/\b(?:document\.)?(?:body|documentElement)\.innerHTML\s*=/i',
            '/\b(?:document\.)?(?:body|documentElement)\.outerHTML\s*=/i',
            '/\b(?:document\.)?querySelector\s*\(\s*[\'"](?:body|html|main)\s*[\'"]\s*\)\s*\.innerHTML\s*=/i',
            '/\blocation\s*(?:\.\s*href)?\s*=/i',
            '/\bwindow\.location\s*=/i',
        ];

        foreach ($dangerous as $pattern) {
            if (preg_match($pattern, $js)) {
                logger()->warning('AI JS rejected as unsafe for canvas', ['snippet' => Str::limit($js, 200)]);

                return $this->fallbackMouseEffectJs();
            }
        }

        return $js;
    }

    private function promptWantsMotion(string $prompt): bool
    {
        return (bool) preg_match(
            '/\b(animat|motion|effect|interact|hover|parallax|fade|slide|js|javascript|function|click|counter|carousel|scroll|mouse|tilt|glow|magnetic)\b/i',
            $prompt,
        );
    }

    /** True when the user mainly wants an effect on existing content, not a redesign. */
    private function promptIsEffectOnly(string $prompt): bool
    {
        $p = trim($prompt);
        if ($p === '') {
            return false;
        }

        $asksEffect = (bool) preg_match(
            '/\b(add|apply|enable|make|give|with)\b.*\b(animat|motion|effect|hover|mouse|js|javascript|script|interact|parallax|tilt|glow)\b|\b(animat|motion|effect|hover|mouse|js|javascript|script)\b/i',
            $p,
        );
        if (! $asksEffect) {
            return false;
        }

        // Redesign / rewrite requests should still replace HTML.
        if (preg_match('/\b(rewrite|redesign|rebuild|replace|new section|from scratch|create (a |an )?(new )?)\b/i', $p)) {
            return false;
        }

        return (bool) preg_match(
            '/\b(add|apply|enable|make)\b|\bmouse\b|\banimat|\beffect\b|\bhover\b|\bjs\b|\bjavascript\b|\bscript\b/i',
            $p,
        );
    }

    private function countStructuralItems(string $html): int
    {
        $article = preg_match_all('/<article\b/i', $html) ?: 0;
        $cards = preg_match_all('/class=["\'][^"\']*\b(?:pb-ai-)?(?:card|feature|pros?|benefit|item)\b/i', $html) ?: 0;
        $h3 = preg_match_all('/<h3\b/i', $html) ?: 0;

        return max($article, $cards, $h3 >= 3 ? $h3 : 0);
    }

    private function shouldKeepExistingHtml(string $aiHtml, string $selectedHtml, string $prompt): bool
    {
        $ai = trim($aiHtml);
        $selected = trim($selectedHtml);
        if ($selected === '') {
            return false;
        }

        if ($ai === '' || $this->looksTruncatedHtml($ai)) {
            return true;
        }

        // Stub fallback from a motion-only prompt (title derived from prompt).
        if (preg_match('/class=["\'][^"\']*\bpb-ai-hero\b/i', $ai)
            && ! preg_match('/class=["\'][^"\']*\bpb-ai-card\b/i', $ai)
            && $this->promptWantsMotion($prompt)) {
            return true;
        }

        $aiItems = $this->countStructuralItems($ai);
        $selItems = $this->countStructuralItems($selected);
        if ($selItems >= 3 && $aiItems < $selItems) {
            return true;
        }

        $aiText = trim(preg_replace('/\s+/', ' ', strip_tags($ai)) ?? '');
        $selText = trim(preg_replace('/\s+/', ' ', strip_tags($selected)) ?? '');
        if (strlen($selText) > 120 && strlen($aiText) < (int) (strlen($selText) * 0.35)) {
            return true;
        }

        if ($this->promptIsEffectOnly($prompt) && $selItems > 0 && $aiItems <= $selItems) {
            // Keep existing when effect-only and AI did not clearly expand content.
            if ($aiItems < $selItems || strlen($aiText) < (int) (strlen($selText) * 0.7)) {
                return true;
            }
        }

        return false;
    }

    private function stripFences(string $raw): string
    {
        $raw = trim($raw);
        if (preg_match('/^```(?:html|css|xml|js|javascript)?\s*(.*?)```$/is', $raw, $m)) {
            return trim($m[1]);
        }

        return preg_replace('/^```(?:html|css|xml|js|javascript)?\s*|\s*```$/i', '', $raw) ?? $raw;
    }

    private function fallbackSectionHtml(string $prompt): string
    {
        $title = e(Str::title(Str::limit(strip_tags($prompt), 60)));

        return <<<HTML
<section class="pb-ai-hero">
  <div class="pb-ai-hero__inner">
    <p class="pb-ai-hero__eyebrow">AI generated</p>
    <h1>{$title}</h1>
    <p class="pb-ai-hero__lead">Crafted from your prompt. Edit freely in the canvas.</p>
  </div>
</section>
HTML;
    }

    private function fallbackSectionCss(): string
    {
        return <<<'CSS'
.pb-ai-hero{padding:80px 24px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#f8fafc;text-align:center}
.pb-ai-hero__eyebrow{letter-spacing:.2em;text-transform:uppercase;font-size:12px;opacity:.7}
.pb-ai-hero h1{font-size:clamp(2rem,5vw,3.5rem);margin:12px 0;font-family:Georgia,serif}
.pb-ai-hero__lead{max-width:560px;margin:0 auto 24px;opacity:.85;line-height:1.6}
CSS;
    }

    private function fallbackMotionCss(): string
    {
        return <<<'CSS'
@keyframes pb-ai-fade-up{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.pb-ai-card,.pb-ai-hero [class*="card"],[class*="card"]{
  animation:pb-ai-fade-up .65s ease both;
  transition:transform .25s ease, box-shadow .25s ease;
  will-change:transform;
}
.pb-ai-card:nth-child(2),[class*="card"]:nth-child(2){animation-delay:.08s}
.pb-ai-card:nth-child(3),[class*="card"]:nth-child(3){animation-delay:.16s}
.pb-ai-card:nth-child(4),[class*="card"]:nth-child(4){animation-delay:.24s}
.pb-ai-card:nth-child(5),[class*="card"]:nth-child(5){animation-delay:.32s}
.pb-ai-card:nth-child(6),[class*="card"]:nth-child(6){animation-delay:.4s}
.pb-ai-card.is-hot,[class*="card"].is-hot{transform:translateY(-6px) scale(1.02);box-shadow:0 16px 40px rgba(17,164,255,.28)}
CSS;
    }

    private function fallbackMouseEffectJs(): string
    {
        return <<<'JS'
(function () {
  var root = document;
  var cards = root.querySelectorAll('.pb-ai-card, article, [class*="card"]');
  if (!cards.length) return;
  cards.forEach(function (card) {
    if (card.getAttribute('data-pb-mouse') === '1') return;
    card.setAttribute('data-pb-mouse', '1');
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      var y = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
      card.style.transform = 'perspective(700px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 10) + 'deg) translateY(-4px)';
      card.classList.add('is-hot');
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.classList.remove('is-hot');
    });
  });
})();
JS;
    }

    private function looksTruncatedHtml(string $html): bool
    {
        $html = trim($html);
        if ($html === '') {
            return true;
        }

        // Unclosed section / cut mid-attribute are common truncation signatures.
        if (preg_match('/<section\b/i', $html) && ! preg_match('/<\/section>/i', $html)) {
            return true;
        }

        if (preg_match('/<(?:div|article|p|h[1-6]|ul|ol|li|a|span)\b[^>]*$/i', $html)) {
            return true;
        }

        return (bool) preg_match('/\b(class|style|href)=["\'][^"\']*$/', $html);
    }
}
