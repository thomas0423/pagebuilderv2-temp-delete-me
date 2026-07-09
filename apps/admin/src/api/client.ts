import axios from 'axios'

const TOKEN_KEY = 'pbv2_token'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export type User = {
  id: number
  name: string
  email: string
  role: string
}

export type Page = {
  id: number
  title: string
  slug: string
  status: 'draft' | 'published'
  has_unpublished_changes?: boolean
  project_json: unknown
  compiled_html: string | null
  compiled_css: string | null
  published_html?: string | null
  published_css?: string | null
  custom_head?: string | null
  custom_body_scripts?: string | null
  meta_title?: string | null
  meta_description?: string | null
  published_at?: string | null
}

export type Product = {
  id: number
  name: string
  slug: string
  description: string | null
  price: string | number
  image_url: string | null
  is_active: boolean
}

export type MenuItem = {
  id: number
  location: 'header' | 'footer'
  label: string
  url: string
  sort_order: number
  is_active: boolean
}

export type MediaItem = {
  id: number
  name: string
  url: string
  mime_type: string | null
  size: number
  alt: string | null
}
