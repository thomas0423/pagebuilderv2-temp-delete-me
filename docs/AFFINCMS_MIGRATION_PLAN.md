# AffinCMS → PageBuilder V2 Migration Plan

## Source analysis

Dump: `affincms_admin_20260714_124406.sql` (~955 MB, MySQL).

Legacy stack: Laravel + PHPageBuilder (GrapesJS) with many Nova-style content tables.

### Priority sources (Phase 1)

| Legacy table | Target | Notes |
|---|---|---|
| `pagebuilder__pages` + `pagebuilder__page_translations` | `pages` | EN locale title/route → title/slug; GrapesJS `data` HTML → compiled HTML + editable wrapper `project_json` |
| `discover_promotions` | `content_modules` (`type=promotion`) | Primary public promotions (~948 rows) |
| `a1addin_promotions` | `content_modules` (`type=promotion`) | Tagged `source_channel=a1addin` |
| `affin_always_announcement_lists` | `content_modules` (`type=announcement`) | Public announcements (~733 rows) |
| `a1addin_announcements` | `content_modules` (`type=announcement`) | Tagged `source_channel=a1addin` |
| `articles` | `content_modules` (`type=news`) | Editorial articles |
| `internal_news` | `content_modules` (`type=news`) | Tagged `source_channel=internal` |
| `internal_annoucements` | `content_modules` (`type=announcement`) | Tagged `source_channel=internal` |
| `internal_promotions` | `content_modules` (`type=promotion`) | Tagged `source_channel=internal` |

### Deferred (Phase 2+)

FAQ, branches, careers, media galleries, rates, publications, menus/admin menus, uploads/media binary files, full multilingual (`ms`/`zh`) as first-class locales.

## Target model

### Pages (existing)

Keep PageBuilder V2 `pages` draft/publish snapshots.

Import rules:

1. Prefer English translation (`locale=en`); fallback to page `name`.
2. Slug from translation `route` (strip leading `/`); uniquify collisions.
3. Extract HTML from PHPageBuilder JSON `data.html` (join array / unwrap `[block …]` placeholders into HTML when present).
4. Wrap HTML in a minimal GrapesJS `project_json` so the editor can open migrated pages.
5. Mark imported pages `published` when content exists; store `legacy_page_id` in `meta` via settings map table `import_id_maps`.
6. Idempotent upsert keyed by `(source_table, source_id)`.

### Content modules (new)

Unified table `content_modules` so Promotions / Announcements / News / future types share one CRUD surface:

- `type`: `promotion` | `announcement` | `news` | `article`
- `title`, `slug`, `summary`, `body` (HTML)
- `image_url`, `banner_url`, `external_url`
- `status`: `draft` | `published` | `archived`
- `published_on`, `starts_at`, `ends_at`
- `is_pinned`, `sort_order`
- `source_table`, `source_id`, `source_channel` (for re-import)
- `meta` JSON (extra locales, category ids, pdfs, etc.)

Admin: Modules screen with type filter + full create/update/delete.
API: `/api/content-modules` REST resource (+ optional `?type=`).

## Execution steps

1. **Schema + CRUD** — migrate `content_modules` (+ `import_id_maps`), models, controllers, routes, admin UI.
2. **Staging load** — create MySQL DB `affincms_legacy` and import the dump (one-time, long).
3. **Transform** — `php artisan affin:migrate-from-legacy` reads staging DB, writes into `pagebuilderv2`.
4. **Verify** — counts, spot-check pages/modules in admin, publish smoke test.
5. **Phase 2** — media URL rewrite, menus, remaining module families.

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Dump size / import time | Staging DB; importer streams by table |
| PHPageBuilder shortcodes (`[block slug=…]`) | Keep as HTML comments / placeholders; editable later |
| Soft-deleted legacy rows | Skip where `deleted_at` is set |
| Slug collisions | Append `-legacy-{id}` |
| Media binaries not in SQL | Keep original `/storage/...` paths; media copy later |
| Re-runs | Upsert on `(source_table, source_id)` |

## Success criteria

- Admin can CRUD **Pages** (existing) and **Modules** (promotions/announcements/news).
- Legacy pages and Phase-1 module rows appear in PageBuilder V2 after `affin:migrate-from-legacy`.
- Command is idempotent (safe to re-run).
