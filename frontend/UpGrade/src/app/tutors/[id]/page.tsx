'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import { supabase } from '@/lib/supabaseClient'

// ICONS (you must install lucide-react or adjust accordingly)
import { ArrowLeft, Star, MapPin, Clock, Heart, Share2, BookOpen, Calendar, Award, CheckCircle } from 'lucide-react'

// YOUR OWN COMPONENTS (adjust import paths based on your project structure)
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TutorProfilePage({ params }: { params: { id: string } }) {
  const [tutor, setTutor] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const [reviews, setReviews] = useState<any[]>([])
  const [uniqueSubjects, setUniqueSubjects] = useState<string[]>([])
  
  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('REVIEWS')
      .select(`
        id, rating, comment, subject, created_at,
        student:student_id ( firstname, lastname )
      `)
      .eq('tutor_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Failed to fetch reviews:', error)
    } else {
      setReviews(data)
    }
  }

  const [tutorListings, setTutorListings] = useState<any[]>([])

  const fetchTutorListings = async () => {
    const { data, error } = await supabase
      .from('TUTOR_LISTING')
      .select('*')
      .eq('user_id', params.id)

    if (error) {
      console.error('❌ Failed to fetch tutor listings:', error)
    } else {
      setTutorListings(data)

      // ✅ Compute unique subjects after data is fetched
      const subjects = Array.from(
        new Set(data.map((listing) => listing.course_code || listing.subject))
      )
      setUniqueSubjects(subjects)
    }
  }

  type TabType = 'about' | 'reviews' | 'availability'
  const [activeTab, setActiveTab] = useState<TabType>('about')

  const router = useRouter()

  useEffect(() => {
    const fetchTutor = async () => {
      const { data, error } = await supabase
        .from('USERS') // your actual Supabase table
        .select('*')   // or specify fields
        .eq('id', params.id)
        .single()

      if (error || !data) {
        console.error('Failed to fetch tutor:', error)
        router.push('/tutors') // optional fallback
      } else {
        setTutor(data)
      }

      setLoading(false)
    }

    if (params.id) {
      fetchTutor()
      fetchTutorListings()
      fetchReviews()
    }
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
          <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-600">
            <Image
              src=''
              alt="Cover"
              fill
              className="object-cover opacity-30"
            />
          </div>
          
          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end md:space-x-6 -mt-16">
              <div className="relative">
                <Image
                  src={tutor.photourl}
                  alt={tutor.name}
                  width={128}
                  height={128}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                {tutor.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{tutor.name}</h1>
                    <p className="text-lg text-indigo-600 mb-2">{tutor.subject}</p>
                    <p className="text-gray-600 mb-4">{tutor.university}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{tutor.rating}</span>
                        <span> ({tutor.reviews ? `${tutor.reviews} reviews` : 'No reviews yet'})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{tutor.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Responds {tutor.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-4 md:mt-0">
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
                  <p className="text-gray-700 leading-relaxed">{tutor.description}</p>
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

                  const { data: user } = await supabase.auth.getUser()
                  const student_id = user.user?.id

                  const { error: insertError } = await supabase.from('REVIEWS').insert({
                    tutor_id: params.id,
                    student_id,
                    rating: parseInt(formData.get('rating') as string),
                    comment: formData.get('comment'),
                    subject: formData.get('subject'),
                  })

                  if (insertError) {
                    alert('❌ Failed to submit review.')
                    return
                  }

                  // Recalculate average rating
                  const { data: allReviews, error: fetchError } = await supabase
                    .from('REVIEWS')
                    .select('rating')
                    .eq('tutor_id', params.id)

                  if (fetchError || !allReviews) {
                    console.error('Failed to fetch reviews for average calculation.')
                    return
                  }

                  const count = allReviews.length
                  const total = allReviews.reduce((sum, r) => sum + r.rating, 0)
                  const average = parseFloat((total / count).toFixed(2))

                  // Update USERS table with new average and count
                  const { error: updateError } = await supabase
                    .from('USERS')
                    .update({ rating: average, reviews: count })
                    .eq('id', params.id)

                  if (updateError) {
                    console.error('⚠️ Failed to update tutor average rating:', updateError)
                  }

                  form.reset()
                  fetchReviews() // refresh review tab if you're showing it
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
                        <div className="text-2xl font-bold text-gray-900">{tutor.hourlyRate}</div>
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
