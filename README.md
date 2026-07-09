# PageBuilder V2

Local-first AI-capable CMS: **Laravel API + public site** and **React admin** with GrapesJS page builder.

Path: `/Users/binghaothai/Workspace/Twiport/pagebuilderv2`

## Quick start (one command)

```bash
cd /Users/binghaothai/Workspace/Twiport/pagebuilderv2
npm run dev
```

- Admin: http://localhost:5173  
- Public site / API: http://localhost:8000  
- Login: `admin@pagebuilder.test` / `password`

First-time setup (if DB empty):

```bash
cd apps/api
composer install
cp .env.example .env   # if needed
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link

cd ../admin && npm install
cd ../.. && npm install
```

## What’s included

- Drag-and-drop page builder (GrapesJS) with custom modern admin UI
- Custom HTML block + page-level head/body scripts
- AI panel (requires API key in **Settings → AI**; clear hint if missing)
- CRUD: Pages, Products, Menus, Users, Media
- Settings: AI key, storage (`local` default / S3-R2 fields), DB fields (saved for later; runtime stays SQLite)
- Seeded demo Home page + products + menus

## Docs

| Doc | Purpose |
|---|---|
| [docs/SETUP_AND_SERVE.md](./docs/SETUP_AND_SERVE.md) | **Full setup & serve manual** |
| [docs/PROGRESS.md](./docs/PROGRESS.md) | Progress vs plan |
| [CONTINUITY.md](./CONTINUITY.md) | Resume checklist for next session |
| [.cursor/plans/cms_pagebuilder_plan_72fd36a3.plan.md](./.cursor/plans/cms_pagebuilder_plan_72fd36a3.plan.md) | Full product plan |

## Architecture

```
apps/api     Laravel 13 — API (Sanctum) + public page render
apps/admin   React + Vite + GrapesJS
```

Defaults are local (SQLite + `storage/app/public`). Cloud options are configurable in Settings for later deploy.
