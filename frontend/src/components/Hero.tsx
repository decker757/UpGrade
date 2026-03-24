import React from 'react'
import { Search, BookOpen, Users } from 'lucide-react'

interface HeroProps {
  activeTab: 'tutors' | 'notes'
  setActiveTab: (tab: 'tutors' | 'notes') => void
}

const Hero = ({ activeTab, setActiveTab }: HeroProps) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Excel in Your Studies with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Expert Tutors & Notes
            </span>
          </h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Connect with qualified university tutors and access comprehensive study materials 
            to boost your academic performance and achieve your goals.
          </p>
          
          {/* Tab Selector */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-1 flex">
              <button
                onClick={() => setActiveTab('tutors')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'tutors'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Listings</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'notes'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <BookOpen className="h-5 w-5" />
                <span>Study Notes</span>
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={
                  activeTab === 'tutors' 
                    ? "Search for tutors by subject, university, or name..." 
                    : "Search for notes by subject, module, or topic..."
                }
                className="w-full pl-12 pr-4 py-4 text-gray-900 bg-white rounded-2xl shadow-lg focus:ring-4 focus:ring-white/25 focus:outline-none text-lg"
              />
              <button className="absolute right-2 top-2 bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                Search
              </button>
            </div>
          </div>
      
        </div>
      </div>
    </div>
  )
}

export default Hero
