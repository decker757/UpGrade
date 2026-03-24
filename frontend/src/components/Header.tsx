'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const router = useRouter()

  const fetchUserType = async (userId: string) => {
    const { data } = await supabase.from('USERS').select('usertype').eq('id', userId).single()
    setUserType(data?.usertype ?? null)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session)
      if (session?.user) fetchUserType(session.user.id)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
      if (session?.user) fetchUserType(session.user.id)
      else setUserType(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">UpGrade</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-indigo-600">
              Listings
            </Link>
            {userType !== 'Tutor' && (
              <Link href="/tutors" className="text-gray-700 hover:text-indigo-600">
                Tutors
              </Link>
            )}
            <Link href="/createList" className="text-gray-700 hover:text-indigo-600">
              Create Listing
            </Link>
            <Link href="/uploadNotes" className="text-gray-700 hover:text-indigo-600">
              Upload Notes
            </Link>

            {loggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;