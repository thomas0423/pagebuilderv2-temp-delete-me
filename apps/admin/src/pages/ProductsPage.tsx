import { useEffect, useState, type FormEvent } from 'react'
import { api, type Product } from '../api/client'

const empty = { name: '', description: '', price: '0', image_url: '', is_active: true }

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState<number | null>(null)

  const load = async () => {
    const { data } = await api.get<Product[]>('/products')
    setItems(data)
  }

  useEffect(() => {
    void load()
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price) }
    if (editingId) await api.put(`/products/${editingId}`, payload)
    else await api.post('/products', payload)
    setForm(empty)
    setEditingId(null)
    await load()
  }

  const edit = (p: Product) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: p.description || '',
      price: String(p.price),
      image_url: p.image_url || '',
      is_active: p.is_active,
    })
  }

  const remove = async (id: number) => {
    if (!confirm('Delete product?')) return
    await api.delete(`/products/${id}`)
    await load()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Products</h1>
          <p>Non-developers can manage catalog content here.</p>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Active</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${Number(p.price).toFixed(2)}</td>
                  <td>{p.is_active ? 'Yes' : 'No'}</td>
                  <td className="row" style={{ justifyContent: 'flex-end' }}>
                    <button className="btn ghost" type="button" onClick={() => edit(p)}>
                      Edit
                    </button>
                    <button className="btn danger" type="button" onClick={() => void remove(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="card" onSubmit={submit}>
          <h3>{editingId ? 'Edit product' : 'New product'}</h3>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="field">
            <label>Price</label>
            <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="field">
            <label>Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <label className="row muted">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active
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
                  setForm(empty)
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
