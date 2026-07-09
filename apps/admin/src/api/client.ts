import axios, { type AxiosResponse } from 'axios'

const TOKEN_KEY = 'pbv2_token'

/** artisan serve sometimes prefixes JSON with PHP Notice HTML — recover the payload. */
function parsePossiblyPollutedJson(raw: unknown): unknown {
  if (raw == null) return raw
  if (typeof raw !== 'string') return raw

  const text = raw.trim()
  if (!text) return text

  try {
    return JSON.parse(text)
  } catch {
    const arr = text.indexOf('[')
    const obj = text.indexOf('{')
    let start = -1
    if (arr === -1) start = obj
    else if (obj === -1) start = arr
    else start = Math.min(arr, obj)

    if (start >= 0) {
      const slice = text.slice(start)
      try {
        return JSON.parse(slice)
      } catch {
        // fall through
      }
    }
  }

  return raw
}

export const api = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  // Keep raw text so we can salvage JSON after PHP notice noise
  transformResponse: [
    (data) => parsePossiblyPollutedJson(data),
  ],
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Let the browser set multipart boundary for FormData
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers && 'Content-Type' in config.headers) {
      delete (config.headers as Record<string, unknown>)['Content-Type']
    }
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

/** Normalize list endpoints that must return arrays. */
export function asArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.data)) return obj.data as T[]
    if (Array.isArray(obj.items)) return obj.items as T[]
  }
  return []
}

export async function getList<T>(url: string): Promise<T[]> {
  const { data }: AxiosResponse<unknown> = await api.get(url)
  return asArray<T>(data)
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
