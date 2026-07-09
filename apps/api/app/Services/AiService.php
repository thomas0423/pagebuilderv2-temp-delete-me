<?php

namespace App\Services;

use Illuminate\Support\Str;

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

        // Live provider wiring comes next; for now return structured demo content
        // once a key is present so the flow is end-to-end.
        return match ($type) {
            'content' => [
                'type' => 'content',
                'html' => '<p>'.e($this->polish($prompt)).'</p>',
                'text' => $this->polish($prompt),
            ],
            'section' => [
                'type' => 'section',
                'html' => $this->sectionHtml($prompt),
                'css' => $this->sectionCss(),
            ],
            'page' => [
                'type' => 'page',
                'html' => $this->pageHtml($prompt),
                'css' => $this->sectionCss(),
            ],
            'image' => [
                'type' => 'image',
                'url' => 'https://picsum.photos/seed/'.Str::slug(Str::limit($prompt, 40, '')).'/1200/800',
                'alt' => $prompt,
                'note' => 'Placeholder image URL. Connect a real image model when ready.',
            ],
            default => abort(422, 'Unsupported AI generation type.'),
        };
    }

    private function polish(string $prompt): string
    {
        return trim($prompt) !== ''
            ? 'Generated for: '.$prompt
            : 'Fresh content ready for your page.';
    }

    private function sectionHtml(string $prompt): string
    {
        $title = e(Str::title(Str::limit($prompt, 60)));

        return <<<HTML
<section class="pb-ai-hero">
  <div class="pb-ai-hero__inner">
    <p class="pb-ai-hero__eyebrow">AI generated</p>
    <h1>{$title}</h1>
    <p class="pb-ai-hero__lead">Crafted from your prompt. Edit freely in the canvas — typography, spacing, and media are all yours.</p>
    <a class="pb-ai-hero__cta" href="#contact">Get started</a>
  </div>
</section>
HTML;
    }

    private function pageHtml(string $prompt): string
    {
        return $this->sectionHtml($prompt).<<<'HTML'
<section class="pb-ai-features">
  <h2>Why teams choose this</h2>
  <div class="pb-ai-features__grid">
    <div><h3>Drag & drop</h3><p>Build layouts visually without waiting on developers.</p></div>
    <div><h3>AI assist</h3><p>Generate copy, sections, or full pages from a prompt.</p></div>
    <div><h3>Custom code</h3><p>Drop HTML, CSS, or scripts wherever you need them.</p></div>
  </div>
</section>
HTML;
    }

    private function sectionCss(): string
    {
        return <<<'CSS'
.pb-ai-hero{padding:80px 24px;background:linear-gradient(135deg,#0f172a,#1e293b);color:#f8fafc;text-align:center}
.pb-ai-hero__eyebrow{letter-spacing:.2em;text-transform:uppercase;font-size:12px;opacity:.7}
.pb-ai-hero h1{font-size:clamp(2rem,5vw,3.5rem);margin:12px 0;font-family:Georgia,serif}
.pb-ai-hero__lead{max-width:560px;margin:0 auto 24px;opacity:.85;line-height:1.6}
.pb-ai-hero__cta{display:inline-block;padding:12px 22px;background:#f97316;color:#111;border-radius:999px;text-decoration:none;font-weight:600}
.pb-ai-features{padding:64px 24px;background:#fff7ed;color:#1c1917}
.pb-ai-features h2{text-align:center;font-family:Georgia,serif;margin-bottom:32px}
.pb-ai-features__grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:20px;max-width:960px;margin:0 auto}
.pb-ai-features__grid div{padding:20px;background:#fff;border:1px solid #fed7aa;border-radius:16px}
CSS;
    }
}
