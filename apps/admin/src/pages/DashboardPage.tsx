import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getList, type Page, type Product } from '../api/client'

export default function DashboardPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [aiReady, setAiReady] = useState(false)

  useEffect(() => {
    void Promise.all([
      getList<Page>('/pages').then(setPages),
      getList<Product>('/products').then(setProducts),
      api.get('/settings').then((r) => setAiReady(Boolean((r.data as { runtime?: { ai_ready?: boolean } })?.runtime?.ai_ready))),
    ]).catch(() => {
      setPages([])
      setProducts([])
    })
  }, [])

  const published = pages.filter((p) => p.status === 'published').length

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Studio overview</h1>
          <p>Local-first CMS — build pages, manage modules, wire AI when ready.</p>
        </div>
        <Link className="btn" to="/pages">
          Open pages
        </Link>
      </div>

      <div className="grid cards">
        <div className="card">
          <h3>Pages</h3>
          <div className="stat">{pages.length}</div>
          <div className="muted">{published} published</div>
        </div>
        <div className="card">
          <h3>Products</h3>
          <div className="stat">{products.length}</div>
          <div className="muted">CRUD without developers</div>
        </div>
        <div className="card">
          <h3>AI</h3>
          <div className="stat" style={{ fontSize: '1.4rem' }}>
            {aiReady ? 'Ready' : 'Needs key'}
          </div>
          <div className="muted">{aiReady ? 'Provider + key configured' : 'Set provider & key in Settings → AI'}</div>
        </div>
        <div className="card">
          <h3>Public site</h3>
          <div className="stat" style={{ fontSize: '1.2rem' }}>
            :8000
          </div>
          <a className="muted" href="http://localhost:8000" target="_blank" rel="noreferrer">
            Open published home →
          </a>
        </div>
      </div>

      <div className="grid two" style={{ marginTop: 16 }}>
        <div className="card">
          <h3>Pitch path</h3>
          <ol className="muted" style={{ lineHeight: 1.8, paddingLeft: 18 }}>
            <li>Open Pages → edit Home in the builder</li>
            <li>Drag blocks, tweak styles, drop custom HTML</li>
            <li>Try AI (shows Settings hint until key is set)</li>
            <li>Publish and preview on the public site</li>
          </ol>
        </div>
        <div className="card">
          <h3>Continue later</h3>
          <p className="muted">
            Repo: <code>/Users/binghaothai/Workspace/Twiport/pagebuilderv2</code>
          </p>
          <p className="muted">Run with <code>npm run dev</code> from the repo root.</p>
        </div>
      </div>
    </>
  )
}
