'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MessageCircle, Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { TutorFilters } from '@/app/tutors/page'

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL ?? 'http://localhost:5001'

type Props = {
  filters: TutorFilters
}

const TutorProfiles = ({ filters }: Props) => {
  const [tutors, setTutors] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    const fetchTutors = async () => {
      const res = await fetch(`${FLASK_URL}/tutors`)
      const data = await res.json()
      setTutors(data)
    }
    fetchTutors()
  }, [])

  const filtered = tutors.filter((tutor) => {
    if (filters.school && !tutor.school?.toLowerCase().includes(filters.school.toLowerCase()))
      return false

    if (filters.rating && (tutor.rating ?? 0) < parseFloat(filters.rating))
      return false

    if (filters.location && !tutor.location?.toLowerCase().includes(filters.location.toLowerCase()))
      return false

    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Tutors
          <span className="ml-3 text-base font-normal text-gray-500">({filtered.length} results)</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.slice(0, visibleCount).map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={tutor.photourl || `https://ui-avatars.com/api/?name=${tutor.firstname}+${tutor.lastname}&background=6366f1&color=fff&size=400`}
                alt={`${tutor.firstname} ${tutor.lastname}`}
                className="w-full h-48 object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${tutor.firstname}+${tutor.lastname}&background=6366f1&color=fff&size=400` }}
              />
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-3">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{tutor.firstname} {tutor.lastname}</h3>
                <p className="text-sm text-gray-600">{tutor.school}</p>
              </div>

              <div className="flex items-center space-x-1 mb-4 text-sm text-gray-600">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="font-medium">{tutor.rating ?? '—'}</span>
                <span>({tutor.reviews ?? 0} reviews)</span>
              </div>

              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{tutor.aboutme}</p>

              <div className="flex space-x-2">
                <Link
                  href={`/tutors/${tutor.id}`}
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

      {visibleCount < filtered.length && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Load More Tutors
          </button>
        </div>
      )}
    </div>
  )
}

export default TutorProfiles
