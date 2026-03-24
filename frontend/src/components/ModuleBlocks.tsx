'use client'
import React, { useState, useEffect } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, MessageCircle, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL ?? 'http://localhost:5001'

const ModulesProfiles = () => {
  const [listings, setListings] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(6)
  const [typeFilter, setTypeFilter] = useState<'all' | 'tutor' | 'tutee'>('all')

  const loadMore = () => {
    setVisibleCount((prev) => prev + 6)
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const url = user
        ? `${FLASK_URL}/listings?viewer_id=${user.id}`
        : `${FLASK_URL}/listings`
      const res = await fetch(url)
      const data = await res.json()
      setListings(data)
    }
    fetchData()
  }, [])

  const filtered = typeFilter === 'all' ? listings : listings.filter(m => m.type === typeFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Listings
          <span className="ml-3 text-base font-normal text-gray-500">({filtered.length} results)</span>
        </h2>
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          {(['all', 'tutor', 'tutee'] as const).map((type) => (
            <button
              key={type}
              onClick={() => { setTypeFilter(type); setVisibleCount(6) }}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
                typeFilter === type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {type === 'all' ? 'All' : type === 'tutor' ? 'Tutors' : 'Tutees'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, visibleCount).map((module) => (
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
              <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium text-white ${
                module.type === 'tutor' ? 'bg-indigo-600' : 'bg-orange-500'
              }`}>
                {module.type === 'tutor' ? 'Tutor' : 'Tutee'}
              </div>
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
                  <span className="font-medium">{module.users?.rating ?? '—'}</span>
                  <span>({module.users?.reviews ?? 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{module.location}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{module.description}</p>
              
              
              <div className="flex space-x-2">
                {module.type === 'tutor' && (
                  <Link
                    href={`/tutors/${module.id}`}
                    className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    View Profile
                  </Link>
                )}
                {module.type === 'tutee' && (
                  <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                    Contact Tutee
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More */}
      
      {visibleCount < filtered.length && (
        <div className="text-center pt-8">
        <button onClick={loadMore}
        className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          Load More Listings
        </button>
      </div>)}
    </div>
  )
}

export default ModulesProfiles