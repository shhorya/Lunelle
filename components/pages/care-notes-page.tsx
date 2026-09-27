'use client'

import { useState } from 'react'
import { Heart, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useCareNotes } from '@/lib/use-care-notes'
import { useSettings } from '@/lib/use-settings'

export function CareNotesPage() {
  const { notes, loading, error, addNote, removeNote } = useCareNotes()
  const { settings } = useSettings()
  const [author, setAuthor] = useState(settings.name_a)
  const [text, setText] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!text.trim()) return
    addNote(author || settings.name_a, text.trim())
    setText('')
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><Heart size={14} /> Care notes</p>
          <h1>Notes for each other<span>.</span></h1>
          <p className="lede">A shared little board for sweet or practical notes.</p>
        </div>
      </div>

      {error && <div className="banner">Couldn&apos;t reach the database: {error}</div>}

      <div className="dashboard-grid">
        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Leave a note</p><h3>From</h3></div></div>
          <form className="field-group" onSubmit={submit}>
            <select className="select-input" value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value={settings.name_a}>{settings.name_a}</option>
              <option value={settings.name_b}>{settings.name_b}</option>
            </select>
            <input className="text-input" type="text" placeholder="Write something kind…" value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit" className="primary-button full"><Plus size={18} /> Post note</button>
          </form>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Board</p><h3>{loading ? 'Loading\u2026' : `${notes.length} note${notes.length === 1 ? '' : 's'}`}</h3></div></div>
          {!loading && notes.length === 0 && <p className="empty-state">No notes yet. Be the first to leave one.</p>}
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-meta"><span className="avatar small">{note.author?.[0] ?? '?'}</span><small>{new Date(note.created_at).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small></div>
              <p>{note.text}</p>
              <button className="delete-btn" onClick={() => removeNote(note.id)} aria-label="Delete note"><Trash2 size={14} /></button>
            </div>
          ))}
        </GlassCard>
      </div>
    </>
  )
}