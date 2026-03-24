'use client'

import { useState } from 'react'

export default function uploadNotes() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
  if (!file) return

  const res = await fetch(`http://localhost:5001/get-s3-url?filename=${file.name}&contentType=${file.type}`)
  const { url } = await res.json()

  const uploadRes = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })

  if (uploadRes.ok) alert('✅ Uploaded')
  else alert('❌ Upload failed')
}

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Upload File</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
      >
        {uploading ? 'Uploading...' : 'Upload to AWS S3'}
      </button>
    </div>
  )
}