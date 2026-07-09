import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import grapesjs, { type Editor } from 'grapesjs'
import 'grapesjs/dist/css/grapes.min.css'
import '../styles/grapes-theme.css'
import { api, type Page } from '../api/client'

type AiTab = 'content' | 'section' | 'page' | 'image'
type SideTab = 'styles' | 'layers' | 'ai' | 'code' | 'seo'

const BLOCKS: Array<{
  id: string
  label: string
  category: string
  content: string | Record<string, unknown>
}> = [
  {
    id: 'hero',
    label: 'Hero',
    category: 'Sections',
    content: `<section style="padding:80px 28px;background:linear-gradient(125deg,#0b1220,#243b63);color:#fff;text-align:center">
      <p style="letter-spacing:.16em;text-transform:uppercase;font-size:12px;opacity:.7">Eyebrow</p>
      <h1 style="font-family:Georgia,serif;font-size:3rem;margin:10px 0 14px">Your headline here</h1>
      <p style="max-width:540px;margin:0 auto 24px;opacity:.88;line-height:1.6">Double-click to edit. Drag blocks from the left.</p>
      <a href="#" style="display:inline-block;padding:12px 22px;background:#11a4ff;color:#fff;border-radius:999px;text-decoration:none;font-weight:700">Call to action</a>
    </section>`,
  },
  {
    id: 'features',
    label: 'Features',
    category: 'Sections',
    content: `<section style="padding:56px 24px;background:#fff;color:#0f172a">
      <h2 style="text-align:center;font-family:Georgia,serif;margin:0 0 28px">Feature grid</h2>
      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;max-width:960px;margin:0 auto">
        <div style="padding:20px;border:1px solid #e2e8f0;border-radius:16px"><h3>Fast</h3><p style="color:#64748b">Edit copy inline.</p></div>
        <div style="padding:20px;border:1px solid #e2e8f0;border-radius:16px"><h3>Flexible</h3><p style="color:#64748b">Style anything.</p></div>
        <div style="padding:20px;border:1px solid #e2e8f0;border-radius:16px"><h3>Freeform</h3><p style="color:#64748b">Drop custom HTML.</p></div>
      </div>
    </section>`,
  },
  {
    id: 'cta',
    label: 'CTA',
    category: 'Sections',
    content: `<section style="padding:48px 24px;background:#eef8ff;text-align:center;color:#0c4a6e">
      <h2 style="font-family:Georgia,serif;margin:0 0 10px">Ready to publish?</h2>
      <p style="margin:0 0 18px">Edit this band, then hit Publish.</p>
      <a href="#" style="display:inline-block;padding:11px 20px;background:#11a4ff;color:#fff;border-radius:999px;text-decoration:none;font-weight:600">Get started</a>
    </section>`,
  },
  {
    id: 'text',
    label: 'Text',
    category: 'Basic',
    content: `<div style="padding:24px"><p data-gjs-type="text" style="font-size:18px;line-height:1.6;margin:0">Click to edit this paragraph.</p></div>`,
  },
  {
    id: 'heading',
    label: 'Heading',
    category: 'Basic',
    content: `<h2 data-gjs-type="text" style="padding:16px 24px;font-family:Georgia,serif;font-size:2rem;margin:0">Editable heading</h2>`,
  },
  {
    id: 'image',
    label: 'Image',
    category: 'Basic',
    content: {
      type: 'image',
      src: 'https://picsum.photos/seed/pbv2-editor/1200/700',
      style: { width: '100%', height: 'auto', display: 'block' },
    },
  },
  {
    id: 'button',
    label: 'Button',
    category: 'Basic',
    content: `<div style="padding:20px;text-align:center">
      <a href="#" style="display:inline-block;padding:12px 22px;background:#11a4ff;color:#fff;border-radius:999px;text-decoration:none;font-weight:700">Button label</a>
    </div>`,
  },
  {
    id: 'cols2',
    label: '2 Cols',
    category: 'Layout',
    content: `<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:24px">
      <div style="min-height:120px;padding:16px;border:1px dashed #94a3b8;border-radius:12px"><p>Column 1</p></div>
      <div style="min-height:120px;padding:16px;border:1px dashed #94a3b8;border-radius:12px"><p>Column 2</p></div>
    </div>`,
  },
  {
    id: 'cols3',
    label: '3 Cols',
    category: 'Layout',
    content: `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;padding:24px">
      <div style="padding:16px;border:1px solid #e2e8f0;border-radius:16px"><h3>One</h3><p>Copy</p></div>
      <div style="padding:16px;border:1px solid #e2e8f0;border-radius:16px"><h3>Two</h3><p>Copy</p></div>
      <div style="padding:16px;border:1px solid #e2e8f0;border-radius:16px"><h3>Three</h3><p>Copy</p></div>
    </div>`,
  },
  {
    id: 'custom-html',
    label: 'HTML',
    category: 'Freedom',
    content: `<div style="padding:20px;border:2px dashed #11a4ff;border-radius:12px;background:#eef8ff;color:#0c4a6e">
      <p style="margin:0;font-weight:700">Custom HTML block — edit me</p>
    </div>`,
  },
  {
    id: 'spacer',
    label: 'Spacer',
    category: 'Layout',
    content: '<div style="height:48px"></div>',
  },
  {
    id: 'divider',
    label: 'Divider',
    category: 'Layout',
    content: '<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px" />',
  },
]

/**
 * Same base CSS as apps/api/resources/views/public/page.blade.php
 * so the builder iframe renders like the live site.
 */
const PUBLIC_CANVAS_CSS = `
  * { box-sizing: border-box; }
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100% !important;
    background: #fff !important;
    color: #0f172a !important;
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif !important;
  }
  img { max-width: 100%; height: auto; display: block; }
  a { color: inherit; text-decoration: none; }
  [data-gjs-type="wrapper"] {
    min-height: 100vh !important;
    width: 100% !important;
    max-width: none !important;
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  /* Keep CSS grids desktop-like inside the fixed Desktop frame */
  [style*="grid-template-columns"] { width: 100%; }
`

/** Studio-only chrome (matches public Blade header/footer). Not saved with the page. */
const SITE_HEADER_HTML = `
<header class="pb-site-header" data-pb-chrome="1" style="padding:16px 24px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0;background:#fff;color:#0f172a">
  <div style="font-weight:700;letter-spacing:-0.02em">PageBuilder V2</div>
  <nav style="display:flex;gap:14px;flex-wrap:wrap">
    <a href="/" style="color:#0f172a;font-weight:500;text-decoration:none">Home</a>
    <a href="#products" style="color:#0f172a;font-weight:500;text-decoration:none">Products</a>
    <a href="#contact" style="color:#0f172a;font-weight:500;text-decoration:none">Contact</a>
  </nav>
</header>
`

const SITE_FOOTER_HTML = `
<footer class="pb-site-footer" data-pb-chrome="1" style="padding:16px 24px;display:flex;gap:16px;flex-wrap:wrap;align-items:center;border-top:1px solid #e2e8f0;margin-top:48px;color:#64748b;font-size:14px;background:#fff">
  <nav style="display:flex;gap:14px;flex-wrap:wrap">
    <a href="#" style="color:#0f172a;font-weight:500;text-decoration:none">Privacy</a>
    <a href="#" style="color:#0f172a;font-weight:500;text-decoration:none">Terms</a>
  </nav>
</footer>
`

function stripSiteChrome(editor: Editor) {
  const wrapper = editor.getWrapper()
  if (!wrapper) return
  ;['.pb-site-header', '.pb-site-footer', '[data-pb-chrome="1"]'].forEach((sel) => {
    wrapper.find(sel)?.forEach((c) => c.remove())
  })
}

function lockChromeComponent(component: { set: (o: Record<string, unknown>) => void }) {
  component.set({
    selectable: false,
    hoverable: false,
    removable: false,
    draggable: false,
    copyable: false,
    editable: false,
    highlightable: false,
  })
}

/** Show both header+footer, or neither — never only one. */
function syncSiteChrome(editor: Editor, show: boolean) {
  stripSiteChrome(editor)
  if (!show) {
    editor.refresh()
    return
  }

  const wrapper = editor.getWrapper()
  if (!wrapper) return

  const header = wrapper.append(SITE_HEADER_HTML, { at: 0 })
  const footer = wrapper.append(SITE_FOOTER_HTML)
  ;[...(Array.isArray(header) ? header : [header]), ...(Array.isArray(footer) ? footer : [footer])].forEach((c) => {
    if (c) lockChromeComponent(c)
  })
  editor.refresh()
}

function stripSavedChrome(html: string): string {
  return html
    .replace(/<header[^>]*pb-site-header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[^>]*pb-site-footer[\s\S]*?<\/footer>/gi, '')
    .replace(/data-pb-chrome="1"/gi, '')
    .replace(/^[\s\S]*?<body[^>]*>/i, '')
    .replace(/<\/body>[\s\S]*$/i, '')
    .trim()
}

function pageBodyHtml(page: Page): string {
  const draft = stripSavedChrome(page.compiled_html || '')
  if (draft) return draft
  // Fall back to last published snapshot if draft was wiped
  const live = stripSavedChrome(page.published_html || '')
  if (live) return live
  return `<section style="padding:80px 24px;text-align:center;color:#334155;background:#fff">
        <h1 style="font-family:Georgia,serif;margin:0 0 12px">Empty canvas</h1>
        <p style="margin:0">Drag a block from the left to start.</p>
      </section>`
}

function loadContent(editor: Editor, page: Page, showChrome: boolean) {
  // Load page body only — chrome is applied via syncSiteChrome (both or none)
  // NEVER call setStyle() after setComponents — it wipes parsed inline CSS.
  editor.setComponents(pageBodyHtml(page))

  const extra = (page.compiled_css || page.published_css || '').trim()
  if (extra) editor.addStyle(extra)

  syncSiteChrome(editor, showChrome)
}

/** Prefer a real section/block — never the Body/wrapper root. */
function resolveReplaceTarget(editor: Editor, aiTab: AiTab) {
  const selected = editor.getSelected()
  if (!selected) return null

  const wrapper = editor.getWrapper()
  if (!wrapper) return null
  if (selected === wrapper || selected.is('wrapper')) return null

  // Skip locked site chrome
  if (
    selected.getAttributes()?.['data-pb-chrome'] === '1' ||
    selected.getClasses?.()?.includes?.('pb-site-header') ||
    selected.getClasses?.()?.includes?.('pb-site-footer')
  ) {
    return null
  }

  if (aiTab === 'content') return selected

  // Section mode: walk up to the nearest top-level block / <section>
  let current = selected
  while (current && current.parent() && current.parent() !== wrapper) {
    const tag = String(current.get('tagName') || '').toLowerCase()
    if (tag === 'section') return current
    current = current.parent()!
  }
  if (current && current.parent() === wrapper) return current
  return selected
}

function injectPublicCss(editor: Editor | null | undefined) {
  try {
    if (!editor?.Canvas) return false
    const doc = editor.Canvas.getDocument?.()
    if (!doc) return false

    let styleEl = doc.getElementById('pb-public-base') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = doc.createElement('style')
      styleEl.id = 'pb-public-base'
      doc.head.appendChild(styleEl)
    }
    styleEl.textContent = PUBLIC_CANVAS_CSS

    doc.documentElement.style.cssText = 'width:100%;height:100%;margin:0;padding:0;background:#fff;'
    doc.body.style.cssText =
      'width:100%;min-height:100%;margin:0;padding:0;background:#fff;color:#0f172a;font-family:"Segoe UI",system-ui,sans-serif;'

    // Force the iframe element to the active device width (GrapesJS sometimes leaves it at 100%)
    const frame = editor.Canvas.getFrameEl?.()
    const device = editor.getDevice()
    const width = device === 'Tablet' ? '768px' : device === 'Mobile' ? '390px' : '1280px'
    if (frame) {
      frame.style.width = width
      frame.style.maxWidth = 'none'
      frame.style.minHeight = '100%'
      frame.style.background = '#fff'
      frame.style.border = '0'
      frame.style.display = 'block'
    }
    const wrapper = frame?.parentElement as HTMLElement | null
    if (wrapper) {
      wrapper.style.width = width
      wrapper.style.maxWidth = 'none'
      wrapper.style.margin = '0 auto'
      wrapper.style.background = '#fff'
      wrapper.style.boxShadow = '0 12px 48px rgba(0,0,0,0.28)'
    }

    editor.refresh?.()
    return true
  } catch {
    return false
  }
}

function mergeScriptBlock(existing: string, incoming: string, marker: string): string {
  const next = incoming.trim()
  if (!next) return existing
  if (existing.includes(next)) return existing
  const wrapped = next.includes('<script')
    ? next
    : `<script>\n// ${marker}\n${next}\n</script>`
  return existing.trim() ? `${existing.trim()}\n\n${wrapped}` : wrapped
}

function extractStyleCssFromHead(headHtml: string): string {
  const parts: string[] = []
  const re = /<style\b[^>]*>([\s\S]*?)<\/style>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(headHtml))) {
    const css = m[1]?.trim()
    if (css) parts.push(css)
  }
  return parts.join('\n\n')
}

function extractInlineScripts(bodyHtml: string): string[] {
  const parts: string[] = []
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(bodyHtml))) {
    const js = m[1]?.trim()
    if (js) parts.push(js)
  }
  return parts
}

const FALLBACK_MOUSE_JS = `(function () {
  var cards = document.querySelectorAll('.pb-ai-card, article, [class*="card"]');
  if (!cards.length) return;
  cards.forEach(function (card) {
    if (card.getAttribute('data-pb-mouse') === '1') return;
    card.setAttribute('data-pb-mouse', '1');
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / Math.max(r.width, 1) - 0.5;
      var y = (e.clientY - r.top) / Math.max(r.height, 1) - 0.5;
      card.style.transform = 'perspective(700px) rotateX(' + (-y * 8) + 'deg) rotateY(' + (x * 10) + 'deg) translateY(-4px)';
      card.classList.add('is-hot');
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
      card.classList.remove('is-hot');
    });
  });
})();`

/** Reject scripts that wipe the canvas / page when previewed. */
function sanitizePreviewJs(js: string): string {
  const dangerous =
    /\bdocument\.write(?:ln)?\s*\(|\b(?:document\.)?(?:body|documentElement)\.(?:inner|outer)HTML\s*=|\bquerySelector\s*\(\s*['"](?:body|html|main)\s*['"]\s*\)\s*\.innerHTML\s*=|\b(?:window\.)?location\s*=/i
  if (dangerous.test(js)) return FALLBACK_MOUSE_JS
  return js
}

function htmlLooksWeak(html: string, selectedHtml: string): boolean {
  const ai = (html || '').trim()
  const sel = (selectedHtml || '').trim()
  if (!sel) return false
  if (!ai) return true
  if (/<section\b/i.test(ai) && !/<\/section>/i.test(ai)) return true
  const count = (h: string) => {
    const article = (h.match(/<article\b/gi) || []).length
    const cards = (h.match(/class=["'][^"']*\b(?:pb-ai-)?(?:card|feature|pros?|benefit|item)\b/gi) || []).length
    const h3 = (h.match(/<h3\b/gi) || []).length
    return Math.max(article, cards, h3 >= 3 ? h3 : 0)
  }
  const aiN = count(ai)
  const selN = count(sel)
  if (selN >= 3 && aiN < selN) return true
  const aiText = ai.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const selText = sel.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (selText.length > 120 && aiText.length < selText.length * 0.35) return true
  if (/\bpb-ai-hero\b/i.test(ai) && !/\bpb-ai-card\b/i.test(ai) && selN >= 2) return true
  return false
}

/** Preview custom head CSS + body scripts inside the GrapesJS iframe. */
function injectCustomCodePreview(
  editor: Editor | null | undefined,
  headHtml: string,
  bodyHtml: string,
  extraCss = '',
  extraJs = '',
) {
  try {
    if (!editor?.Canvas) return
    const doc = editor.Canvas.getDocument?.()
    if (!doc) return

    const css = [extractStyleCssFromHead(headHtml), extraCss.trim()].filter(Boolean).join('\n\n')
    let styleEl = doc.getElementById('pb-custom-head-css') as HTMLStyleElement | null
    if (!styleEl) {
      styleEl = doc.createElement('style')
      styleEl.id = 'pb-custom-head-css'
      doc.head.appendChild(styleEl)
    }
    styleEl.textContent = css

    // Remove previous AI/custom preview scripts, then re-run
    doc.querySelectorAll('script[data-pb-preview="1"]').forEach((n) => n.remove())
    const scripts = [...extractInlineScripts(bodyHtml), ...(extraJs.trim() ? [extraJs.trim()] : [])]
      .map(sanitizePreviewJs)
      .filter(Boolean)
    for (const js of scripts) {
      const script = doc.createElement('script')
      script.setAttribute('data-pb-preview', '1')
      // Concatenate (do not interpolate AI JS into a template literal — backticks/${ break it).
      script.textContent = [
        '(function(doc){',
        "  var ready = doc.readyState !== 'loading';",
        '  var orig = doc.addEventListener.bind(doc);',
        "  var blockedWrite = function(){ console.warn('AI preview blocked document.write'); };",
        '  try { doc.write = blockedWrite; doc.writeln = blockedWrite; } catch (e) {}',
        '  doc.addEventListener = function(type, fn, opts) {',
        "    if (String(type) === 'DOMContentLoaded' && ready) {",
        "      try { fn.call(doc); } catch (e) { console.warn('AI preview script error', e); }",
        '      return;',
        '    }',
        '    return orig(type, fn, opts);',
        '  };',
        '  try {',
        js,
        '  } catch (e) {',
        "    console.warn('AI preview script error', e);",
        '  }',
        '  doc.addEventListener = orig;',
        '})(document);',
      ].join('\n')
      doc.body.appendChild(script)
    }
  } catch {
    // ignore
  }
}

/** Apply AI CSS into GrapesJS + Code→Head, and AI JS into Code→Body. Preview after HTML is on canvas. */
function applyAiAssets(
  editor: Editor,
  data: { css?: string | null; js?: string | null },
  setCustomHead: (value: string | ((prev: string) => string)) => void,
  setCustomBody: (value: string | ((prev: string) => string)) => void,
  currentHead = '',
  currentBody = '',
) {
  const css = (data.css || '').trim()
  const js = (data.js || '').trim()
  const stamp = `AI ${new Date().toLocaleTimeString()}`

  let nextHead = currentHead
  if (css) {
    editor.addStyle(css)
    if (!currentHead.includes(css)) {
      const block = `<!-- ${stamp} -->\n<style>\n${css}\n</style>`
      nextHead = currentHead.trim() ? `${currentHead.trim()}\n\n${block}` : block
      setCustomHead(nextHead)
    }
  }

  let nextBody = currentBody
  if (js) {
    nextBody = mergeScriptBlock(currentBody, sanitizePreviewJs(js), stamp)
    if (nextBody !== currentBody) setCustomBody(nextBody)
  }

  const preview = () => injectCustomCodePreview(editor, nextHead, nextBody, css, js)

  return {
    cssApplied: Boolean(css),
    jsApplied: Boolean(js),
    preview,
  }
}

function countCardsInHtml(html: string): number {
  if (!html) return 0
  const article = (html.match(/<article\b/gi) || []).length
  const cards = (html.match(/class=["'][^"']*\b(?:pb-ai-)?(?:card|feature|pros?|benefit|item)\b/gi) || []).length
  // Grid children often look like <div class="..."> with an h3 inside a features grid
  const h3InSection = (html.match(/<h3\b/gi) || []).length
  return Math.max(article, cards, h3InSection >= 3 ? h3InSection : 0)
}

function scheduleAiPreview(preview: () => void) {
  // Run after GrapesJS finishes inserting components into the iframe.
  ;[80, 250, 700, 1400].forEach((ms) => window.setTimeout(preview, ms))
}

export default function EditorPage() {
  const { id } = useParams()
  const canvasRef = useRef<HTMLDivElement>(null)
  const blocksRef = useRef<HTMLDivElement>(null)
  const stylesRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<HTMLDivElement>(null)
  const traitsRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<Editor | null>(null)

  const [page, setPage] = useState<Page | null>(null)
  const [ready, setReady] = useState(false)
  const [initError, setInitError] = useState('')
  const [bootKey, setBootKey] = useState(0)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [aiTab, setAiTab] = useState<AiTab>('section')
  const [prompt, setPrompt] = useState('A bold hero for a modern product launch')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState('')
  const [sideTab, setSideTab] = useState<SideTab>('styles')
  const [customHead, setCustomHead] = useState('')
  const [customBody, setCustomBody] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [device, setDevice] = useState<'Desktop' | 'Tablet' | 'Mobile'>('Desktop')
  const [showBlocks, setShowBlocks] = useState(true)
  // Start with inspector closed so Desktop frame has room; open when editing styles
  const [showInspector, setShowInspector] = useState(false)
  /** Preview site header+footer together (matches live Blade). Off = page body only. */
  const [showChrome, setShowChrome] = useState(true)
  const showChromeRef = useRef(true)
  showChromeRef.current = showChrome
  const pageRef = useRef<Page | null>(null)
  pageRef.current = page

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get<Page>(`/pages/${id}`)
        if (cancelled) return
        setPage(data)
        setCustomHead(data.custom_head || '')
        setCustomBody(data.custom_body_scripts || '')
        setMetaTitle(data.meta_title || '')
        setMetaDescription(data.meta_description || '')
      } catch {
        if (!cancelled) setInitError('Failed to load page from API.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  // Init GrapesJS once per page id / manual reboot.
  // Do NOT depend on the whole `page` object — Save draft must not remount the canvas.
  useEffect(() => {
    if (!page?.id) return

    let editor: Editor | null = null
    let cancelled = false
    const pageSnapshot = page
    const polishTimers: number[] = []

    const start = () => {
      if (cancelled) return
      if (!canvasRef.current || !blocksRef.current || !stylesRef.current || !layersRef.current || !traitsRef.current) {
        // DOM hosts not painted yet (common after HMR) — retry shortly
        polishTimers.push(window.setTimeout(start, 50))
        return
      }

      try {
        // Clear any leftover GrapesJS markup from a previous destroyed instance
        canvasRef.current.innerHTML = ''
        blocksRef.current.innerHTML = ''
        stylesRef.current.innerHTML = ''
        layersRef.current.innerHTML = ''
        traitsRef.current.innerHTML = ''

        editor = grapesjs.init({
          container: canvasRef.current,
          height: '100%',
          width: 'auto',
          fromElement: false,
          storageManager: false,
          noticeOnUnload: false,
          // Keep styles as inline style="" (same as seeded/live HTML) instead of stripping to classes
          forceClass: false,
          avoidInlineStyle: false,
          panels: { defaults: [] },
          blockManager: { appendTo: blocksRef.current },
          layerManager: { appendTo: layersRef.current },
          styleManager: {
            appendTo: stylesRef.current,
            sectors: [
              {
                name: 'Dimension',
                open: true,
                properties: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
              },
              {
                name: 'Typography',
                open: true,
                properties: ['font-family', 'font-size', 'font-weight', 'color', 'line-height', 'text-align'],
              },
              {
                name: 'Decorations',
                open: true,
                properties: ['background-color', 'background', 'border-radius', 'border', 'box-shadow', 'opacity'],
              },
            ],
          },
          traitManager: { appendTo: traitsRef.current },
          deviceManager: {
            devices: [
              { id: 'desktop', name: 'Desktop', width: '1280px' },
              { id: 'tablet', name: 'Tablet', width: '768px', widthMedia: '992px' },
              { id: 'mobile', name: 'Mobile', width: '390px', widthMedia: '480px' },
            ],
          },
          canvas: {
            styles: [
              'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Sora:wght@400;600&display=swap',
            ],
          },
        })

        if (cancelled) {
          try {
            editor.destroy()
          } catch {
            // ignore
          }
          return
        }

        for (const block of BLOCKS) {
          editor.BlockManager.add(block.id, {
            label: block.label,
            category: block.category,
            content: block.content,
          })
        }

        loadContent(editor, pageSnapshot, showChromeRef.current)
        editor.setDevice('Desktop')

        const polishCanvas = () => {
          if (cancelled || !editor || editor !== editorRef.current) return
          injectPublicCss(editor)
        }

        editor.on('canvas:frame:load', polishCanvas)
        editor.on('change:device', polishCanvas)
        polishTimers.push(window.setTimeout(polishCanvas, 0))
        polishTimers.push(window.setTimeout(polishCanvas, 120))
        polishTimers.push(window.setTimeout(polishCanvas, 400))
        polishTimers.push(window.setTimeout(polishCanvas, 1000))

        editorRef.current = editor
        setReady(true)
        setInitError('')
      } catch (err) {
        console.error('GrapesJS init failed', err)
        editorRef.current = null
        setReady(false)
        setInitError(err instanceof Error ? err.message : 'GrapesJS failed to start')
      }
    }

    // Two frames: wait for editor layout (blocks/side hosts) to mount
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(start)
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      for (const t of polishTimers) window.clearTimeout(t)
      const current = editor
      editorRef.current = null
      setReady(false)
      try {
        current?.destroy()
      } catch {
        // ignore
      }
      if (canvasRef.current) canvasRef.current.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remount only when navigating / manual reboot
  }, [page?.id, bootKey])

  const setEditorDevice = (name: 'Desktop' | 'Tablet' | 'Mobile') => {
    setDevice(name)
    const ed = editorRef.current
    if (!ed) return
    ed.setDevice(name)
    requestAnimationFrame(() => injectPublicCss(ed))
    window.setTimeout(() => injectPublicCss(ed), 120)
  }

  // When panels toggle, re-apply frame width
  useEffect(() => {
    if (!ready || !editorRef.current) return
    const ed = editorRef.current
    const t = window.setTimeout(() => {
      injectPublicCss(ed)
      injectCustomCodePreview(ed, customHead, customBody)
    }, 80)
    return () => window.clearTimeout(t)
  }, [ready, showBlocks, showInspector, customHead, customBody])

  // Toggle site chrome: always both header+footer, or neither
  useEffect(() => {
    if (!ready || !editorRef.current) return
    syncSiteChrome(editorRef.current, showChrome)
    injectPublicCss(editorRef.current)
    injectCustomCodePreview(editorRef.current, customHead, customBody)
  }, [ready, showChrome, customHead, customBody])

  const persist = useCallback(
    async (publish = false) => {
      const editor = editorRef.current
      if (!page) {
        setMessage('Page not loaded.')
        return
      }
      if (!editor) {
        setMessage('Builder not ready yet — wait a second or refresh.')
        return
      }

      setSaving(true)
      setMessage(publish ? 'Publishing…' : 'Saving…')
      try {
        // Strip studio-only chrome before saving (public Blade adds its own header/footer)
        stripSiteChrome(editor)

        let html = editor.getHtml()
        html = html
          .replace(/<header[^>]*pb-site-header[\s\S]*?<\/header>/gi, '')
          .replace(/<footer[^>]*pb-site-footer[\s\S]*?<\/footer>/gi, '')
          .replace(/data-pb-chrome="1"/gi, '')
          // GrapesJS sometimes wraps output in <body>…</body>
          .replace(/^[\s\S]*?<body[^>]*>/i, '')
          .replace(/<\/body>[\s\S]*$/i, '')
          .replace(/<\/?html[^>]*>/gi, '')
          .trim()

        const payload = {
          project_json: editor.getProjectData(),
          compiled_html: html,
          compiled_css: editor.getCss() || '',
          custom_head: customHead,
          custom_body_scripts: customBody,
          meta_title: metaTitle,
          meta_description: metaDescription,
        }

        // Restore chrome preview state after save
        syncSiteChrome(editor, showChromeRef.current)

        const { data } = publish
          ? await api.post<Page>(`/pages/${page.id}/publish`, payload)
          : await api.put<Page>(`/pages/${page.id}`, { ...payload, status: 'draft' })
        setPage(data)
        setMessage(
          publish
            ? 'Published — Live site updated to this version.'
            : page?.published_html || page?.status === 'published'
              ? 'Draft saved — Live site still shows the last published version. Use Preview for this draft.'
              : 'Draft saved — use Preview. Publish when ready for Live site.',
        )
      } catch (err: unknown) {
        const axiosErr = err as { response?: { data?: { message?: string } }; message?: string }
        setMessage(axiosErr.response?.data?.message || axiosErr.message || 'Save failed.')
      } finally {
        setSaving(false)
      }
    },
    [page, customHead, customBody, metaTitle, metaDescription],
  )

  const rebootBuilder = () => {
    setInitError('')
    setAiError('')
    setReady(false)
    setBootKey((k) => k + 1)
    setMessage('Rebooting builder…')
  }

  const reloadFromServer = async () => {
    if (!id) return
    setMessage('Reloading page content…')
    try {
      const { data } = await api.get<Page>(`/pages/${id}`)
      setPage(data)
      pageRef.current = data
      const editor = editorRef.current
      if (editor?.Canvas) {
        loadContent(editor, data, showChromeRef.current)
        injectPublicCss(editor)
        setMessage('Canvas restored from saved page content.')
      } else {
        // Builder dead — reboot GrapesJS with the fresh page snapshot
        setBootKey((k) => k + 1)
        setMessage('Builder restarted with saved page content.')
      }
    } catch {
      setMessage('Failed to reload page content.')
    }
  }

  const runAi = async () => {
    setAiBusy(true)
    setAiError('')
    setMessage('Generating with AI…')
    try {
      const editor = editorRef.current
      if (!editor?.Canvas) {
        setAiError('Builder not ready — click “Reboot builder” or refresh the page.')
        setMessage('')
        return
      }

      // Selecting alone does nothing — only this button updates the canvas.
      // For page mode, send the whole body HTML (without site chrome) as context.
      let target = aiTab === 'page' ? null : resolveReplaceTarget(editor, aiTab)
      let selectedHtml = ''
      let selectedText = ''

      if (aiTab === 'page') {
        stripSiteChrome(editor)
        selectedHtml = (editor.getHtml() || '').slice(0, 40000)
        selectedText = editor.getWrapper()?.getEl()?.textContent?.trim()?.slice(0, 4000) || ''
        syncSiteChrome(editor, showChromeRef.current)
      } else if (target) {
        selectedHtml = (target.toHTML() || '').slice(0, 40000)
        selectedText =
          ((target.get('content') as string) || target.getEl()?.textContent || '').trim().slice(0, 4000)
      }

      if (aiTab === 'content' && !selectedHtml) {
        setAiError('Select a text block on the canvas first, then generate.')
        setMessage('')
        return
      }

      const contextParts = [
        aiTab === 'content' && selectedHtml
          ? 'Update the selected content only. Keep a similar HTML tag/structure.'
          : '',
        aiTab === 'section' && selectedHtml
          ? 'Update the selected section only. Return one <section>…</section>.'
          : '',
        aiTab === 'section' && !selectedHtml
          ? 'No section selected — create a new <section> to insert.'
          : '',
        aiTab === 'page' && selectedHtml
          ? 'CURRENT page HTML is included — revise it according to the request.'
          : '',
        'Always return HTML markup only. Do not return plain text without tags.',
      ].filter(Boolean)

      const { data } = await api.post(
        '/ai/generate',
        {
          type: aiTab,
          prompt: prompt.trim(),
          selected_html: selectedHtml || undefined,
          selected_text: selectedText || undefined,
          context: contextParts.join('\n') || undefined,
        },
        { timeout: 160_000 },
      )

      if (aiTab === 'image' && data.url) {
        const imageTarget = editor.getSelected()
        if (imageTarget && imageTarget.is('image')) {
          imageTarget.set('src', data.url)
          setMessage('Selected image updated.')
        } else {
          editor.addComponents({
            type: 'image',
            src: data.url,
            style: { width: '100%', height: 'auto' },
          })
          setMessage('AI image inserted.')
        }
        return
      }

      const keepExisting =
        Boolean(data.kept_existing) ||
        Boolean(data.effect_only && selectedHtml) ||
        (Boolean(selectedHtml) && htmlLooksWeak(String(data.html || ''), selectedHtml))

      // Effect-only / weak HTML: keep canvas markup, only attach CSS/JS.
      const htmlToApply = keepExisting && selectedHtml ? selectedHtml : String(data.html || '')

      if (!htmlToApply.trim() && !data.css && !data.js) {
        setAiError('AI returned no HTML/CSS/JS to apply.')
        setMessage('')
        return
      }

      const assets = applyAiAssets(editor, data, setCustomHead, setCustomBody, customHead, customBody)
      const assetNote = [
        assets.cssApplied ? 'CSS' : null,
        assets.jsApplied ? 'JS' : null,
      ]
        .filter(Boolean)
        .join(' + ')

      const requestedMatch =
        prompt.match(/\b(\d+)\b.*\b(card|cards|point|points|feature|features|pros?|benefit|benefits|item|items)\b/i) ||
        prompt.match(/\b(card|cards|point|points|feature|features|pros?|benefit|benefits|item|items)\b.*\b(\d+)\b/i)
      const requestedCount = requestedMatch
        ? Number(requestedMatch[1] && /^\d+$/.test(requestedMatch[1]) ? requestedMatch[1] : requestedMatch[2])
        : 0
      const gotCount = countCardsInHtml(htmlToApply)
      const truncated = Boolean(data.truncated) && !keepExisting
      const incompleteNote = keepExisting
        ? assetNote
          ? ' Kept your existing cards; applied effect CSS/JS under Code.'
          : ' Kept your existing cards (AI HTML looked empty/incomplete).'
        : truncated
          ? ' Warning: AI output was cut off (token limit). Generate again — ask for shorter card copy if needed.'
          : requestedCount > 0 && gotCount > 0 && gotCount < requestedCount
            ? ` Warning: asked for ${requestedCount} items but only ${gotCount} were returned — generate again or ask “include all ${requestedCount} cards with short copy”.`
            : requestedCount > 0 && gotCount === 0
              ? ' Tip: if cards look missing, generate again (response may have been cut off).'
              : !assets.jsApplied &&
                  /\b(animat|motion|effect|js|javascript|function|fade|slide|mouse)\b/i.test(prompt)
                ? ' Note: no JS was returned — CSS motion may still apply; check Code → Body scripts.'
                : ''

      if (aiTab === 'page') {
        if (keepExisting) {
          scheduleAiPreview(assets.preview)
          setMessage((assetNote ? `Page HTML kept. ${assetNote} saved under Code.` : 'Page HTML kept.') + incompleteNote)
          if (assets.cssApplied || assets.jsApplied) setSideTab('code')
          return
        }
        const ok = window.confirm('Replace the ENTIRE page content with AI output? This cannot be undone except via Undo.')
        if (!ok) {
          setMessage('Whole-page AI cancelled.')
          return
        }
        editor.setComponents(htmlToApply)
        syncSiteChrome(editor, showChromeRef.current)
        scheduleAiPreview(assets.preview)
        setMessage(
          (assetNote
            ? `Whole page replaced. ${assetNote} saved under Code (and previewed on canvas).`
            : 'Whole page replaced with AI content.') + incompleteNote,
        )
        if (assets.cssApplied || assets.jsApplied) setSideTab('code')
        return
      }

      // Content / Section: replace a real selected block (never Body/wrapper).
      if (target && (aiTab === 'content' || aiTab === 'section')) {
        if (keepExisting) {
          // Do not remove/replace — only preview CSS/JS on the current selection.
          scheduleAiPreview(assets.preview)
          setMessage(
            (assetNote
              ? `${aiTab === 'content' ? 'Selected text' : 'Selected section'} kept. ${assetNote} auto-saved under Code.`
              : 'Selection kept; AI returned incomplete HTML.') + incompleteNote,
          )
          if (assets.cssApplied || assets.jsApplied) setSideTab('code')
          return
        }
        const parent = target.parent()
        if (parent) {
          const index = target.index()
          target.remove()
          const added = parent.append(htmlToApply, { at: index })
          const first = Array.isArray(added) ? added[0] : added
          if (first) editor.select(first)
          scheduleAiPreview(assets.preview)
          setMessage(
            (assetNote
              ? `${aiTab === 'content' ? 'Selected text' : 'Selected section'} updated. ${assetNote} auto-saved under Code.`
              : aiTab === 'content'
                ? 'Selected text updated with AI.'
                : 'Selected section updated with AI.') + incompleteNote,
          )
          if (assets.cssApplied || assets.jsApplied) setSideTab('code')
          return
        }
      }

      if (keepExisting) {
        scheduleAiPreview(assets.preview)
        setMessage((assetNote ? `${assetNote} applied under Code.` : 'Nothing to insert.') + incompleteNote)
        if (assets.cssApplied || assets.jsApplied) setSideTab('code')
        return
      }

      editor.addComponents(htmlToApply)
      scheduleAiPreview(assets.preview)
      setMessage(
        (assetNote
          ? `AI content inserted. ${assetNote} auto-saved under Code.`
          : aiTab === 'content'
            ? 'AI content inserted (select a text block first to replace it).'
            : 'AI section inserted at the end. Select a section first to replace that section.') + incompleteNote,
      )
      if (assets.cssApplied || assets.jsApplied) setSideTab('code')
    } catch (err: unknown) {
      const axiosErr = err as {
        code?: string
        message?: string
        response?: { status?: number; data?: { message?: string; hint?: string } }
      }
      const status = axiosErr.response?.status
      const apiMessage = axiosErr.response?.data?.message
      const apiHint = axiosErr.response?.data?.hint
      let msg = apiMessage || 'AI request failed'
      let hint = apiHint

      // Only treat true transport failures as "API unreachable".
      // Keep provider 4xx messages (wrong key/model) visible as-is.
      const transportFail =
        !axiosErr.response ||
        status === 502 ||
        status === 503 ||
        status === 504 ||
        axiosErr.code === 'ECONNABORTED' ||
        axiosErr.code === 'ERR_NETWORK'

      if (transportFail && !apiMessage) {
        msg = 'Cannot reach the API right now.'
        hint = 'Wait 2 seconds and try again — the API auto-restarts if it crashed. If it keeps failing, run `npm run dev` from the project root.'
      }

      setAiError(hint ? `${msg} ${hint}` : msg)
      setMessage('')
    } finally {
      setAiBusy(false)
    }
  }

  if (!page && !initError) {
    return <div className="muted">Loading editor…</div>
  }

  const bodyClass = [
    'editor-body',
    'editor-body--builder',
    showBlocks ? '' : 'blocks-collapsed',
    showInspector ? '' : 'inspector-collapsed',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="editor-layout">
      <div className="editor-toolbar">
        <div className="editor-toolbar-row">
          <div className="row">
            <Link className="btn secondary" to="/pages">
              ← Exit
            </Link>
            <strong style={{ fontFamily: 'var(--display)' }}>{page?.title || 'Page'}</strong>
            <button type="button" className="btn ghost" onClick={() => void reloadFromServer()} title="Reload saved page HTML into the canvas">
              Restore content
            </button>
            <button type="button" className="btn ghost" onClick={rebootBuilder} title="Restart GrapesJS if the canvas is grey / stuck">
              Reboot builder
            </button>
            {page && (
              <span className={`badge ${page.published_html || page.status === 'published' ? 'published' : 'draft'}`}>
                {page.published_html || page.status === 'published' ? 'live' : 'draft'}
              </span>
            )}
            {page?.has_unpublished_changes && <span className="badge draft">unpublished changes</span>}
            <button className="btn ghost" type="button" onClick={() => setShowBlocks((v) => !v)} title="Toggle blocks">
              {showBlocks ? 'Hide blocks' : 'Blocks'}
            </button>
            <button className="btn ghost" type="button" onClick={() => setShowInspector((v) => !v)} title="Toggle inspector">
              {showInspector ? 'Hide panel' : 'Panel'}
            </button>
            <button
              className={`btn ghost${showChrome ? ' active-toggle' : ''}`}
              type="button"
              onClick={() => setShowChrome((v) => !v)}
              title="Show or hide site header and footer together"
            >
              {showChrome ? 'Hide header/footer' : 'Show header/footer'}
            </button>
          </div>

          <div className="row">
            <button className="btn ghost" type="button" disabled={saving} onClick={() => void persist(false)}>
              {saving ? 'Working…' : 'Save draft'}
            </button>
            <button className="btn" type="button" disabled={saving} onClick={() => void persist(true)}>
              Publish
            </button>
            {page && (
              <>
                <a
                  className="btn secondary"
                  href={`http://localhost:8000/preview/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Works for drafts and published pages"
                >
                  Preview
                </a>
                <a
                  className="btn secondary"
                  href={`http://localhost:8000/p/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  title="Public URL — published pages only"
                >
                  Live site
                </a>
              </>
            )}
          </div>
        </div>

        <div className="editor-toolbar-row">
          <div className="pb-device-bar">
            {(['Desktop', 'Tablet', 'Mobile'] as const).map((name) => (
              <button key={name} type="button" className={device === name ? 'active' : ''} onClick={() => setEditorDevice(name)}>
                {name}
              </button>
            ))}
            <button type="button" onClick={() => editorRef.current?.runCommand('core:undo')}>
              Undo
            </button>
            <button type="button" onClick={() => editorRef.current?.runCommand('core:redo')}>
              Redo
            </button>
          </div>
          {message && <span className="toolbar-msg">{message}</span>}
        </div>
      </div>

      {initError && (
        <div className="alert" style={{ margin: 0, borderRadius: 0 }}>
          {initError}{' '}
          <button type="button" className="btn secondary" onClick={rebootBuilder}>
            Reboot builder
          </button>
        </div>
      )}

      {!ready && !initError && page && (
        <div className="alert processing" style={{ margin: 0, borderRadius: 0 }}>
          <span className="spinner" aria-hidden />
          Starting builder…
        </div>
      )}

      <div className={bodyClass}>
        <aside className={`editor-blocks-col${showBlocks ? '' : ' collapsed'}`}>
          <div className="editor-col-title">Blocks</div>
          <p className="muted" style={{ fontSize: 11, margin: '0 0 8px' }}>
            Drag onto the canvas
          </p>
          <div className="pb-blocks-host" ref={blocksRef} />
        </aside>

        <div className="editor-canvas-col">
          <div className="editor-canvas" ref={canvasRef} />
        </div>

        <aside className={`editor-side${showInspector ? '' : ' collapsed'}`}>
          <div className="tabs tabs-rows">
            <div className="tabs-row">
              {(
                [
                  ['layers', 'Layers'],
                  ['seo', 'SEO'],
                  ['code', 'Code'],
                ] as const
              ).map(([key, label]) => (
                <button key={key} type="button" className={sideTab === key ? 'active' : ''} onClick={() => setSideTab(key)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="tabs-row">
              {(
                [
                  ['styles', 'Styles'],
                  ['ai', 'AI'],
                ] as const
              ).map(([key, label]) => (
                <button key={key} type="button" className={sideTab === key ? 'active' : ''} onClick={() => setSideTab(key)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Keep manager hosts mounted so GrapesJS can attach */}
          <div style={{ display: sideTab === 'styles' ? 'block' : 'none' }}>
            <h3>Styles</h3>
            <p className="muted" style={{ fontSize: 12 }}>Select an element on the canvas first.</p>
            <div ref={stylesRef} className="gjs-sm-host" />
            <h3 style={{ marginTop: 16 }}>Component</h3>
            <div ref={traitsRef} className="gjs-traits-host" />
          </div>

          <div style={{ display: sideTab === 'layers' ? 'block' : 'none' }}>
            <h3>Layers</h3>
            <div ref={layersRef} className="gjs-layers-host" />
          </div>

          {sideTab === 'ai' && (
            <>
              <h3>Generate with AI</h3>
              <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
                Just describe the change in plain language. We automatically send the selected HTML and ask the AI to return HTML.
              </p>
              <div className="field">
                <label>Type</label>
                <select value={aiTab} onChange={(e) => setAiTab(e.target.value as AiTab)}>
                  <option value="content">Content (rewrite selection)</option>
                  <option value="section">Section (new / replace selection)</option>
                  <option value="page">Whole page (replace all)</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div className="field">
                <label>Prompt</label>
                <textarea
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={
                    aiTab === 'content'
                      ? 'Make this more persuasive and product-focused.'
                      : aiTab === 'section'
                        ? 'Make this hero bolder with a clearer CTA.'
                        : aiTab === 'page'
                          ? 'Refresh the whole page for a modern SaaS launch.'
                          : 'Modern desk lamp on a clean desk'
                  }
                />
              </div>
              <p className="muted" style={{ fontSize: 12, marginTop: 0, lineHeight: 1.5 }}>
                {aiTab === 'content' && (
                  <>
                    1) Click a paragraph/heading on the canvas
                    <br />
                    2) Write what to change
                    <br />
                    3) Generate — selected HTML is included automatically
                  </>
                )}
                {aiTab === 'section' && (
                  <>
                    1) Click a section (not Body)
                    <br />
                    2) For effects only: “Add mouse tilt effect to these 6 cards” (keeps your HTML)
                    <br />
                    3) Generate — CSS/JS go to Code; canvas content is not wiped for effect-only prompts
                  </>
                )}
                {aiTab === 'page' && (
                  <>
                    Sends the current page HTML with your request.
                    <br />
                    Replaces the whole canvas after confirmation.
                  </>
                )}
                {aiTab === 'image' && 'Inserts an image, or updates the selected image.'}
              </p>
              {aiBusy && (
                <div className="alert processing" style={{ marginBottom: 12 }}>
                  <span className="spinner" aria-hidden />
                  Generating HTML with AI…
                </div>
              )}
              {aiError && <div className="alert">{aiError}</div>}
              <button className="btn" type="button" disabled={aiBusy || !prompt.trim()} onClick={() => void runAi()} style={{ width: '100%' }}>
                {aiBusy ? (
                  <>
                    <span className="spinner inline" aria-hidden />
                    Generating…
                  </>
                ) : aiTab === 'content' || aiTab === 'section' ? (
                  'Generate & update'
                ) : (
                  'Generate & insert'
                )}
              </button>
              <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
                Provider + key: <Link to="/settings">Settings → AI</Link>
              </p>
            </>
          )}

          {sideTab === 'code' && (
            <>
              <h3>Custom scripts</h3>
              <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>
                AI CSS/JS is saved here automatically. Preview runs in the canvas; publish to use on the live site.
              </p>
              <div className="field">
                <label>Head HTML / CSS</label>
                <textarea rows={7} value={customHead} onChange={(e) => setCustomHead(e.target.value)} />
              </div>
              <div className="field">
                <label>Body scripts</label>
                <textarea rows={7} value={customBody} onChange={(e) => setCustomBody(e.target.value)} />
              </div>
            </>
          )}

          {sideTab === 'seo' && (
            <>
              <h3>SEO</h3>
              <div className="field">
                <label>Meta title</label>
                <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
              </div>
              <div className="field">
                <label>Meta description</label>
                <textarea rows={4} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
