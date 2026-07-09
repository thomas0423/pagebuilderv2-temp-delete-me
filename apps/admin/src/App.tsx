import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import { AuthProvider, useAuth } from './lib/auth'
import DashboardPage from './pages/DashboardPage'
import EditorPage from './pages/EditorPage'
import LoginPage from './pages/LoginPage'
import MediaPage from './pages/MediaPage'
import MenusPage from './pages/MenusPage'
import PagesPage from './pages/PagesPage'
import ProductsPage from './pages/ProductsPage'
import SettingsPage from './pages/SettingsPage'
import UsersPage from './pages/UsersPage'
import type { ReactNode } from 'react'

function Protected({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="login-page muted">Loading studio…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="pages" element={<PagesPage />} />
          <Route path="pages/:id/edit" element={<EditorPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="menus" element={<MenusPage />} />
          <Route path="media" element={<MediaPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
