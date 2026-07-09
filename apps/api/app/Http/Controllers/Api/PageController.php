<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        return Page::query()->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:pages,slug'],
        ]);

        $slug = $data['slug'] ?? Str::slug($data['title']);
        $html = '<h1>'.e($data['title']).'</h1><p>Start building.</p>';

        $page = Page::query()->create([
            'title' => $data['title'],
            'slug' => $slug,
            'status' => 'draft',
            'has_unpublished_changes' => true,
            'project_json' => [
                'pages' => [[
                    'frames' => [[
                        'component' => [
                            'type' => 'wrapper',
                            'components' => [[
                                'type' => 'text',
                                'content' => '<h1>'.$data['title'].'</h1><p>Start building — drag blocks from the left, or ask AI.</p>',
                            ]],
                        ],
                    ]],
                ]],
            ],
            'compiled_html' => $html,
            'compiled_css' => '',
            'updated_by' => $request->user()->id,
        ]);

        return response()->json($page, 201);
    }

    public function show(Page $page)
    {
        return $page;
    }

    /**
     * Save draft — updates working copy only.
     * Does NOT remove the live published snapshot.
     */
    public function update(Request $request, Page $page)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'slug' => ['sometimes', 'string', 'max:255', 'unique:pages,slug,'.$page->id],
            'project_json' => ['nullable', 'array'],
            'compiled_html' => ['nullable', 'string'],
            'compiled_css' => ['nullable', 'string'],
            'custom_head' => ['nullable', 'string'],
            'custom_body_scripts' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        if (array_key_exists('compiled_html', $data) && is_string($data['compiled_html'])) {
            $data['compiled_html'] = $this->sanitizeHtml($data['compiled_html']);
        }

        // Keep "published" status if the page is already live — only mark unpublished changes
        if ($page->isLive()) {
            $data['status'] = 'published';
            $data['has_unpublished_changes'] = true;
        } else {
            $data['status'] = 'draft';
            $data['has_unpublished_changes'] = true;
        }

        $data['updated_by'] = $request->user()->id;
        $page->update($data);

        return $page->fresh();
    }

    public function destroy(Page $page)
    {
        $page->delete();

        return response()->json(['message' => 'Deleted']);
    }

    /**
     * Publish — copy draft snapshot to live snapshot.
     */
    public function publish(Request $request, Page $page)
    {
        $data = $request->validate([
            'project_json' => ['nullable', 'array'],
            'compiled_html' => ['nullable', 'string'],
            'compiled_css' => ['nullable', 'string'],
            'custom_head' => ['nullable', 'string'],
            'custom_body_scripts' => ['nullable', 'string'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
        ]);

        if (array_key_exists('compiled_html', $data) && is_string($data['compiled_html'])) {
            $data['compiled_html'] = $this->sanitizeHtml($data['compiled_html']);
        }

        // Apply latest draft payload first (if sent)
        $page->fill([
            ...$data,
            'updated_by' => $request->user()->id,
        ]);

        $html = $this->sanitizeHtml((string) ($page->compiled_html ?? ''));
        $css = (string) ($page->compiled_css ?? '');

        $page->fill([
            'compiled_html' => $html,
            'compiled_css' => $css,
            'published_html' => $html,
            'published_css' => $css,
            'published_project_json' => $page->project_json,
            'status' => 'published',
            'has_unpublished_changes' => false,
            'published_at' => now(),
        ]);
        $page->save();

        return $page->fresh();
    }

    private function sanitizeHtml(string $html): string
    {
        $html = preg_replace('/^[\s\S]*?<body[^>]*>/i', '', $html) ?? $html;
        $html = preg_replace('/<\/body>[\s\S]*$/i', '', $html) ?? $html;
        $html = preg_replace('/<\/?html[^>]*>/i', '', $html) ?? $html;

        return trim($html);
    }
}
