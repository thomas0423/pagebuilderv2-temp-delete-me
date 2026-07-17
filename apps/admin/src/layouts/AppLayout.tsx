import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/pages', label: 'Pages' },
  { to: '/modules', label: 'Modules' },
  { to: '/products', label: 'Products' },
  { to: '/menus', label: 'Menus' },
  { to: '/media', label: 'Media' },
  { to: '/users', label: 'Users' },
  { to: '/settings', label: 'Settings' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isEditor = /\/pages\/\d+\/edit/.test(location.pathname)

  // Full-bleed studio — no app sidebar competing with the canvas
  if (isEditor) {
    return (
      <div className="app-shell app-shell--editor">
        <main className="main main--editor">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>PageBuilder</strong>
          <span>V2</span>
        </div>
        <nav className="nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div>{user?.name}</div>
          <div className="muted">{user?.email}</div>
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn secondary" type="button" onClick={() => void logout()}>
              Log out
            </button>
          </div>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
