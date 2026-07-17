import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { api, getList, type ContentModule, type ContentModuleType } from '../api/client'

const MODULE_META: Record<ContentModuleType, { title: string; description: string; singular: string }> = {
  promotion: {
    title: 'Promotions',
    description: 'Manage Discover and channel promotions.',
    singular: 'promotion',
  },
  announcement: {
    title: 'Announcements',
    description: 'Manage announcement lists and notices.',
    singular: 'announcement',
  },
  news: {
    title: 'News',
    description: 'Manage news items.',
    singular: 'news item',
  },
  article: {
    title: 'Articles',
    description: 'Manage editorial articles.',
    singular: 'article',
  },
}

function emptyForm(type: ContentModuleType) {
  return {
    type,
    title: '',
    summary: '',
    body: '',
    image_url: '',
    banner_url: '',
    external_url: '',
    status: 'draft' as ContentModule['status'],
    published_on: '',
    starts_at: '',
    ends_at: '',
    is_pinned: false,
    sort_order: '0',
  }
}

export default function ModulesPage({ type }: { type: ContentModuleType }) {
  const meta = MODULE_META[type]
  const [items, setItems] = useState<ContentModule[]>([])
  const [form, setForm] = useState(() => emptyForm(type))
  const [editingId, setEditingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      setItems(await getList<ContentModule>(`/content-modules?type=${type}`))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setForm(emptyForm(type))
    setEditingId(null)
    setError(null)
    void load()
  }, [type])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    const payload = {
      ...form,
      type,
      sort_order: Number(form.sort_order) || 0,
      published_on: form.published_on || null,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
      image_url: form.image_url || null,
      banner_url: form.banner_url || null,
      external_url: form.external_url || null,
      summary: form.summary || null,
      body: form.body || null,
    }
    try {
      if (editingId) await api.put(`/content-modules/${editingId}`, payload)
      else await api.post('/content-modules', payload)
      setForm(emptyForm(type))
      setEditingId(null)
      await load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    }
  }

  const edit = (m: ContentModule) => {
    setEditingId(m.id)
    setForm({
      type,
      title: m.title,
      summary: m.summary || '',
      body: m.body || '',
      image_url: m.image_url || '',
      banner_url: m.banner_url || '',
      external_url: m.external_url || '',
      status: m.status,
      published_on: m.published_on?.slice(0, 10) || '',
      starts_at: m.starts_at?.slice(0, 10) || '',
      ends_at: m.ends_at?.slice(0, 10) || '',
      is_pinned: m.is_pinned,
      sort_order: String(m.sort_order ?? 0),
    })
  }

  const remove = async (id: number) => {
    if (!confirm(`Delete this ${meta.singular}?`)) return
    await api.delete(`/content-modules/${id}`)
    await load()
  }

  if (!meta) return <Navigate to="/" replace />

  return (
    <>
      <div className="topbar">
        <div>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
      </div>

      <div className="row muted" style={{ marginBottom: 12, gap: 16 }}>
        <span>{loading ? 'Loading…' : `${items.length} ${meta.title.toLowerCase()}`}</span>
      </div>

      <div className="grid two">
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m.id}>
                  <td>
                    {m.is_pinned ? '[Pinned] ' : ''}
                    {m.title}
                    {m.source_channel ? <div className="muted">{m.source_channel}</div> : null}
                  </td>
                  <td>{m.status}</td>
                  <td>{m.published_on?.slice(0, 10) || '—'}</td>
                  <td className="row" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn ghost" type="button" onClick={() => edit(m)}>
                      Edit
                    </button>
                    <button className="btn danger" type="button" onClick={() => void remove(m.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 && (
                <tr>
                  <td colSpan={4} className="muted">
                    No {meta.title.toLowerCase()} yet. Create one with the form.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <form className="card" onSubmit={(e) => void submit(e)}>
          <h3>{editingId ? `Edit ${meta.singular}` : `New ${meta.singular}`}</h3>
          {error && <p className="muted">{error}</p>}
          <div className="field">
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="field">
            <label>Summary</label>
            <textarea rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div className="field">
            <label>Body (HTML)</label>
            <textarea rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
          </div>
          <div className="field">
            <label>Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ContentModule['status'] })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="field">
            <label>Published on</label>
            <input
              type="date"
              value={form.published_on}
              onChange={(e) => setForm({ ...form, published_on: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Starts / Ends</label>
            <div className="row">
              <input type="date" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
              <input type="date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="field">
            <label>Banner URL</label>
            <input value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} />
          </div>
          <div className="field">
            <label>External URL</label>
            <input value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} />
          </div>
          <div className="field">
            <label>Sort order</label>
            <input value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          </div>
          <label className="row muted">
            <input
              type="checkbox"
              checked={form.is_pinned}
              onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
            />
            Pinned
          </label>
          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn" type="submit">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button
                className="btn secondary"
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyForm(type))
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  )
}
