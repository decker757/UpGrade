'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap,
  BookOpen,
  School,
  DollarSign,
  MapPin,
  Text,
  Image as ImageIcon,
  User
} from 'lucide-react'

import { supabase } from '@/lib/supabaseClient'

export default function CreateListingPage() {
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    userType: 'Tutor',
    title: '',
    course_code: '',
    description: '',
    rate: '',
    location: '',
    photourl: '',
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (submitting) return;
  setSubmitting(true);
  const { data: { session } } = await supabase.auth.getSession()
  const accessToken = session?.access_token
  const refreshToken = session?.refresh_token;
  // 1. Get Supabase user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    alert("❌ You must be logged in to create a listing.");
    return;
  }

  // 2. Fetch school from USERS table
  const { data: profile, error: profileError } = await supabase
    .from("USERS")
    .select("school")
    .eq("id", user.id)
    .single();

  if (profileError) {
    alert("❌ Failed to get profile info.");
    return;
  }

  // 3. Prepare payload
  const payload = {
    user_id: user.id, // this is your supabase user ID
    title: formData.title,
    course_code: formData.course_code,
    rate: formData.rate,
    description: formData.description,
    location: formData.location,
    photourl: formData.photourl,
    userType: formData.userType
  };

  // 4. Send to Flask
  const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL ?? 'http://localhost:5001'
  const response = await fetch(`${FLASK_URL}/create_listing`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,  
      "x-refresh-token": refreshToken
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  if (response.ok) {
    router.push('/');
  } else {
    alert(`❌ ${result.error || "Failed to create listing"}`);
    setSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white">
            <GraduationCap className="h-10 w-10" />
            <span className="text-3xl font-bold">UpGrade</span>
          </Link>
          <p className="text-indigo-200 mt-2">Create a new tutor listing</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">I am a</label>
              <div className="flex space-x-6">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="Tutor"
                    checked={formData.userType === 'Tutor'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-medium">Tutor</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    value="Tutee"
                    checked={formData.userType === 'Tutee'}
                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-medium">Tutee</span>
                </label>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
                Title
              </label>
              <div className="relative">
                <Text className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="e.g. Experienced Math Tutor"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="course_code" className="block text-sm font-bold text-gray-700 mb-2">
                Course Code
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="course_code"
                  type="text"
                  required
                  value={formData.course_code}
                  onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="e.g. IS1704"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <School className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="description"
                  type="text"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="e.g. I am a god at coding, I don't need LLMs, LLMs need me."
                />
              </div>
            </div>

            {/* Hourly Rate */}
            <div>
              <label htmlFor="rate" className="block text-sm font-bold text-gray-700 mb-2">
                Hourly Rate ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="rate"
                  type="number"
                  required
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="e.g. 40"
                  min="0"
                  step="1"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="e.g. Singapore"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label htmlFor="photourl" className="block text-sm font-bold text-gray-700 mb-2">
                Photo URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="photourl"
                  type="url"
                  value={formData.photourl}
                  onChange={(e) => setFormData({ ...formData, photourl: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Listing'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Want to go back?{' '}
            <Link href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
