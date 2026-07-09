import { useEffect, useState, type FormEvent } from 'react'
import { api, type User } from '../api/client'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'editor' })

  const load = async () => {
    const { data } = await api.get<User[]>('/users')
    setUsers(data)
  }

  useEffect(() => {
    void load()
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    await api.post('/users', form)
    setForm({ name: '', email: '', password: '', role: 'editor' })
    await load()
  }

  const remove = async (id: number) => {
    if (!confirm('Delete user?')) return
    await api.delete(`/users/${id}`)
    await load()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Users</h1>
          <p>Admin and editor roles for the studio.</p>
        </div>
      </div>

      <div className="grid two">
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td className="muted">{u.email}</td>
                  <td>
                    <span className="badge">{u.role}</span>
                  </td>
                  <td>
                    <button className="btn danger" type="button" onClick={() => void remove(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="card" onSubmit={submit}>
          <h3>Invite user</h3>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
          </div>
          <div className="field">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button className="btn" type="submit">
            Create user
          </button>
        </form>
      </div>
    </>
  )
}
