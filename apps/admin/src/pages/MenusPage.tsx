import { useEffect, useState, type FormEvent } from 'react'
import { api, type MenuItem } from '../api/client'

const empty: { location: 'header' | 'footer'; label: string; url: string; sort_order: number; is_active: boolean } = {
  location: 'header',
  label: '',
  url: '/',
  sort_order: 0,
  is_active: true,
}

export default function MenusPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [form, setForm] = useState(empty)

  const load = async () => {
    const { data } = await api.get<MenuItem[]>('/menus')
    setItems(data)
  }

  useEffect(() => {
    void load()
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    await api.post('/menus', form)
    setForm(empty)
    await load()
  }

  const remove = async (id: number) => {
    await api.delete(`/menus/${id}`)
    await load()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Menus</h1>
          <p>Header and footer links — no developer required.</p>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Label</th>
                <th>URL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.location}</td>
                  <td>{item.label}</td>
                  <td className="muted">{item.url}</td>
                  <td>
                    <button className="btn danger" type="button" onClick={() => void remove(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="card" onSubmit={submit}>
          <h3>Add menu item</h3>
          <div className="field">
            <label>Location</label>
            <select
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value as 'header' | 'footer' })}
            >
              <option value="header">Header</option>
              <option value="footer">Footer</option>
            </select>
          </div>
          <div className="field">
            <label>Label</label>
            <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} required />
          </div>
          <div className="field">
            <label>URL</label>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
          </div>
          <div className="field">
            <label>Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </div>
          <button className="btn" type="submit">
            Add item
          </button>
        </form>
      </div>
    </>
  )
}
