'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Star, Download, Eye, Calendar, User, BookOpen, ArrowLeft, Heart, Share2, FileText, Award } from 'lucide-react'
import Link from 'next/link'

export default function NoteDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'reviews'>('preview')
  
  // Mock data - in real app, fetch based on params.id
  const note = {
    id: 1,
    title: 'Advanced Calculus - Integration Techniques',
    subject: 'Mathematics',
    module: 'MATH301',
    university: 'Cambridge University',
    author: 'Dr. Sarah Chen',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    downloads: 1247,
    views: 3421,
    pages: 45,
    uploadDate: '2024-01-15',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop',
    description: 'Comprehensive notes covering integration by parts, substitution, and advanced techniques. These notes include detailed explanations, worked examples, and practice problems to help students master integration techniques.',
    tags: ['Calculus', 'Integration', 'Advanced Mathematics', 'Problem Solving'],
    isPremium: false,
    price: 0,
    tableOfContents: [
      'Introduction to Integration Techniques',
      'Integration by Parts',
      'Trigonometric Substitution',
      'Partial Fractions',
      'Improper Integrals',
      'Applications of Integration',
      'Practice Problems',
      'Solutions and Explanations'
    ],
    features: [
      'Step-by-step solutions',
      'Visual diagrams and graphs',
      'Practice exercises with answers',
      'Exam-style questions',
      'Quick reference formulas'
    ]
  }

  const reviews = [
    {
      id: 1,
      student: 'Alex Johnson',
      rating: 5,
      date: '2024-01-10',
      comment: 'Excellent notes! Very comprehensive and well-organized. The step-by-step examples really helped me understand integration techniques.',
      helpful: 23
    },
    {
      id: 2,
      student: 'Emma Wilson',
      rating: 5,
      date: '2024-01-08',
      comment: 'These notes saved my calculus grade! Clear explanations and great practice problems. Highly recommend.',
      helpful: 18
    },
    {
      id: 3,
      student: 'Michael Brown',
      rating: 4,
      date: '2024-01-05',
      comment: 'Good quality notes with detailed explanations. Would have liked more practice problems but overall very helpful.',
      helpful: 12
    }
  ]

  const relatedNotes = [
    {
      id: 2,
      title: 'Differential Calculus Fundamentals',
      author: 'Dr. Sarah Chen',
      rating: 4.8,
      downloads: 892,
      thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=200&h=150&fit=crop'
    },
    {
      id: 3,
      title: 'Multivariable Calculus Guide',
      author: 'Prof. Michael Johnson',
      rating: 4.7,
      downloads: 654,
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=200&h=150&fit=crop'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/notes" className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </Link>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Note Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={note.thumbnail}
                  alt={note.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 bg-indigo-600 rounded text-sm font-medium">{note.subject}</span>
                    <span className="px-2 py-1 bg-black/50 rounded text-sm">{note.pages} pages</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">{note.title}</h1>
                  <p className="text-indigo-200">{note.module} • {note.university}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={note.authorAvatar}
                      alt={note.author}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{note.author}</div>
                      <div className="text-sm text-gray-600">Professor</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-gray-400 hover:text-red-500 border border-gray-300 rounded-lg transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-indigo-600 border border-gray-300 rounded-lg transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{note.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>{note.downloads.toLocaleString()} downloads</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{note.views.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {new Date(note.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{note.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Content Tabs */}
            <div className="bg-white rounded-2xl shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'preview', label: 'Preview', icon: Eye },
                    { id: 'details', label: 'Details', icon: FileText },
                    { id: 'reviews', label: 'Reviews', icon: Star }
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
              
              <div className="p-6">
                {activeTab === 'preview' && (
                  <div className="space-y-6">
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Note Preview</h3>
                      <p className="text-gray-600 mb-4">
                        Preview the first few pages of this study note to see the content quality and format.
                      </p>
                      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        View Preview
                      </button>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Table of Contents</h4>
                      <div className="space-y-2">
                        {note.tableOfContents.map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                            <span className="text-gray-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">What's Included</h4>
                      <div className="space-y-2">
                        {note.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Award className="h-5 w-5 text-green-500" />
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Note Information</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-600">Subject:</span>
                            <div className="font-medium">{note.subject}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Module:</span>
                            <div className="font-medium">{note.module}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">University:</span>
                            <div className="font-medium">{note.university}</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm text-gray-600">Pages:</span>
                            <div className="font-medium">{note.pages}</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Format:</span>
                            <div className="font-medium">PDF</div>
                          </div>
                          <div>
                            <span className="text-sm text-gray-600">Language:</span>
                            <div className="font-medium">English</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Student Reviews</h4>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="font-medium">{note.rating}</span>
                        <span className="text-gray-500">({reviews.length} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{review.student}</div>
                              <div className="flex items-center space-x-2 mt-1">
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
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{review.comment}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <button className="hover:text-indigo-600">Helpful ({review.helpful})</button>
                            <button className="hover:text-indigo-600">Reply</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {note.isPremium ? `£${note.price}` : 'Free'}
                </div>
                <div className="text-gray-600">
                  {note.isPremium ? 'One-time purchase' : 'Free download'}
                </div>
              </div>
              
              <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>{note.isPremium ? 'Purchase & Download' : 'Download Free'}</span>
                </div>
              </button>
              
              <div className="text-center text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-4">
                  <span>✓ Instant download</span>
                  <span>✓ PDF format</span>
                </div>
              </div>
            </div>
            
            {/* Related Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Related Notes</h3>
              <div className="space-y-4">
                {relatedNotes.map((relatedNote) => (
                  <Link
                    key={relatedNote.id}
                    href={`/notes/${relatedNote.id}`}
                    className="flex space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Image
                      src={relatedNote.thumbnail}
                      alt={relatedNote.title}
                      width={60}
                      height={45}
                      className="rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                        {relatedNote.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-1">{relatedNote.author}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{relatedNote.rating}</span>
                        <span>•</span>
                        <span>{relatedNote.downloads} downloads</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
