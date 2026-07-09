import { useEffect, useState } from 'react'
import { api, getList, type MediaItem } from '../api/client'

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [uploading, setUploading] = useState(false)

  const load = async () => {
    setItems(await getList<MediaItem>('/media'))
  }

  useEffect(() => {
    void load()
  }, [])

  const onUpload = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      await api.post('/media', body, { headers: { 'Content-Type': 'multipart/form-data' } })
      await load()
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id: number) => {
    await api.delete(`/media/${id}`)
    await load()
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Media</h1>
          <p>Local disk by default. Switch to S3/R2 in Settings when ready.</p>
        </div>
        <label className="btn">
          {uploading ? 'Uploading…' : 'Upload file'}
          <input
            type="file"
            hidden
            onChange={(e) => void onUpload(e.target.files?.[0] || null)}
            disabled={uploading}
          />
        </label>
      </div>

      <div className="media-grid">
        {items.map((item) => (
          <figure key={item.id}>
            {item.mime_type?.startsWith('image/') ? (
              <img src={item.url} alt={item.alt || item.name} />
            ) : (
              <div style={{ aspectRatio: 1, display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>File</div>
            )}
            <figcaption>
              <div>{item.name}</div>
              <button className="btn danger" type="button" style={{ marginTop: 8 }} onClick={() => void remove(item.id)}>
                Delete
              </button>
            </figcaption>
          </figure>
        ))}
      </div>
      {!items.length && <div className="card muted">No media yet — upload an image to get started.</div>}
    </>
  )
}
