'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { supabase } from '@/lib/supabaseClient'
import { ArrowLeft, Star, Heart, Share2, BookOpen, Calendar, Award } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const FLASK_URL = process.env.NEXT_PUBLIC_FLASK_URL ?? 'http://localhost:5001'

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [tutor, setTutor] = useState<any | null>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [listings, setListings] = useState<any[]>([])
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  type TabType = 'about' | 'reviews' | 'availability'
  const [activeTab, setActiveTab] = useState<TabType>('about')

  const router = useRouter()

  const fetchTutorData = async () => {
    const res = await fetch(`${FLASK_URL}/tutor/${params.id}`)
    if (!res.ok) {
      router.push('/tutors')
      return
    }
    const data = await res.json()
    setTutor(data.profile)
    setReviews(data.reviews)
    setListings(data.listings)
    setUniqueSubjects([...new Set<string>(data.listings.map((l: any) => l.course_code))])
    setLoading(false)
  }

  useEffect(() => {
    if (params.id) fetchTutorData()
  }, [params.id])

  if (loading) return <p>Loading...</p>
  if (!tutor) return <p>No tutor found</p>


  // Render tutor profile
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/tutors" className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tutors</span>
        </Link>
        
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600" />

          <div className="px-8 pb-8">
            {/* Avatar — overlaps the banner */}
            <div className="-mt-16 mb-4">
              <Image
                src={tutor.photourl}
                alt={`${tutor.firstname} ${tutor.lastname}`}
                width={128}
                height={128}
                className="rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* Name, school, rating, actions — all below the banner */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {tutor.firstname} {tutor.lastname}
                </h1>
                <p className="text-gray-600 mb-3">{tutor.school}</p>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{tutor.rating ?? '—'}</span>
                  <span>({tutor.reviews ? `${tutor.reviews} reviews` : 'No reviews yet'})</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-indigo-600 border border-gray-300 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
        
        
        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'about', label: 'About', icon: BookOpen },
                { id: 'reviews', label: 'Reviews', icon: Star },
                { id: 'availability', label: 'Availability', icon: Calendar }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
          
          <div className="p-8">
            {activeTab === 'about' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">About Me</h3>
                  <p className="text-gray-700 leading-relaxed">{tutor.aboutme}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="font-medium text-gray-900">{tutor.school}</div>
                      <div className="text-sm text-gray-600">Highest Education</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Student Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{tutor.rating}</span>
                    <span className="text-gray-500">({tutor.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">
                            {review.student?.firstname ?? 'Anonymous'} {review.student?.lastname ?? ''}
                          </div>
                          <div className="text-sm text-gray-500">{review.subject}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.target as HTMLFormElement
                  const formData = new FormData(form)

                  const { data: { session } } = await supabase.auth.getSession()
                  const { data: { user } } = await supabase.auth.getUser()

                  const res = await fetch(`${FLASK_URL}/reviews`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${session?.access_token}`,
                      'x-refresh-token': session?.refresh_token ?? '',
                    },
                    body: JSON.stringify({
                      tutor_id: params.id,
                      student_id: user?.id,
                      rating: parseInt(formData.get('rating') as string),
                      comment: formData.get('comment'),
                      subject: formData.get('subject'),
                    })
                  })

                  if (!res.ok) {
                    alert('Failed to submit review.')
                    return
                  }

                  form.reset()
                  fetchTutorData()
                }}
                className="mt-8 space-y-4"
              >
                {/* your inputs... */}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                  <input
                    name="rating"
                    type="number"
                    min={1}
                    max={5}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <input
                    name="subject"
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Comment</label>
                  <textarea
                    name="comment"
                    rows={4}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Submit Review
                </button>
              </form>
              </div>
            )}
            
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Book a Session</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Available Time Slots</h4>
                    <div className="space-y-2">
                      {['Today 2:00 PM - 3:00 PM', 'Today 4:00 PM - 5:00 PM', 'Tomorrow 10:00 AM - 11:00 AM', 'Tomorrow 2:00 PM - 3:00 PM'].map((slot) => (
                        <button
                          key={slot}
                          className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Session Details</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Hourly Rate</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {listings.length > 0 ? `$${listings[0].rate}/hr` : '—'}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Subject Focus</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                          {uniqueSubjects.length > 0 ? (
                            uniqueSubjects.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))
                          ) : (
                            <option disabled>No subjects found</option>
                          )}
                        </select>
                      </div>
                      <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                        Book Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
