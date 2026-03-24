'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, BookOpen, FileText, AlignLeft, School } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const SMU_SCHOOLS = [
  'School of Computing and Information Systems',
  'School of Business',
  'School of Accountancy',
  'School of Economics',
  'School of Law',
  'School of Social Sciences',
  'College of Integrative Studies',
]

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL ?? 'http://localhost:5001'

export default function UploadNotesPage() {
  const [formData, setFormData] = useState({
    title: '',
    subject: SMU_SCHOOLS[0],
    module_code: '',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) { alert('Please select a PDF file.'); return }
    if (file.type !== 'application/pdf') { alert('Only PDF files are supported.'); return }

    setUploading(true)

    const { data: { session } } = await supabase.auth.getSession()
    const { data: { user } } = await supabase.auth.getUser()

    if (!session || !user) {
      alert('You must be logged in to upload notes.')
      setUploading(false)
      return
    }

    // Upload file + metadata in one request through Flask (Flask uploads to S3 server-side)
    const body = new FormData()
    body.append('file', file)
    body.append('user_id', user.id)
    body.append('title', formData.title)
    body.append('subject', formData.subject)
    body.append('module_code', formData.module_code)
    body.append('description', formData.description)

    const metaRes = await fetch(`${FLASK_URL}/upload-notes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'x-refresh-token': session.refresh_token ?? '',
      },
      body,
    })

    if (!metaRes.ok) { alert('Upload failed.'); setUploading(false); return }

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white">
            <GraduationCap className="h-10 w-10" />
            <span className="text-3xl font-bold">UpGrade</span>
          </Link>
          <p className="text-indigo-200 mt-2">Share your study notes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. IS112 Data Management Cheat Sheet"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">School</label>
              <div className="relative">
                <School className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {SMU_SCHOOLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Module Code</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.module_code}
                  onChange={(e) => setFormData({ ...formData, module_code: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g. IS112"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder="What's covered in these notes?"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">PDF File</label>
              <input
                type="file"
                accept="application/pdf"
                required
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 file:font-medium hover:file:bg-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Notes'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Want to go back?{' '}
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
