<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentModule;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ContentModuleController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type');

        return ContentModule::query()
            ->ofType(is_string($type) ? $type : null)
            ->orderByDesc('is_pinned')
            ->orderBy('sort_order')
            ->orderByDesc('published_on')
            ->orderByDesc('id')
            ->get();
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['slug'] ?? Str::slug($data['title']));
        $data['status'] = $data['status'] ?? 'draft';
        $data['is_pinned'] = $data['is_pinned'] ?? false;
        $data['sort_order'] = $data['sort_order'] ?? 0;

        return response()->json(ContentModule::query()->create($data), 201);
    }

    public function show(ContentModule $contentModule)
    {
        return $contentModule;
    }

    public function update(Request $request, ContentModule $contentModule)
    {
        $data = $this->validated($request, $contentModule);

        if (array_key_exists('slug', $data) && filled($data['slug'])) {
            $data['slug'] = $this->uniqueSlug($data['slug'], $contentModule->id);
        }

        $contentModule->update($data);

        return $contentModule->fresh();
    }

    public function destroy(ContentModule $contentModule)
    {
        $contentModule->delete();

        return response()->json(['message' => 'Deleted']);
    }

    /** @return array<string, mixed> */
    private function validated(Request $request, ?ContentModule $existing = null): array
    {
        $required = $existing ? 'sometimes' : 'required';

        return $request->validate([
            'type' => [$required, Rule::in(ContentModule::TYPES)],
            'title' => [$required, 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255'],
            'summary' => ['nullable', 'string'],
            'body' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string', 'max:2048'],
            'banner_url' => ['nullable', 'string', 'max:2048'],
            'external_url' => ['nullable', 'string', 'max:2048'],
            'status' => ['nullable', Rule::in(ContentModule::STATUSES)],
            'published_on' => ['nullable', 'date'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date'],
            'is_pinned' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'source_channel' => ['nullable', 'string', 'max:64'],
            'meta' => ['nullable', 'array'],
        ]);
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug) ?: 'module';
        $candidate = $base;
        $i = 2;

        while (
            ContentModule::query()
                ->where('slug', $candidate)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $candidate = $base.'-'.$i;
            $i++;
        }

        return $candidate;
    }
}
