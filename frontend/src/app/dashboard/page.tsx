'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Calendar, BookOpen, Users, DollarSign, Star, Clock, MessageCircle, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'earnings' | 'reviews'>('overview')
  
  // Mock user data
  const user = {
    name: 'Dr. Sarah Chen',
    type: 'tutor',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    totalSessions: 127,
    totalEarnings: 5680,
    activeStudents: 23
  }

  const upcomingSessions = [
    {
      id: 1,
      student: 'Alex Johnson',
      subject: 'Calculus',
      date: '2024-01-20',
      time: '14:00',
      duration: 60,
      type: 'Online'
    },
    {
      id: 2,
      student: 'Emma Wilson',
      subject: 'Linear Algebra',
      date: '2024-01-20',
      time: '16:00',
      duration: 90,
      type: 'In-person'
    },
    {
      id: 3,
      student: 'Michael Brown',
      subject: 'Quantum Physics',
      date: '2024-01-21',
      time: '10:00',
      duration: 60,
      type: 'Online'
    }
  ]

  const recentReviews = [
    {
      id: 1,
      student: 'Alex Johnson',
      rating: 5,
      comment: 'Excellent tutor! Very patient and explains concepts clearly.',
      date: '2024-01-15',
      subject: 'Calculus'
    },
    {
      id: 2,
      student: 'Emma Wilson',
      rating: 5,
      comment: 'Dr. Chen helped me understand linear algebra concepts that I struggled with for weeks.',
      date: '2024-01-12',
      subject: 'Linear Algebra'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{user.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Students</p>
                <p className="text-2xl font-bold text-gray-900">{user.activeStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">£{user.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{user.rating}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'sessions', label: 'Sessions', icon: Calendar },
                { id: 'earnings', label: 'Earnings', icon: DollarSign },
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
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Upcoming Sessions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{session.student}</div>
                            <div className="text-sm text-gray-600">{session.subject} • {session.duration} min</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{session.time}</div>
                          <div className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">New message from Alex Johnson</span>
                      <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Star className="h-5 w-5 text-yellow-600" />
                      <span className="text-gray-700">Emma Wilson left a 5-star review</span>
                      <span className="text-sm text-gray-500 ml-auto">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">Session completed with Michael Brown</span>
                      <span className="text-sm text-gray-500 ml-auto">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'sessions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">All Sessions</h3>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    <option>All Sessions</option>
                    <option>Upcoming</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium text-gray-900">{session.student}</div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">{session.type}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(session.date).toLocaleDateString()} at {session.time}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {session.subject} • {session.duration} minutes
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                            Reschedule
                          </button>
                          <button className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">
                            Join Session
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-gray-900 mb-1">£1,240</div>
                    <div className="text-gray-600">This Month</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-gray-900 mb-1">£3,680</div>
                    <div className="text-gray-600">Last 3 Months</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-2xl font-bold text-gray-900 mb-1">£45</div>
                    <div className="text-gray-600">Average per Hour</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Recent Payments</h4>
                  <div className="space-y-3">
                    {[
                      { date: '2024-01-15', amount: 90, student: 'Alex Johnson', subject: 'Calculus' },
                      { date: '2024-01-14', amount: 135, student: 'Emma Wilson', subject: 'Linear Algebra' },
                      { date: '2024-01-12', amount: 60, student: 'Michael Brown', subject: 'Physics' }
                    ].map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{payment.student}</div>
                          <div className="text-sm text-gray-600">{payment.subject}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">£{payment.amount}</div>
                          <div className="text-sm text-gray-600">{new Date(payment.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Student Reviews</h3>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{user.rating}</span>
                    <span className="text-gray-500">({recentReviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-medium text-gray-900">{review.student}</div>
                          <div className="text-sm text-gray-600">{review.subject}</div>
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
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
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
