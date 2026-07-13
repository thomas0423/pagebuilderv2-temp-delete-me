# PageBuilder V2 — Progress vs Plan

**Last updated:** 2026-07-09  
**Plan file:** [.cursor/plans/cms_pagebuilder_plan_72fd36a3.plan.md](../.cursor/plans/cms_pagebuilder_plan_72fd36a3.plan.md)  
**Repo:** project root (`pagebuilderv2`)

---

## Overall status

| Scope | Target | Status |
|---|---|---|
| **Scope A — Local presentation MVP** | Runnable tonight for demo | **~90% done / demoable** |
| **Scope B — Full CMS parity** | WordPress-class + production deploy | **Not started** (months) |

Verified locally:

- Admin http://localhost:5173 — OK  
- API/public http://localhost:8000 — OK  
- Login + pages API — OK  
- AI without key returns Settings hint — OK  

---

## Plan todos (updated)

| ID | Item | Status |
|---|---|---|
| `create-repo` | Create git repo at Twiport/pagebuilderv2 | **Done** |
| `clarify-stack` | React admin + Laravel API/public, single-site | **Done** (locked) |
| `clarify-ai-key` | No key yet; Settings + hint when using AI | **Done** |
| `local-presentation-mvp` | Auth, GrapesJS, AI, modules, settings | **Mostly done** (demoable) |
| `mvp-cms-core` | RBAC depth, revisions, SEO suite, deploy, multi-tenant | **Pending** (after presentation) |

---

## Scope A checklist

### Done

- [x] Repo + monorepo layout (`apps/api`, `apps/admin`)
- [x] One-command serve: `npm run dev`
- [x] Sanctum login / logout / me
- [x] Roles: admin / editor (basic)
- [x] GrapesJS editor with custom React admin chrome
- [x] Blocks: Hero, Text, Image, Columns, Custom HTML
- [x] Save draft + publish + public Blade render
- [x] Custom head / body scripts + basic SEO fields
- [x] AI panel + API; null key → Settings → AI message
- [x] CRUD: Pages, Products, Menus, Users, Media
- [x] Settings UI: AI, storage (local/s3 fields), DB fields
- [x] Local defaults: SQLite + public disk
- [x] Seeded Home page, products, menus, users
- [x] README + CONTINUITY + this progress/setup docs

### Partial / follow-up inside Scope A

- [x] Blocks panel + load existing page HTML for drag/drop editing (fixed empty canvas)
- [ ] Real provider HTTP calls after key is set (today: key required, then structured placeholder HTML/image URL)
- [ ] Apply Settings S3 credentials to runtime disk dynamically (fields saved; fallback to local works)
- [ ] Further hide/restyle stock GrapesJS chrome for “fancier” feel
- [ ] Media library picker modal inside editor
- [ ] Deploy workflow stubs in `.github/workflows`

### Explicitly deferred (Scope B)

- [ ] Revisions / compare / schedule publish
- [ ] Redirects, XML sitemap, schema SEO suite
- [ ] Hardened CSP for arbitrary custom JS
- [ ] Multi-tenant / multisite
- [ ] Production split deploy (Ubuntu API + Cloudflare/R2 admin assets)
- [ ] Live DB switch from Settings without editing `.env`

---

## Architecture (as built)

```text
Browser (Admin :5173)
    → Vite proxy /api → Laravel API (:8000) + Sanctum token
    → GrapesJS project_json + compiled_html/css stored in pages

Browser (Public :8000)
    → Laravel Blade renders published compiled_html + menus
```

---

## Suggested next builds (priority)

1. Wire real AI provider when key present (OpenAI first)
2. Polish GrapesJS UI (panels, blocks sidebar, devices)
3. Media picker inside editor
4. GitHub Actions stub for api/admin
5. Then Scope B items as needed for product

---

## How to report progress

> Scope A local presentation MVP is **demoable** (~90%). Core pagebuilder, modules, settings, and AI key gating work. Remaining polish: real AI HTTP, S3 runtime wiring, GrapesJS chrome. Full CMS parity (Scope B) remains a multi-month roadmap.
