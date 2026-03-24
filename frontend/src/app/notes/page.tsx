'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import NotesSection from '@/components/NotesSection'
import Footer from '@/components/Footer'
import { BookOpen, TrendingUp, Award, Users } from 'lucide-react'

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-purple-200" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">University Study Notes</h1>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Access comprehensive study materials created by top students and expert tutors
            </p>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-white py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">10,000+</div>
              <div className="text-gray-600">Study Notes</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">50+</div>
              <div className="text-gray-600">University Modules</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">25,000+</div>
              <div className="text-gray-600">Downloads</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-indigo-600">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Featured Categories */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Categories</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'SCIS', count: 2341, color: 'bg-blue-500' },
              { name: 'SOB', count: 1876, color: 'bg-green-500' },
              { name: 'SOA', count: 1543, color: 'bg-purple-500' },
              { name: 'SOE', count: 1234, color: 'bg-red-500' },
              { name: 'SOL', count: 987, color: 'bg-yellow-500' }
            ].map((category) => (
              <div key={category.name} className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.count.toLocaleString()} notes</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <NotesSection />
      </main>
      
      <Footer />
    </div>
  )
}
