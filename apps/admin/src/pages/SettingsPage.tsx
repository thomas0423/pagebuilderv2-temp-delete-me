import { useEffect, useState, type FormEvent } from 'react'
import { api } from '../api/client'

type SettingsResponse = Record<
  string,
  | { group: string; is_secret: boolean; configured: boolean; value: string | null }
  | { active_db: string; active_filesystem: string; ai_ready: boolean }
>

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsResponse | null>(null)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState('')

  const load = async () => {
    const { data } = await api.get<SettingsResponse>('/settings')
    setSettings(data)
    const next: Record<string, string> = {}
    for (const [key, val] of Object.entries(data)) {
      if (key === 'runtime') continue
      const item = val as { value: string | null; is_secret: boolean }
      next[key] = item.is_secret ? '' : (item.value ?? '')
    }
    setForm(next)
  }

  useEffect(() => {
    void load()
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const payload: Record<string, string> = {}
    for (const [key, value] of Object.entries(form)) {
      if (value !== '') payload[key] = value
    }
    const { data } = await api.put('/settings', payload)
    setSettings(data)
    setSaved('Settings saved. AI key and cloud credentials are stored server-side.')
  }

  if (!settings) return <div className="muted">Loading settings…</div>

  const runtime = settings.runtime as { active_db: string; active_filesystem: string; ai_ready: boolean }
  const aiConfigured = (settings.ai_api_key as { configured: boolean })?.configured

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
          AI API key is not configured. When you use AI in the page builder, you’ll see: please configure the key in Settings → AI.
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
            {runtime.ai_ready ? 'ready' : 'not configured'}
          </p>
        </section>

        <section className="card">
          <h2>AI</h2>
          <div className="field">
            <label>Provider</label>
            <select value={form.ai_provider || 'openai'} onChange={(e) => setForm({ ...form, ai_provider: e.target.value })}>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
          <div className="field">
            <label>API key {aiConfigured ? '(configured — leave blank to keep)' : '(required to use AI)'}</label>
            <input
              type="password"
              placeholder={aiConfigured ? '••••••••' : 'Paste API key'}
              value={form.ai_api_key || ''}
              onChange={(e) => setForm({ ...form, ai_api_key: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Model</label>
            <input value={form.ai_model || ''} onChange={(e) => setForm({ ...form, ai_model: e.target.value })} />
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
            Values are saved for future cloud setup. The running demo uses SQLite locally. Switching live DB requires updating
            <code> apps/api/.env</code> and running migrations — documented for the next phase.
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
