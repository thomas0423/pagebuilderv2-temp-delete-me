import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import axios from 'axios'
import { api } from '../api/client'

type SaveStatus = 'idle' | 'saving' | 'success' | 'error'

type SettingField = { group: string; is_secret: boolean; configured: boolean; value: string | null }
type Runtime = {
  active_db: string
  active_filesystem: string
  ai_ready: boolean
  ai_provider?: string
  ai_model?: string
}
type AiProviderOption = {
  id: string
  label: string
  default_model: string
  models: { value: string; label: string }[]
  docs?: string | null
  hint?: string | null
}
type SettingsResponse = Record<string, SettingField | Runtime | AiProviderOption[]> & {
  runtime: Runtime
  ai_providers: AiProviderOption[]
}

function formFromSettings(data: SettingsResponse): Record<string, string> {
  const next: Record<string, string> = {}
  for (const [key, val] of Object.entries(data)) {
    if (key === 'runtime' || key === 'ai_providers') continue
    const item = val as SettingField
    if (!item || typeof item !== 'object' || !('is_secret' in item)) continue
    next[key] = item.is_secret ? '' : (item.value ?? '')
  }
  return next
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsResponse | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<SaveStatus>('idle')
  const [message, setMessage] = useState('')
  const [customModel, setCustomModel] = useState(false)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const successTimer = useRef<number | null>(null)

  const showFeedback = (next: SaveStatus, text: string) => {
    setStatus(next)
    setMessage(text)
    if (successTimer.current) window.clearTimeout(successTimer.current)
    if (next === 'success') {
      successTimer.current = window.setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 4000)
    }
    requestAnimationFrame(() => {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }

  useEffect(() => {
    return () => {
      if (successTimer.current) window.clearTimeout(successTimer.current)
    }
  }, [])

  const applySettings = (data: SettingsResponse) => {
    setSettings(data)
    const next = formFromSettings(data)
    setForm(next)

    const providers = data.ai_providers || []
    const providerId = next.ai_provider || 'openai'
    const provider = providers.find((p) => p.id === providerId)
    const model = next.ai_model || provider?.default_model || ''
    if (!next.ai_model && provider?.default_model) {
      next.ai_model = provider.default_model
      setForm({ ...next })
    }
    const known = provider?.models.some((m) => m.value === model) ?? false
    setCustomModel(!known && model !== '')
  }

  const load = async () => {
    const { data } = await api.get<SettingsResponse>('/settings')
    applySettings(data)
  }

  useEffect(() => {
    void load().catch((err: unknown) => {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message || err.message
        : 'Failed to load settings'
      showFeedback('error', msg)
    })
  }, [])

  const providers = settings?.ai_providers ?? []
  const selectedProvider = useMemo(
    () => providers.find((p) => p.id === (form.ai_provider || 'openai')) ?? providers[0],
    [providers, form.ai_provider],
  )

  const onProviderChange = (providerId: string) => {
    const provider = providers.find((p) => p.id === providerId)
    setCustomModel(false)
    setForm((prev) => ({
      ...prev,
      ai_provider: providerId,
      ai_model: provider?.default_model || prev.ai_model || '',
    }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    showFeedback('saving', 'Saving settings…')

    const payload: Record<string, string> = {}
    for (const [key, value] of Object.entries(form)) {
      if (typeof value === 'string' && value.trim() !== '') {
        payload[key] = value.trim()
      }
    }

    // Always send current provider/model/driver selections even if unchanged
    if (form.ai_provider) payload.ai_provider = form.ai_provider
    if (form.ai_model) payload.ai_model = form.ai_model
    if (form.storage_driver) payload.storage_driver = form.storage_driver
    if (form.db_driver) payload.db_driver = form.db_driver
    if (form.site_name !== undefined) payload.site_name = form.site_name

    try {
      const { data } = await api.put<SettingsResponse>('/settings', payload)
      applySettings(data)
      showFeedback('success', 'Settings saved successfully.')
    } catch (err: unknown) {
      let msg = 'Failed to save settings.'
      if (axios.isAxiosError(err)) {
        const body = err.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined
        if (body?.errors) {
          msg = Object.values(body.errors).flat().join(' ')
        } else if (body?.message) {
          msg = body.message
        } else if (err.message) {
          msg = err.message
        }
      }
      showFeedback('error', msg)
    }
  }

  if (!settings && status !== 'error') {
    return (
      <div className="alert processing">
        <span className="spinner" aria-hidden />
        Loading settings…
      </div>
    )
  }
  if (!settings && status === 'error') {
    return (
      <div className="alert">
        {message || 'Failed to load settings.'}{' '}
        <button
          type="button"
          className="btn secondary"
          onClick={() => {
            setStatus('idle')
            setMessage('')
            void load().catch((err: unknown) => {
              const msg = axios.isAxiosError(err)
                ? (err.response?.data as { message?: string } | undefined)?.message || err.message
                : 'Failed to load settings'
              showFeedback('error', msg)
            })
          }}
        >
          Retry
        </button>
      </div>
    )
  }
  if (!settings) return null

  const runtime = settings.runtime
  const aiConfigured = (settings.ai_api_key as SettingField)?.configured
  const providerLabel = selectedProvider?.label || form.ai_provider || 'AI'

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Settings</h1>
          <p>Local by default. Configure cloud storage, database, and AI when you need them.</p>
        </div>
      </div>

      {!aiConfigured && (
        <div className="alert warn" style={{ marginBottom: 16 }}>
          AI API key is not configured. Choose a provider below, paste its API key, then use AI in the page builder.
        </div>
      )}

      <form className="settings-sections" onSubmit={(e) => void submit(e)}>
        <section className="card">
          <h2>General</h2>
          <div className="field">
            <label>Site name</label>
            <input value={form.site_name || ''} onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
          </div>
          <p className="muted">
            Runtime DB: <code>{runtime?.active_db}</code> · Filesystem: <code>{runtime?.active_filesystem}</code> · AI:{' '}
            {runtime?.ai_ready ? `ready (${providerLabel})` : 'not configured'}
          </p>
        </section>

        <section className="card">
          <h2>AI</h2>
          <p className="muted" style={{ marginTop: 0 }}>
            Pick a provider, paste that provider’s API key, and choose a model. Generation in the editor uses these settings.
          </p>

          <div className="field">
            <label>Provider</label>
            <select value={form.ai_provider || 'openai'} onChange={(e) => onProviderChange(e.target.value)}>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            {selectedProvider?.hint && <span className="muted" style={{ fontSize: 12 }}>{selectedProvider.hint}</span>}
            {selectedProvider?.docs && (
              <a className="muted" style={{ fontSize: 12 }} href={selectedProvider.docs} target="_blank" rel="noreferrer">
                Get API key →
              </a>
            )}
          </div>

          <div className="field">
            <label>API key {aiConfigured ? '(configured — leave blank to keep)' : '(required to use AI)'}</label>
            <input
              type="password"
              autoComplete="off"
              placeholder={aiConfigured ? '••••••••' : `Paste ${providerLabel} API key`}
              value={form.ai_api_key || ''}
              onChange={(e) => setForm({ ...form, ai_api_key: e.target.value })}
            />
          </div>

          <div className="field">
            <label>Model</label>
            {!customModel ? (
              <select
                value={form.ai_model || selectedProvider?.default_model || ''}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setCustomModel(true)
                    return
                  }
                  setForm({ ...form, ai_model: e.target.value })
                }}
              >
                {(selectedProvider?.models || []).map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
                <option value="__custom__">Custom model id…</option>
              </select>
            ) : (
              <div className="row" style={{ gap: 8 }}>
                <input
                  style={{ flex: 1 }}
                  value={form.ai_model || ''}
                  onChange={(e) => setForm({ ...form, ai_model: e.target.value })}
                  placeholder="e.g. gpt-4o-mini"
                />
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setCustomModel(false)
                    setForm((prev) => ({
                      ...prev,
                      ai_model: selectedProvider?.default_model || prev.ai_model,
                    }))
                  }}
                >
                  Presets
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="card">
          <h2>Storage</h2>
          <div className="field">
            <label>Driver</label>
            <select value={form.storage_driver || 'local'} onChange={(e) => setForm({ ...form, storage_driver: e.target.value })}>
              <option value="local">Local (default)</option>
              <option value="s3">S3 / R2 compatible</option>
            </select>
          </div>
          <div className="grid two">
            <div className="field">
              <label>Access key</label>
              <input type="password" value={form.storage_key || ''} onChange={(e) => setForm({ ...form, storage_key: e.target.value })} placeholder="Leave blank to keep" />
            </div>
            <div className="field">
              <label>Secret</label>
              <input type="password" value={form.storage_secret || ''} onChange={(e) => setForm({ ...form, storage_secret: e.target.value })} placeholder="Leave blank to keep" />
            </div>
          </div>
          <div className="grid two">
            <div className="field">
              <label>Bucket</label>
              <input value={form.storage_bucket || ''} onChange={(e) => setForm({ ...form, storage_bucket: e.target.value })} />
            </div>
            <div className="field">
              <label>Region</label>
              <input value={form.storage_region || ''} onChange={(e) => setForm({ ...form, storage_region: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Endpoint (R2 / custom)</label>
            <input value={form.storage_endpoint || ''} onChange={(e) => setForm({ ...form, storage_endpoint: e.target.value })} />
          </div>
          <p className="muted">If S3 is selected but keys are missing, uploads fall back to local storage.</p>
        </section>

        <section className="card">
          <h2>Database</h2>
          <div className="alert info">
            Values are saved for future cloud setup. The running demo uses the connection in
            <code> apps/api/.env</code>. Switching live DB requires updating that file and running migrations.
          </div>
          <div className="field">
            <label>Driver</label>
            <select value={form.db_driver || 'mysql'} onChange={(e) => setForm({ ...form, db_driver: e.target.value })}>
              <option value="sqlite">SQLite</option>
              <option value="mysql">MySQL</option>
              <option value="pgsql">PostgreSQL</option>
            </select>
          </div>
          <div className="grid two">
            <div className="field">
              <label>Host</label>
              <input value={form.db_host || ''} onChange={(e) => setForm({ ...form, db_host: e.target.value })} />
            </div>
            <div className="field">
              <label>Port</label>
              <input value={form.db_port || ''} onChange={(e) => setForm({ ...form, db_port: e.target.value })} />
            </div>
          </div>
          <div className="grid two">
            <div className="field">
              <label>Database</label>
              <input value={form.db_database || ''} onChange={(e) => setForm({ ...form, db_database: e.target.value })} />
            </div>
            <div className="field">
              <label>Username</label>
              <input value={form.db_username || ''} onChange={(e) => setForm({ ...form, db_username: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.db_password || ''} onChange={(e) => setForm({ ...form, db_password: e.target.value })} placeholder="Leave blank to keep" />
          </div>
        </section>

        <div className="settings-status" ref={feedbackRef} aria-live="polite">
          {status === 'saving' && (
            <div className="alert processing">
              <span className="spinner" aria-hidden />
              {message || 'Saving settings…'}
            </div>
          )}
          {status === 'success' && <div className="alert success">{message || 'Settings saved successfully.'}</div>}
          {status === 'error' && <div className="alert">{message || 'Failed to save settings.'}</div>}

          <button className="btn" type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? (
              <>
                <span className="spinner inline" aria-hidden />
                Saving…
              </>
            ) : (
              'Save settings'
            )}
          </button>
        </div>
      </form>
    </>
  )
}
