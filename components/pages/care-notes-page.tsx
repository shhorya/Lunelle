'use client'

import { useState } from 'react'
import { Heart, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useLocalStorage } from '@/lib/use-local-storage'

type Note = { id: string; author: 'A' | 'J'; text: string; date: string }

const seedNotes: Note[] = [
  { id: '1', author: 'J', text: 'Left your favorite tea on the counter 💛', date: new Date().toISOString() },
]

export function CareNotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>('lunelle-notes', seedNotes)
  const [author, setAuthor] = useState<Note['author']>('A')
  const [text, setText] = useState('')

  function addNote(event: React.FormEvent) {
    event.preventDefault()
    if (!text.trim()) return
    setNotes([{ id: crypto.randomUUID(), author, text: text.trim(), date: new Date().toISOString() }, ...notes])
    setText('')
  }

  function removeNote(id: string) {
    setNotes(notes.filter((n) => n.id !== id))
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

      <div className="dashboard-grid">
        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Leave a note</p><h3>From</h3></div></div>
          <form className="field-group" onSubmit={addNote}>
            <select className="select-input" value={author} onChange={(e) => setAuthor(e.target.value as Note['author'])}>
              <option value="A">A</option>
              <option value="J">J</option>
            </select>
            <input className="text-input" type="text" placeholder="Write something kind…" value={text} onChange={(e) => setText(e.target.value)} />
            <button type="submit" className="primary-button full"><Plus size={18} /> Post note</button>
          </form>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Board</p><h3>{notes.length} note{notes.length === 1 ? '' : 's'}</h3></div></div>
          {notes.length === 0 && <p className="empty-state">No notes yet — be the first to leave one.</p>}
          {notes.map((note) => (
            <div className="note-card" key={note.id}>
              <div className="note-meta"><span className="avatar small">{note.author}</span><small>{new Date(note.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small></div>
              <p>{note.text}</p>
              <button className="delete-btn" onClick={() => removeNote(note.id)} aria-label="Delete note"><Trash2 size={14} /></button>
            </div>
          ))}
        </GlassCard>
      </div>
    </>
  )
}