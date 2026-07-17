<?php

namespace App\Console\Commands;

use App\Models\ContentModule;
use App\Models\Page;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class MigrateAffinCmsCommand extends Command
{
    protected $signature = 'affin:migrate-from-legacy
        {--connection=affincms_legacy : Legacy DB connection name}
        {--pages : Import pagebuilder pages only}
        {--modules : Import content modules only}
        {--limit=0 : Limit rows per source table (0 = all)}';

    protected $description = 'Migrate AffinCMS legacy MySQL data into PageBuilder V2 pages and content modules';

    public function handle(): int
    {
        $connection = (string) $this->option('connection');
        $onlyPages = (bool) $this->option('pages');
        $onlyModules = (bool) $this->option('modules');
        $limit = (int) $this->option('limit');

        if (! $onlyPages && ! $onlyModules) {
            $onlyPages = true;
            $onlyModules = true;
        }

        try {
            DB::connection($connection)->getPdo();
        } catch (Throwable $e) {
            $this->error("Cannot connect to legacy DB [{$connection}]: ".$e->getMessage());
            $this->line('Configure AFFINCMS_DB_* in .env and add the connection, then import the SQL dump into that database.');

            return self::FAILURE;
        }

        if ($onlyPages) {
            $this->importPages($connection, $limit);
        }

        if ($onlyModules) {
            $this->importModules($connection, $limit);
        }

        $this->info('Migration finished.');
        $this->line('Pages: '.Page::query()->whereNotNull('source_table')->count());
        $this->line('Modules: '.ContentModule::query()->whereNotNull('source_table')->count());

        return self::SUCCESS;
    }

    private function importPages(string $connection, int $limit): void
    {
        $this->info('Importing pages…');

        $query = DB::connection($connection)
            ->table('pagebuilder__pages as p')
            ->leftJoin('pagebuilder__page_translations as t', function ($join) {
                $join->on('t.page_id', '=', 'p.id')->where('t.locale', '=', 'en');
            })
            ->select([
                'p.id',
                'p.name',
                'p.layout',
                'p.data',
                'p.created_at',
                'p.updated_at',
                't.title as en_title',
                't.route as en_route',
                't.description as en_description',
                't.og_title',
                't.og_description',
            ])
            ->orderBy('p.id');

        if ($limit > 0) {
            $query->limit($limit);
        }

        $count = 0;
        $query->chunk(50, function ($rows) use (&$count) {
            foreach ($rows as $row) {
                $html = $this->extractPageHtml($row->data);
                $title = trim((string) ($row->en_title ?: $row->name ?: 'Untitled '.$row->id));
                $slug = $this->slugFromRoute($row->en_route, $title, (string) $row->id);
                $project = $this->wrapHtmlAsProject($html, $title);
                $metaTitle = $row->og_title ?: $title;
                $metaDescription = $row->og_description ?: $row->en_description;

                Page::query()->updateOrCreate(
                    [
                        'source_table' => 'pagebuilder__pages',
                        'source_id' => (string) $row->id,
                    ],
                    [
                        'title' => $title,
                        'slug' => $this->uniquePageSlug($slug, 'pagebuilder__pages', (string) $row->id),
                        'status' => filled($html) ? 'published' : 'draft',
                        'has_unpublished_changes' => false,
                        'project_json' => $project,
                        'compiled_html' => $html,
                        'compiled_css' => '',
                        'published_project_json' => $project,
                        'published_html' => $html,
                        'published_css' => '',
                        'meta_title' => $metaTitle,
                        'meta_description' => $metaDescription,
                        'published_at' => filled($html) ? ($row->updated_at ?: now()) : null,
                    ]
                );
                $count++;
            }
            $this->line("  pages processed: {$count}");
        });

        $this->info("Pages imported/updated: {$count}");
    }

    private function importModules(string $connection, int $limit): void
    {
        $this->info('Importing content modules…');

        $sources = [
            [
                'table' => 'discover_promotions',
                'type' => 'promotion',
                'channel' => 'discover',
                'map' => fn ($r) => [
                    'title' => $r->title_in_english,
                    'body' => $r->content_in_english,
                    'summary' => Str::limit(strip_tags((string) $r->footer_in_english), 300),
                    'image_url' => $r->card_img_in_english,
                    'banner_url' => $r->cover_img_in_english,
                    'external_url' => $r->url,
                    'published_on' => null,
                    'starts_at' => null,
                    'ends_at' => null,
                    'is_pinned' => (bool) ($r->is_great ?? false),
                    'sort_order' => 0,
                    'meta' => [
                        'title_ms' => $r->title_in_malay,
                        'title_zh' => $r->title_in_chinese,
                        'category_id' => $r->category_id,
                        'group_id' => $r->group_id ?? null,
                    ],
                ],
            ],
            [
                'table' => 'a1addin_promotions',
                'type' => 'promotion',
                'channel' => 'a1addin',
                'map' => fn ($r) => [
                    'title' => $r->title_in_english,
                    'body' => $r->content_in_english,
                    'summary' => null,
                    'image_url' => $r->card_image_in_english,
                    'banner_url' => $r->banner_image_in_english,
                    'external_url' => null,
                    'published_on' => $r->start_date,
                    'starts_at' => $r->start_date,
                    'ends_at' => $r->end_date,
                    'is_pinned' => false,
                    'sort_order' => (int) ($r->order ?? 0),
                    'meta' => [
                        'title_ms' => $r->title_in_malay,
                        'title_zh' => $r->title_in_chinese,
                        'category_id' => $r->category_id,
                    ],
                ],
            ],
            [
                'table' => 'affin_always_announcement_lists',
                'type' => 'announcement',
                'channel' => 'affin_always',
                'map' => fn ($r) => [
                    'title' => $r->title_in_english,
                    'body' => $r->content_in_english,
                    'summary' => null,
                    'image_url' => null,
                    'banner_url' => null,
                    'external_url' => $r->url,
                    'published_on' => $r->date,
                    'starts_at' => null,
                    'ends_at' => null,
                    'is_pinned' => (bool) ($r->latest_highlight ?? false),
                    'sort_order' => 0,
                    'meta' => [
                        'title_ms' => $r->title_in_malay,
                        'title_zh' => $r->title_in_chinese,
                    ],
                ],
            ],
            [
                'table' => 'a1addin_announcements',
                'type' => 'announcement',
                'channel' => 'a1addin',
                'map' => fn ($r) => [
                    'title' => $r->title_in_english,
                    'body' => $r->content_in_english,
                    'summary' => null,
                    'image_url' => null,
                    'banner_url' => null,
                    'external_url' => null,
                    'published_on' => $r->date,
                    'starts_at' => null,
                    'ends_at' => null,
                    'is_pinned' => false,
                    'sort_order' => 0,
                    'meta' => [
                        'title_ms' => $r->title_in_malay,
                        'title_zh' => $r->title_in_chinese,
                    ],
                ],
            ],
            [
                'table' => 'articles',
                'type' => 'article',
                'channel' => 'public',
                'map' => fn ($r) => [
                    'title' => $r->title_in_english,
                    'body' => $r->content_in_english,
                    'summary' => $r->description_in_english,
                    'image_url' => $r->cover_image_in_english,
                    'banner_url' => $r->banner_image_in_english,
                    'external_url' => null,
                    'published_on' => $r->date,
                    'starts_at' => null,
                    'ends_at' => null,
                    'is_pinned' => false,
                    'sort_order' => 0,
                    'meta' => [
                        'author' => $r->author,
                        'category_id' => $r->category_id,
                        'title_ms' => $r->title_in_malay,
                        'title_zh' => $r->title_in_chinese,
                    ],
                ],
            ],
            [
                'table' => 'internal_news',
                'type' => 'news',
                'channel' => 'internal',
                'map' => fn ($r) => [
                    'title' => $r->title_in_english ?: $r->title_in_malay ?: 'News '.$r->id,
                    'body' => $r->content_in_english ?: $r->content_in_malay,
                    'summary' => null,
                    'image_url' => $r->image_in_english,
                    'banner_url' => null,
                    'external_url' => $r->pdf_in_english,
                    'published_on' => $r->date,
                    'starts_at' => null,
                    'ends_at' => null,
                    'is_pinned' => (bool) ($r->is_pinned ?? false),
                    'sort_order' => 0,
                    'meta' => [
                        'title_ms' => $r->title_in_malay,
                        'title_zh' => $r->title_in_chinese,
                        'pdf_ms' => $r->pdf_in_malay,
                        'pdf_zh' => $r->pdf_in_chinese,
                    ],
                ],
            ],
            [
                'table' => 'internal_annoucements',
                'type' => 'announcement',
                'channel' => 'internal',
                'map' => fn ($r) => [
                    'title' => $r->title_in_english ?: $r->title_in_malay ?: 'Announcement '.$r->id,
                    'body' => $r->content_in_english ?: $r->content_in_malay,
                    'summary' => null,
                    'image_url' => $r->image_in_english,
                    'banner_url' => null,
                    'external_url' => $r->pdf_in_english,
                    'published_on' => $r->date,
                    'starts_at' => null,
                    'ends_at' => null,
                    'is_pinned' => (bool) ($r->is_pinned ?? false),
                    'sort_order' => 0,
                    'meta' => [
                        'title_ms' => $r->title_in_malay,
                        'title_zh' => $r->title_in_chinese,
                        'legacy_type' => $r->type ?? null,
                    ],
                ],
            ],
            [
                'table' => 'internal_promotions',
                'type' => 'promotion',
                'channel' => 'internal',
                'map' => fn ($r) => $this->mapInternalPromotionLike($r),
            ],
        ];

        foreach ($sources as $source) {
            if (! $this->legacyTableExists($connection, $source['table'])) {
                $this->warn("Skipping missing table: {$source['table']}");
                continue;
            }

            $query = DB::connection($connection)->table($source['table'])->orderBy('id');
            if ($this->legacyHasColumn($connection, $source['table'], 'deleted_at')) {
                $query->whereNull('deleted_at');
            }
            if ($limit > 0) {
                $query->limit($limit);
            }

            $count = 0;
            $query->chunk(100, function ($rows) use ($source, &$count) {
                foreach ($rows as $row) {
                    $mapped = ($source['map'])($row);
                    $title = trim((string) ($mapped['title'] ?? ''));
                    if ($title === '') {
                        continue;
                    }

                    $slugBase = Str::slug($title) ?: $source['type'].'-'.$row->id;
                    $slug = $this->uniqueModuleSlug($slugBase, $source['table'], (string) $row->id);

                    ContentModule::query()->updateOrCreate(
                        [
                            'source_table' => $source['table'],
                            'source_id' => (string) $row->id,
                        ],
                        [
                            'type' => $source['type'],
                            'title' => Str::limit($title, 255, ''),
                            'slug' => $slug,
                            'summary' => $mapped['summary'],
                            'body' => $mapped['body'],
                            'image_url' => $mapped['image_url'],
                            'banner_url' => $mapped['banner_url'],
                            'external_url' => $mapped['external_url'],
                            'status' => 'published',
                            'published_on' => $mapped['published_on'],
                            'starts_at' => $mapped['starts_at'],
                            'ends_at' => $mapped['ends_at'],
                            'is_pinned' => (bool) $mapped['is_pinned'],
                            'sort_order' => (int) $mapped['sort_order'],
                            'source_channel' => $source['channel'],
                            'meta' => $mapped['meta'] ?? [],
                        ]
                    );
                    $count++;
                }
            });

            $this->info("{$source['table']}: {$count} rows");
        }
    }

    /** @return array<string, mixed> */
    private function mapInternalPromotionLike(object $r): array
    {
        return [
            'title' => $r->title_in_english ?? $r->title_in_malay ?? ('Promotion '.$r->id),
            'body' => $r->content_in_english ?? $r->content_in_malay ?? null,
            'summary' => null,
            'image_url' => $r->image_in_english ?? null,
            'banner_url' => null,
            'external_url' => $r->pdf_in_english ?? null,
            'published_on' => $r->date ?? null,
            'starts_at' => null,
            'ends_at' => null,
            'is_pinned' => (bool) ($r->is_pinned ?? false),
            'sort_order' => 0,
            'meta' => [
                'title_ms' => $r->title_in_malay ?? null,
                'title_zh' => $r->title_in_chinese ?? null,
            ],
        ];
    }

    private function extractPageHtml(?string $data): string
    {
        if (! filled($data)) {
            return '';
        }

        $decoded = json_decode($data, true);
        if (! is_array($decoded)) {
            return $this->normalizeBlockShortcodes($data);
        }

        $parts = [];
        if (isset($decoded['html']) && is_array($decoded['html'])) {
            foreach ($decoded['html'] as $chunk) {
                if (is_string($chunk) && $chunk !== '') {
                    $parts[] = $chunk;
                }
            }
        } elseif (isset($decoded['html']) && is_string($decoded['html'])) {
            $parts[] = $decoded['html'];
        }

        $html = implode("\n", $parts);
        if ($html === '' && isset($decoded['pages'])) {
            // Already grapes-like — leave empty body; store raw in meta via caller if needed
            return '';
        }

        return $this->normalizeBlockShortcodes($html);
    }

    private function normalizeBlockShortcodes(string $html): string
    {
        return (string) preg_replace_callback(
            '/\[block\s+slug=["\']([^"\']+)["\']\s+id=["\']([^"\']+)["\']\]/i',
            fn ($m) => '<!-- migrated-block slug="'.$m[1].'" id="'.$m[2].'" -->',
            $html
        );
    }

    /** @return array<string, mixed> */
    private function wrapHtmlAsProject(string $html, string $title): array
    {
        $content = $html !== ''
            ? $html
            : '<h1>'.e($title).'</h1><p>Migrated page — content was empty or block-only.</p>';

        return [
            'pages' => [[
                'frames' => [[
                    'component' => [
                        'type' => 'wrapper',
                        'components' => [[
                            'type' => 'text',
                            'content' => $content,
                        ]],
                    ],
                ]],
            ]],
        ];
    }

    private function slugFromRoute(?string $route, string $title, string $legacyId): string
    {
        $route = trim((string) $route);
        $route = trim($route, '/');
        if ($route !== '') {
            $slug = Str::slug(str_replace('/', '-', $route));
            if ($slug !== '') {
                return $slug;
            }
        }

        $slug = Str::slug($title);

        return $slug !== '' ? $slug : 'page-'.$legacyId;
    }

    private function uniquePageSlug(string $slug, string $sourceTable, string $sourceId): string
    {
        $existing = Page::query()
            ->where('slug', $slug)
            ->where(function ($q) use ($sourceTable, $sourceId) {
                $q->whereNull('source_table')
                    ->orWhere('source_table', '!=', $sourceTable)
                    ->orWhere('source_id', '!=', $sourceId);
            })
            ->exists();

        return $existing ? $slug.'-legacy-'.$sourceId : $slug;
    }

    private function uniqueModuleSlug(string $slug, string $sourceTable, string $sourceId): string
    {
        $existing = ContentModule::query()
            ->where('slug', $slug)
            ->where(function ($q) use ($sourceTable, $sourceId) {
                $q->whereNull('source_table')
                    ->orWhere('source_table', '!=', $sourceTable)
                    ->orWhere('source_id', '!=', $sourceId);
            })
            ->exists();

        return $existing ? Str::limit($slug, 180, '').'-legacy-'.$sourceId : $slug;
    }

    private function legacyTableExists(string $connection, string $table): bool
    {
        try {
            return DB::connection($connection)->getSchemaBuilder()->hasTable($table);
        } catch (Throwable) {
            return false;
        }
    }

    private function legacyHasColumn(string $connection, string $table, string $column): bool
    {
        try {
            return DB::connection($connection)->getSchemaBuilder()->hasColumn($table, $column);
        } catch (Throwable) {
            return false;
        }
    }
}
