'use client'

import React, { useState, useEffect } from 'react'
import { Download, BookOpen, FileText } from 'lucide-react'

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL ?? 'http://localhost:5001'

type Note = {
  id: string
  title: string
  subject: string
  module_code: string
  description: string
  file_url: string
  created_at: string
  uploader: { firstname: string; lastname: string } | null
}

const NotesSection = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${FLASK_URL}/notes`)
      .then((r) => r.json())
      .then((data) => { setNotes(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading notes...</div>
  if (notes.length === 0) return (
    <div className="text-center py-12 text-gray-500">
      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
      <p>No notes uploaded yet. Be the first!</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Study Notes
          <span className="ml-3 text-base font-normal text-gray-500">({notes.length} results)</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Header band */}
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-white/80" />
            </div>

            <div className="p-6">
              <div className="mb-3">
                <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
                  {note.module_code}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{note.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{note.subject}</p>
              </div>

              {note.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{note.description}</p>
              )}

              <p className="text-xs text-gray-400 mb-4">
                by {note.uploader ? `${note.uploader.firstname} ${note.uploader.lastname}` : 'Anonymous'}
                {' · '}
                {new Date(note.created_at).toLocaleDateString()}
              </p>

              <a
                href={note.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotesSection
