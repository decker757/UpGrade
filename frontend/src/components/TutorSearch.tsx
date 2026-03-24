import React from 'react'
import { Filter, MapPin } from 'lucide-react'
import { TutorFilters } from '@/app/tutors/page'

// Keywords that match the school values stored in the DB (e.g. "Bachelor of Accountancy")
const schools = [
  { label: 'Accountancy', keyword: 'Accountancy' },
  { label: 'Business Management', keyword: 'Business Management' },
  { label: 'Computer Science', keyword: 'Computer Science' },
  { label: 'Information Systems', keyword: 'Information Systems' },
  { label: 'Economics', keyword: 'Economics' },
  { label: 'Law', keyword: 'Laws' },
  { label: 'Social Science', keyword: 'Social Science' },
]

type Props = {
  filters: TutorFilters
  setFilters: (f: TutorFilters) => void
}

const TutorSearch = ({ filters, setFilters }: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Find Your Perfect Tutor</h2>
        <button className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700">
          <Filter className="h-4 w-4" />
          <span>Advanced Filters</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
          <select
            value={filters.school}
            onChange={(e) => setFilters({ ...filters, school: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Schools</option>
            {schools.map((s) => (
              <option key={s.keyword} value={s.keyword}>{s.label}</option>
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
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
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
    </div>
  )
}

export default TutorSearch
