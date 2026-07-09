import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@pagebuilder.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Login failed. Use admin@pagebuilder.test / password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Welcome back</h1>
        <p className="muted">Modern CMS admin.</p>
        {error && <div className="alert">{error}</div>}
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <button className="btn" type="submit" disabled={busy} style={{ width: '100%' }}>
          {busy ? 'Signing in…' : 'Enter studio'}
        </button>
        <p className="muted" style={{ marginTop: 16, fontSize: 13 }}>
          Demo: admin@pagebuilder.test / password
        </p>
      </form>
    </div>
  )
}
