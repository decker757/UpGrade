'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Star, MapPin, Clock, BookOpen, MessageCircle, Heart } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

const TutorProfiles = () => {
  const [tutors, setTutors] = useState<any[]>([])

  useEffect(() => {
    const fetchTutors = async () => {
      const { data, error } = await supabase
        .from('USERS')
        .select('id, firstname, lastname, school, aboutme, photourl')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Failed to fetch tutors:', error)
      } else {
        setTutors(data)
      }
    }

    fetchTutors()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Tutors</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>View:</span>
          <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded">Grid</button>
          <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">List</button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
              <Image
                src={tutor.photourl}
                alt={tutor.name}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors">
                <Heart className="h-4 w-4 text-gray-600" />
              </button>
              {tutor.verified && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Verified
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{tutor.firstname} {tutor.lastname}</h3>
                  <p className="text-sm text-gray-600">{tutor.school}</p>
                </div>
                <div className="text-right">
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{tutor.rating}</span>
                  <span>(4.0)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>69 minutes</span>
                </div>
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
      
      {/* Load More */}
      <div className="text-center pt-8">
        <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          Load More Tutors
        </button>
      </div>
    </div>
  )
}

export default TutorProfiles
