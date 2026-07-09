import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, type Page } from '../api/client'

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [title, setTitle] = useState('')
  const [busy, setBusy] = useState(false)

  const load = async () => {
    const { data } = await api.get<Page[]>('/pages')
    setPages(data)
  }

  useEffect(() => {
    void load()
  }, [])

  const create = async (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setBusy(true)
    try {
      await api.post('/pages', { title })
      setTitle('')
      await load()
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: number) => {
    if (!confirm('Delete this page?')) return
    await api.delete(`/pages/${id}`)
    await load()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Pages</h1>
          <p>Create pages, open the builder, publish to the public site.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <form className="row" onSubmit={create}>
          <input
            placeholder="New page title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, minWidth: 220, background: 'rgba(0,0,0,.25)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 12px' }}
          />
          <button className="btn" type="submit" disabled={busy}>
            Create page
          </button>
        </form>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id}>
                <td>{page.title}</td>
                <td className="muted">/{page.slug}</td>
                <td>
                  <span className={`badge ${page.status}`}>{page.status}</span>
                </td>
                <td className="row" style={{ justifyContent: 'flex-end' }}>
                  <Link className="btn ghost" to={`/pages/${page.id}/edit`}>
                    Edit
                  </Link>
                  {page.status === 'published' && (
                    <a className="btn secondary" href={`http://localhost:8000/p/${page.slug}`} target="_blank" rel="noreferrer">
                      View
                    </a>
                  )}
                  <button className="btn danger" type="button" onClick={() => void remove(page.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
