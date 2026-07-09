# PageBuilder V2 — Setup & Serve Manual

Complete guide to install, configure, and run the project locally for development or presentation.

**Repo path:** `/Users/binghaothai/Workspace/Twiport/pagebuilderv2`

---

## 1. What you get

| Piece | Tech | Port | Purpose |
|---|---|---|---|
| Admin studio | React + Vite + GrapesJS | `5173` | Login, page builder, modules, settings |
| API + public site | Laravel 13 + Sanctum | `8000` | REST API + published page rendering |
| Database (default) | MySQL | local | DB `pagebuilderv2` (see `.env`) |
| Media (default) | Local disk | — | `apps/api/storage/app/public` |

One command starts both admin and API:

```bash
npm run dev
```

---

## 2. Prerequisites

Install these on your machine:

| Tool | Suggested version | Check |
|---|---|---|
| PHP | 8.2+ (tested on 8.4) | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 20+ (tested on 26) | `node -v` |
| npm | 10+ | `npm -v` |

Optional later: MySQL/PostgreSQL, AWS/R2 credentials (only if you leave local defaults).

---

## 3. First-time setup (clean machine)

Run from the repo root:

```bash
cd /Users/binghaothai/Workspace/Twiport/pagebuilderv2
```

### 3.1 Root npm (for `npm run dev`)

```bash
npm install
```

### 3.2 Laravel API

```bash
cd apps/api
composer install

# Env
cp .env.example .env
php artisan key:generate

# Ensure these exist in .env (adjust if missing)
# APP_URL=http://localhost:8000
# FRONTEND_URL=http://localhost:5173
# SANCTUM_STATEFUL_DOMAINS=localhost:5173
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=pagebuilderv2
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Create MySQL database first, e.g.:
# mysql -uroot -p -e "CREATE DATABASE IF NOT EXISTS pagebuilderv2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Database + demo data
php artisan migrate --force
php artisan db:seed --force
php artisan storage:link

cd ../..
```

If `.env` already exists (this machine already ran setup), skip `cp` / `key:generate` and only migrate/seed if needed.

### 3.3 React admin

```bash
cd apps/admin
npm install
cd ../..
```

### 3.4 One-shot helper

After dependencies are installed once, you can also use:

```bash
npm run setup
```

That runs migrate, seed, storage link, and admin `npm install`.

---

## 4. Serve locally (daily use)

From repo root:

```bash
cd /Users/binghaothai/Workspace/Twiport/pagebuilderv2
npm run dev
```

This starts:

- API: `http://127.0.0.1:8000`
- Admin: `http://127.0.0.1:5173`

### Serve separately (optional)

```bash
# Terminal 1 — API
npm run dev:api

# Terminal 2 — Admin
npm run dev:admin
```

Stop with `Ctrl+C` in the terminal running `npm run dev`.

---

## 5. URLs & demo login

| What | URL |
|---|---|
| Admin login / studio | http://localhost:5173 |
| Public home (published pages) | http://localhost:8000 |
| Public page by slug | http://localhost:8000/p/{slug} |
| API health | http://localhost:8000/up |
| API base | http://localhost:8000/api |

**Demo accounts** (from seeder):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@pagebuilder.test` | `password` |
| Editor | `editor@pagebuilder.test` | `password` |

---

## 6. Presentation walkthrough

1. Run `npm run dev`.
2. Open http://localhost:5173 and log in as admin.
3. **Dashboard** — overview counts and pitch path.
4. **Pages → Edit Home** — GrapesJS builder:
   - Drag blocks (Hero, Text, Image, Columns, Custom HTML)
   - Use **AI** panel (without key → hint to Settings → AI)
   - **Code** tab for head/body scripts
   - **SEO** tab for meta
5. Click **Publish**, then open http://localhost:8000.
6. Show **Products**, **Menus**, **Media**, **Users**, **Settings**.

---

## 7. Settings (local defaults + future cloud)

Open **Settings** in the admin.

### AI

- Provider / model / API key
- If key is empty and user clicks Generate in the builder:
  - Message: *Please configure the AI API key in Settings → AI…*
  - Hint points to Settings

### Storage

- Default: `local`
- Optional: `s3` (S3 / Cloudflare R2 compatible fields: key, secret, bucket, region, endpoint)
- If S3 is selected but keys are missing, uploads fall back to local

### Database

- Fields for `sqlite` / `mysql` / `pgsql` are saved in Settings for later
- **Runtime today still uses SQLite** via `apps/api/.env`
- To really switch DB later: update `.env`, create DB, `php artisan migrate --force`

---

## 8. Useful artisan / npm commands

```bash
# API
cd apps/api
php artisan migrate --force
php artisan db:seed --force          # re-seed demo data (upsert-style)
php artisan storage:link
php artisan serve --host=127.0.0.1 --port=8000
php artisan route:list --path=api

# Admin
cd apps/admin
npm run dev
npm run build                        # production build → dist/

# Root
npm run dev                          # both
npm run build:admin
```

---

## 9. Project layout

```text
pagebuilderv2/
  apps/
    api/                 Laravel API + public Blade render
      app/Http/Controllers/Api/
      app/Services/      SettingsService, AiService
      database/migrations/
      database/seeders/
      resources/views/public/
      routes/api.php
      routes/web.php
    admin/               React + Vite + GrapesJS
      src/pages/         Dashboard, Editor, modules, Settings
      src/api/client.ts
  docs/
    SETUP_AND_SERVE.md   ← this file
    PROGRESS.md          Progress vs plan
  README.md
  CONTINUITY.md          Resume checklist for agents / next session
  package.json           npm run dev
```

---

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| `npm run dev` but admin blank / API 500 | Check both processes started; open API URL directly |
| Login fails | Re-seed: `cd apps/api && php artisan db:seed --force` |
| CORS / network errors from admin | Confirm `APP_URL=http://localhost:8000` and Vite proxy; admin calls `/api` which proxies to `:8000` |
| Uploaded images 404 | `php artisan storage:link` |
| Port in use | Kill old process or change ports in root `package.json` / `vite.config.ts` |
| AI always errors | Expected without key — set key in Settings → AI |
| Fresh clone, no `.env` | Follow section 3.2 |

---

## 11. Related docs

| File | Purpose |
|---|---|
| [README.md](../README.md) | Short overview |
| [CONTINUITY.md](../CONTINUITY.md) | What’s done / next / how to resume |
| [PROGRESS.md](./PROGRESS.md) | Progress vs original plan |
| [.cursor/plans/cms_pagebuilder_plan_72fd36a3.plan.md](../.cursor/plans/cms_pagebuilder_plan_72fd36a3.plan.md) | Full product plan |

---

## 12. Resume in a new chat

Paste:

> Continue PageBuilder V2 at `/Users/binghaothai/Workspace/Twiport/pagebuilderv2`. Read `docs/SETUP_AND_SERVE.md`, `docs/PROGRESS.md`, and `CONTINUITY.md`, then keep building from remaining items.
