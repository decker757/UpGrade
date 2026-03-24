'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import TutorSearch from '@/components/TutorSearch'
import TutorProfiles from '@/components/TutorProfiles'
import Footer from '@/components/Footer'
import { Users } from 'lucide-react'
import { useRequireAuth } from '@/lib/useRequireAuth'

export type TutorFilters = {
  school: string
  priceRange: string
  rating: string
  location: string
}

export default function TutorsPage() {
  useRequireAuth()
  const [filters, setFilters] = useState<TutorFilters>({
    school: '',
    priceRange: '',
    rating: '',
    location: '',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-indigo-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Expert Tutors</h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Connect with qualified university tutors who can help you excel in your studies
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <TutorSearch filters={filters} setFilters={setFilters} />
        <TutorProfiles filters={filters} />
      </main>

      <Footer />
    </div>
  )
}
