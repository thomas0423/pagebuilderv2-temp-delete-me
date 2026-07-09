<?php

namespace App\Services;

use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AiService
{
    public function __construct(private SettingsService $settings) {}

    public function ensureConfigured(): void
    {
        if (! $this->settings->aiApiKey()) {
            abort(422, 'Please configure the AI API key in Settings → AI before using this feature.');
        }
    }

    public function generate(string $type, string $prompt, ?string $context = null): array
    {
        $this->ensureConfigured();

        if ($type === 'image') {
            return $this->generateImage($prompt);
        }

        $system = $this->systemPrompt($type);
        $user = $this->userPrompt($type, $prompt, $context);
        $raw = $this->chat($system, $user);

        return match ($type) {
            'content' => [
                'type' => 'content',
                'html' => $this->wrapContentHtml($raw),
                'text' => strip_tags($raw),
            ],
            'section' => [
                'type' => 'section',
                'html' => $this->extractHtml($raw),
                'css' => $this->extractCss($raw) ?: $this->fallbackSectionCss(),
            ],
            'page' => [
                'type' => 'page',
                'html' => $this->extractHtml($raw),
                'css' => $this->extractCss($raw) ?: $this->fallbackSectionCss(),
            ],
            default => abort(422, 'Unsupported AI generation type.'),
        };
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
            @set_time_limit(120);
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

        $payload = [
            'model' => $model,
            'messages' => [
                ['role' => 'system', 'content' => $system],
                ['role' => 'user', 'content' => $user],
            ],
            'temperature' => 0.7,
            'max_tokens' => 1200,
            'max_completion_tokens' => 1200,
        ];

        // MiniMax-M* models think by default and can take >30s; disable for pagebuilder latency.
        if ($providerKey === 'minimax') {
            $payload['thinking'] = ['type' => 'disabled'];
            // Prefer shorter generations in the builder so artisan serve stays healthy.
            $payload['max_tokens'] = 800;
            $payload['max_completion_tokens'] = 800;
        }

        $response = Http::timeout(60)
            ->connectTimeout(10)
            ->retry(1, 500, throw: false)
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

        $response = Http::timeout(90)
            ->withHeaders([
                'x-api-key' => $apiKey,
                'anthropic-version' => '2023-06-01',
                'Accept' => 'application/json',
            ])
            ->post($base.'/v1/messages', [
                'model' => $model,
                'max_tokens' => 4096,
                'system' => $system,
                'messages' => [
                    ['role' => 'user', 'content' => $user],
                ],
            ])
            ->throw();

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

        $response = Http::timeout(90)
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
                    'temperature' => 0.7,
                ],
            ])
            ->throw();

        $parts = data_get($response->json(), 'candidates.0.content.parts', []);
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
        return match ($type) {
            'content' => <<<'TXT'
You rewrite short website copy for a page builder CMS.
If selected text/HTML is provided, rewrite that content only — do not invent a full page or section.
Return clean HTML only (prefer a single p/h2/h3/div). Allowed tags: p, strong, em, a, ul, ol, li, h2, h3, div, span, br.
No markdown fences, no explanation, no surrounding <section>.
TXT,
            'section' => <<<'TXT'
You generate one self-contained website section for a visual page builder.
Return HTML for a single <section>...</section>, optionally followed by a <style>...</style> block with scoped class names.
Use inline-friendly class names prefixed with pb-ai-. No markdown fences, no commentary outside HTML/CSS.
TXT,
            'page' => <<<'TXT'
You generate a multi-section landing page for a visual page builder.
Return multiple <section> blocks and optionally one <style>...</style> block.
Use class names prefixed with pb-ai-. No markdown fences, no commentary outside HTML/CSS.
TXT,
            default => 'You are a helpful web content assistant. Return only the requested markup.',
        };
    }

    private function userPrompt(string $type, string $prompt, ?string $context): string
    {
        $parts = ["Type: {$type}", 'Prompt: '.$prompt];
        if (filled($context)) {
            $parts[] = 'Context: '.$context;
        }

        return implode("\n", $parts);
    }

    private function wrapContentHtml(string $raw): string
    {
        $html = $this->stripFences($raw);
        if (str_contains($html, '<')) {
            return $html;
        }

        return '<p>'.e($html).'</p>';
    }

    private function extractHtml(string $raw): string
    {
        $raw = $this->stripFences($raw);
        $withoutStyle = preg_replace('/<style\b[^>]*>.*?<\/style>/is', '', $raw) ?? $raw;
        $html = trim($withoutStyle);

        return $html !== '' ? $html : $this->fallbackSectionHtml($raw);
    }

    private function extractCss(string $raw): ?string
    {
        if (preg_match_all('/<style\b[^>]*>(.*?)<\/style>/is', $raw, $matches)) {
            return trim(implode("\n", $matches[1]));
        }

        return null;
    }

    private function stripFences(string $raw): string
    {
        $raw = trim($raw);
        if (preg_match('/^```(?:html|css|xml)?\s*(.*?)```$/is', $raw, $m)) {
            return trim($m[1]);
        }

        return preg_replace('/^```(?:html|css|xml)?\s*|\s*```$/i', '', $raw) ?? $raw;
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
}
