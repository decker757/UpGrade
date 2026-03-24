'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import NotesSection from '@/components/NotesSection'
import ModulesProfiles from '@/components/ModuleBlocks'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabaseClient'
import { useRequireAuth } from '@/lib/useRequireAuth'

export default function Home() {
  useRequireAuth()
  const [activeTab, setActiveTab] = useState<'tutors' | 'notes'>('tutors')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/auth/login')
    })
  }, [])

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
