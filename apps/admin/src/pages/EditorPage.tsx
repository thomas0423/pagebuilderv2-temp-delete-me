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

function loadContent(editor: Editor, page: Page, showChrome: boolean) {
  const body = page.compiled_html?.trim()
    ? page.compiled_html
    : `<section style="padding:80px 24px;text-align:center;color:#334155;background:#fff">
        <h1 style="font-family:Georgia,serif;margin:0 0 12px">Empty canvas</h1>
        <p style="margin:0">Drag a block from the left to start.</p>
      </section>`

  // Load page body only — chrome is applied via syncSiteChrome (both or none)
  // NEVER call setStyle() after setComponents — it wipes parsed inline CSS.
  editor.setComponents(body)

  const extra = (page.compiled_css || '').trim()
  if (extra) editor.addStyle(extra)

  syncSiteChrome(editor, showChrome)
}

function injectPublicCss(editor: Editor) {
  const doc = editor.Canvas.getDocument()
  if (!doc) return false

  let styleEl = doc.getElementById('pb-public-base') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = doc.createElement('style')
    styleEl.id = 'pb-public-base'
    doc.head.appendChild(styleEl)
  }
  styleEl.textContent = PUBLIC_CANVAS_CSS

  doc.documentElement.style.cssText = 'width:100%;height:100%;margin:0;padding:0;background:#fff;'
  doc.body.style.cssText = 'width:100%;min-height:100%;margin:0;padding:0;background:#fff;color:#0f172a;font-family:"Segoe UI",system-ui,sans-serif;'

  // Force the iframe element to the active device width (GrapesJS sometimes leaves it at 100%)
  const frame = editor.Canvas.getFrameEl()
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

  editor.refresh()
  return true
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

  useEffect(() => {
    if (!page) return

    let editor: Editor | null = null
    let cancelled = false

    // Wait one frame so refs are attached after paint
    const raf = requestAnimationFrame(() => {
      if (cancelled || !canvasRef.current || !blocksRef.current) {
        setInitError('Editor DOM not ready. Refresh the page.')
        return
      }

      try {
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
          layerManager: { appendTo: layersRef.current! },
          styleManager: {
            appendTo: stylesRef.current!,
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
          traitManager: { appendTo: traitsRef.current! },
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

        for (const block of BLOCKS) {
          editor.BlockManager.add(block.id, {
            label: block.label,
            category: block.category,
            content: block.content,
          })
        }

        loadContent(editor, page, showChromeRef.current)
        editor.setDevice('Desktop')

        const polishCanvas = () => {
          try {
            if (editor) injectPublicCss(editor)
          } catch (e) {
            console.warn('canvas polish failed', e)
          }
        }

        editor.on('canvas:frame:load', polishCanvas)
        editor.on('change:device', polishCanvas)
        // GrapesJS emits styles into the iframe asynchronously — re-inject base CSS after load
        requestAnimationFrame(polishCanvas)
        window.setTimeout(polishCanvas, 100)
        window.setTimeout(polishCanvas, 400)
        window.setTimeout(polishCanvas, 1000)

        editorRef.current = editor
        setReady(true)
        setInitError('')
        setMessage('')
      } catch (err) {
        console.error('GrapesJS init failed', err)
        setInitError(err instanceof Error ? err.message : 'GrapesJS failed to start')
        setReady(false)
      }
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      try {
        editor?.destroy()
      } catch {
        // ignore
      }
      if (editorRef.current === editor) editorRef.current = null
      setReady(false)
    }
  }, [page])

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
    const t = window.setTimeout(() => injectPublicCss(ed), 80)
    return () => window.clearTimeout(t)
  }, [ready, showBlocks, showInspector])

  // Toggle site chrome: always both header+footer, or neither
  useEffect(() => {
    if (!ready || !editorRef.current) return
    syncSiteChrome(editorRef.current, showChrome)
    injectPublicCss(editorRef.current)
  }, [ready, showChrome])

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

  const runAi = async () => {
    setAiBusy(true)
    setAiError('')
    try {
      const { data } = await api.post('/ai/generate', { type: aiTab, prompt })
      const editor = editorRef.current
      if (!editor) {
        setAiError('Builder not ready.')
        return
      }
      if (aiTab === 'image' && data.url) {
        editor.addComponents({
          type: 'image',
          src: data.url,
          style: { width: '100%', height: 'auto' },
        })
      } else if (data.html) {
        if (aiTab === 'page') editor.setComponents(data.html)
        else editor.addComponents(data.html)
        if (data.css) editor.addStyle(data.css)
      }
      setMessage('AI content inserted.')
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string; hint?: string } } }
      const msg = axiosErr.response?.data?.message || 'AI request failed'
      const hint = axiosErr.response?.data?.hint
      setAiError(hint ? `${msg} ${hint}` : msg)
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
        <div className="alert warn" style={{ margin: 0, borderRadius: 0 }}>
          {initError}
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
                Optional — drag-and-drop works without a key.
              </p>
              <div className="field">
                <label>Type</label>
                <select value={aiTab} onChange={(e) => setAiTab(e.target.value as AiTab)}>
                  <option value="content">Content</option>
                  <option value="section">Section</option>
                  <option value="page">Whole page</option>
                  <option value="image">Image</option>
                </select>
              </div>
              <div className="field">
                <label>Prompt</label>
                <textarea rows={5} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </div>
              {aiError && <div className="alert warn">{aiError}</div>}
              <button className="btn" type="button" disabled={aiBusy} onClick={() => void runAi()} style={{ width: '100%' }}>
                {aiBusy ? 'Generating…' : 'Generate & insert'}
              </button>
              <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>
                Choose provider + key in <Link to="/settings">Settings → AI</Link>
              </p>
            </>
          )}

          {sideTab === 'code' && (
            <>
              <h3>Custom scripts</h3>
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
