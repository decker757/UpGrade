import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Download, Eye, Calendar, User, BookOpen, Filter, Search } from 'lucide-react'

const NotesSection = () => {
  const [filters, setFilters] = useState({
    subject: '',
    university: '',
    level: '',
    type: ''
  })

  const notes = [
    {
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
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
      description: 'Comprehensive notes covering integration by parts, substitution, and advanced techniques.',
      tags: ['Calculus', 'Integration', 'Advanced Mathematics'],
      isPremium: false,
      price: 0
    },
    {
      id: 2,
      title: 'Quantum Mechanics Fundamentals',
      subject: 'Physics',
      module: 'PHYS401',
      university: 'Oxford University',
      author: 'Prof. Michael Johnson',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      downloads: 892,
      views: 2156,
      pages: 67,
      uploadDate: '2024-01-12',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
      description: 'Complete guide to quantum mechanics principles, wave functions, and applications.',
      tags: ['Quantum Physics', 'Wave Functions', 'Theoretical Physics'],
      isPremium: true,
      price: 15
    },
    {
      id: 3,
      title: 'Organic Chemistry Reactions',
      subject: 'Chemistry',
      module: 'CHEM201',
      university: 'Imperial College London',
      author: 'Dr. Emily Rodriguez',
      authorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
      rating: 4.9,
      downloads: 1543,
      views: 4287,
      pages: 38,
      uploadDate: '2024-01-10',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop',
      description: 'Detailed study of organic reactions, mechanisms, and synthesis pathways.',
      tags: ['Organic Chemistry', 'Reactions', 'Synthesis'],
      isPremium: false,
      price: 0
    },
    {
      id: 4,
      title: 'Data Structures and Algorithms',
      subject: 'Computer Science',
      module: 'CS201',
      university: 'Cambridge University',
      author: 'Alex Kumar',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      rating: 4.7,
      downloads: 2341,
      views: 5672,
      pages: 89,
      uploadDate: '2024-01-08',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      description: 'Comprehensive guide to fundamental data structures and algorithmic thinking.',
      tags: ['Algorithms', 'Data Structures', 'Programming'],
      isPremium: true,
      price: 20
    },
    {
      id: 5,
      title: 'Microeconomics Theory',
      subject: 'Economics',
      module: 'ECON101',
      university: 'London School of Economics',
      author: 'James Wilson',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 4.6,
      downloads: 987,
      views: 2843,
      pages: 52,
      uploadDate: '2024-01-05',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
      description: 'Essential microeconomic principles, market structures, and consumer theory.',
      tags: ['Microeconomics', 'Market Theory', 'Consumer Behavior'],
      isPremium: false,
      price: 0
    },
    {
      id: 6,
      title: 'Cognitive Psychology Research Methods',
      subject: 'Psychology',
      module: 'PSYC301',
      university: 'University College London',
      author: 'Dr. Lisa Thompson',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 4.8,
      downloads: 654,
      views: 1876,
      pages: 43,
      uploadDate: '2024-01-03',
      thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      description: 'Research methodologies in cognitive psychology with practical examples.',
      tags: ['Psychology', 'Research Methods', 'Cognitive Science'],
      isPremium: true,
      price: 12
    }
  ]

  const subjects = ['All', 'School of Social Sciences', 'School of Economics', 'School of Buisness', 'School of Computing and Information Systems','School of Accountancy', 'School of Law','College of Intergrative Studies']
  const universities = ['All Universities', 'Cambridge University', 'Oxford University', 'Imperial College London', 'UCL', 'LSE']

  return (
    <div className="space-y-6">
      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
              <Image
                src={note.thumbnail}
                alt={note.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              {note.isPremium && (
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Premium
                </div>
              )}
              <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {note.pages} pages
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{note.title}</h3>
                  <p className="text-indigo-600 text-sm font-medium">{note.subject} • {note.module}</p>
                  <p className="text-xs text-gray-600">{note.university}</p>
                </div>
                {note.isPremium && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">£{note.price}</div>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <Image
                  src={note.authorAvatar}
                  alt={note.author}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <span className="text-sm text-gray-600">{note.author}</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span>{note.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{note.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{note.views.toLocaleString()}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">{note.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {note.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {note.tags.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    +{note.tags.length - 2}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/notes/${note.id}`}
                  className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                >
                  {note.isPremium ? 'Download' : 'Download'}
                </Link>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Load More */}
      <div className="text-center pt-8">
        <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
          Load More Notes
        </button>
      </div>
    </div>
  )
}

export default NotesSection
