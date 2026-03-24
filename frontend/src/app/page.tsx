'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TutorSearch from '@/components/TutorSearch'
import NotesSection from '@/components/NotesSection'
import TutorProfiles from '@/components/TutorProfiles'
import ModulesProfiles from '@/components/ModuleBlocks'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'tutors' | 'notes'>('tutors')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'tutors' ? (
          <>
            <ModulesProfiles/>
          </>
        ) : (
          <NotesSection />
        )}
      </main>
      
      <Footer />
    </div>
  )
}
