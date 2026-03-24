import React, { useState } from 'react'
import { Search, Filter, MapPin, DollarSign, Star, Clock } from 'lucide-react'

const TutorSearch = () => {
  const [filters, setFilters] = useState({
    subject: '',
    priceRange: '',
    rating: '',
    availability: '',
    location: ''
  })

  const schools = [
    'Integrative Studies', 'Graduate Research Studies', 'Accountancy', 
    'Economics', 'Computing & Information Systems', 'Law', 'Social Sciences', 'Business'
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Find Your Perfect Tutor</h2>
        <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Schools</option>
            {schools.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
          <select
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any Price</option>
            <option value="0-25">$0 - $25/hour</option>
            <option value="25-50">$25 - $50/hour</option>
            <option value="50-75">$50 - $75/hour</option>
            <option value="75+">$75+/hour</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <select
            value={filters.rating}
            onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any Rating</option>
            <option value="4.5+">4.5+ Stars</option>
            <option value="4.0+">4.0+ Stars</option>
            <option value="3.5+">3.5+ Stars</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
          <select
            value={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Any Time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="City or Online"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Showing 127 tutors matching your criteria
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500">
            <option>Best Match</option>
            <option>Highest Rated</option>
            <option>Lowest Price</option>
            <option>Most Reviews</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default TutorSearch
