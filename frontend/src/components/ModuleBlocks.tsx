'use client'
import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { Star, MapPin, Clock, BookOpen, MessageCircle, Heart } from 'lucide-react'


const ModulesProfiles = () => {
  const [listings, setListings] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(6)

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6) // show 6 more each time
  }

  useEffect(() => {
  const fetchData = async () => {
    const [tutorRes, tuteeRes] = await Promise.all([
      supabase
        .from('TUTOR_LISTING')
        .select(`
          *,
          users:tutorid (
            school
          )
        `)
        .order('created_at', { ascending: false }),

      supabase
        .from('TUTEE_LISTING')
        .select(`
          *,
          users:tuteeid (
            school
          )
        `)
        .order('created_at', { ascending: false })
    ])

    const tutorData = tutorRes.data?.map((item) => ({
      ...item,
      id: item.tutorid, // Ensure this is the correct field for tutor unique ID
      type: 'tutor'
    })) ?? []

    const tuteeData = tuteeRes.data?.map((item) => ({
      ...item,
      id: item.tuteeid, // Ensure this is the correct field for tutee unique ID
      type: 'tutee'
    })) ?? []

    const combined = [...tutorData, ...tuteeData].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    setListings(combined)
  }

  fetchData()
}, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Listings</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>View:</span>
          <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded">Grid</button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.slice(0, visibleCount).map((module) => (
        // {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
              <Image
                src={module.photourl}
                alt={module.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
              {module.verified && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Verified
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{module.title}</h3>
                  <p className="text-indigo-600 font-medium">{module.course_code}</p>
                  <p className="text-sm text-gray-600">{module.users?.school ?? 'SMU'}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">${module.rate}</div>
                  <div className="text-sm text-gray-600">per hour</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium"></span>
                  <span>(4.0)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{module.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>69 minutes</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{module.description}</p>
              
              
              <div className="flex space-x-2">
                <Link
                  href={`/tutors/${module.id}`}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  View Profile
                </Link>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More */}
      
      {visibleCount < listings.length && (
        <div className="text-center pt-8">
        <button onClick={loadMore}
        className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          Load More Tutors
        </button>
      </div>)}
    </div>
  )
}

export default ModulesProfiles