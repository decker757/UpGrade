import React, { useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import TutorSearch from './components/TutorSearch'
import NotesSection from './components/NotesSection'
import TutorProfiles from './components/TutorProfiles'
import Footer from './components/Footer'

function App() {
  const [activeTab, setActiveTab] = useState<'tutors' | 'notes'>('tutors')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'tutors' ? (
          <>
            <TutorSearch />
            <TutorProfiles />
          </>
        ) : (
          <NotesSection />
        )}
      </main>
      
      <Footer />
    </div>
  )
}

export default App
