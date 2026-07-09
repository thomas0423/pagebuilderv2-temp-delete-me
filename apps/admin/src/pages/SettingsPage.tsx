import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { api } from '../api/client'

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

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsResponse | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState('')
  const [customModel, setCustomModel] = useState(false)

  const load = async () => {
    const { data } = await api.get<SettingsResponse>('/settings')
    setSettings(data)
    const next: Record<string, string> = {}
    for (const [key, val] of Object.entries(data)) {
      if (key === 'runtime' || key === 'ai_providers') continue
      const item = val as SettingField
      next[key] = item.is_secret ? '' : (item.value ?? '')
    }
    setForm(next)

    const providers = data.ai_providers || []
    const providerId = next.ai_provider || 'openai'
    const provider = providers.find((p) => p.id === providerId)
    const model = next.ai_model || provider?.default_model || ''
    const known = provider?.models.some((m) => m.value === model) ?? false
    setCustomModel(!known && model !== '')
  }

  useEffect(() => {
    void load()
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
    const payload: Record<string, string> = {}
    for (const [key, value] of Object.entries(form)) {
      if (value !== '') payload[key] = value
    }
    const { data } = await api.put<SettingsResponse>('/settings', payload)
    setSettings(data)
    setSaved('Settings saved. AI key and cloud credentials are stored server-side.')
    // Clear secret fields after save (keep configured state from response)
    setForm((prev) => ({
      ...prev,
      ai_api_key: '',
      storage_key: '',
      storage_secret: '',
      db_password: '',
    }))
  }

  if (!settings) return <div className="muted">Loading settings…</div>

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

      {saved && <div className="alert info">{saved}</div>}

      {!aiConfigured && (
        <div className="alert warn" style={{ marginBottom: 16 }}>
          AI API key is not configured. Choose a provider below, paste its API key, then use AI in the page builder.
        </div>
      )}

      <form className="settings-sections" onSubmit={submit}>
        <section className="card">
          <h2>General</h2>
          <div className="field">
            <label>Site name</label>
            <input value={form.site_name || ''} onChange={(e) => setForm({ ...form, site_name: e.target.value })} />
          </div>
          <p className="muted">
            Runtime DB: <code>{runtime.active_db}</code> · Filesystem: <code>{runtime.active_filesystem}</code> · AI:{' '}
            {runtime.ai_ready ? `ready (${providerLabel})` : 'not configured'}
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
            <select value={form.db_driver || 'sqlite'} onChange={(e) => setForm({ ...form, db_driver: e.target.value })}>
              <option value="sqlite">SQLite (default)</option>
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

        <button className="btn" type="submit">
          Save settings
        </button>
      </form>
    </>
  )
}
