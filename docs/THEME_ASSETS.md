# Affin demo theme assets in PageBuilder V2

Source: `themes.zip` → `themes/demo/public`  
Served from: `apps/api/public/themes/demo/{css,js}`

## What was wired

| Surface | CSS | JS |
|---|---|---|
| Public / preview pages (`page.blade.php`) | All demo theme CSS + Bootstrap 4 CDN | All demo theme JS (minus `widgets.js` / `widgets-bak.js`) + jQuery / Bootstrap CDN |
| GrapesJS studio canvas | Same theme CSS (via `/api/theme-assets`) + Bootstrap CDN | Not injected (avoids breaking the editor) |

## URLs

- CSS example: `http://localhost:8000/themes/demo/css/style.css`
- JS example: `http://localhost:8000/themes/demo/js/custom.js`
- Manifest: `GET /api/theme-assets`

Admin Vite proxies `/themes` → API so the canvas can load assets on `:5173`.

## Save / overwrite reminder

Each **Save** regenerates HTML/CSS from GrapesJS and **overwrites** `compiled_html` / `compiled_css`.  
**Publish** copies that draft into `published_html` / `published_css` (live site).

Theme asset files themselves are static — they are not overwritten by Save.

## Refresh assets from a new zip

```bash
# from extracted themes.zip
robocopy themes\demo\public\css apps\api\public\themes\demo\css *.css
robocopy themes\demo\public\js  apps\api\public\themes\demo\js  *.js
```
