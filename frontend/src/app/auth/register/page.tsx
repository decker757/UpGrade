'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    highestEducation: '',
    aboutMe: '',
    userType: 'Tutor',
    photourl: '',
    agreeToTerms: true
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    const { email, password, firstName, lastName, userType } = formData

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(`❌ ${error.message}`)
    } else {
      const userId = data.user?.id

      // Optional: insert into custom `profiles` table
      if (userId) {
        await supabase.from('USERS').insert([
        {
          id: userId,
          firstname: firstName,
          lastname: lastName,
          school: formData.highestEducation,
          aboutme: formData.aboutMe,
          photourl: formData.photourl,
          usertype: formData.userType,
        }
        ])
      }

      alert("✅ Account created!")
      router.push('/auth/login')
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-800 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white">
            <GraduationCap className="h-10 w-10" />
            <span className="text-3xl font-bold">UpGrade</span>
          </Link>
          <p className="text-indigo-200 mt-2">Create your account</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="Ernest"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="Tan"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="ernesttan@smu.edu.sg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="highestEducation" className="block text-sm font-bold text-gray-700 mb-2">
                Highest Education
              </label>
              <input
                id="highestEducation"
                type="text"
                required
                value={formData.highestEducation}
                onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold"
                placeholder="e.g. Bachelor of Science in Mathematics"
              />
            </div>

            <div>
              <label htmlFor="aboutMe" className="block text-sm font-bold text-gray-700 mb-2">
                About Me
              </label>
              <textarea
                id="aboutMe"
                rows={4}
                required
                value={formData.aboutMe}
                onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:font-semibold resize-none"
                placeholder="Briefly describe yourself and your experience..."
              />
            </div>

            <div>
              <label htmlFor="photourl" className="block text-sm font-bold text-gray-700 mb-2">
                Photo URL
              </label>
              <div className="relative">
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

            <button
              type="submit"
              disabled={!formData.agreeToTerms}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
