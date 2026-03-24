'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from './supabaseClient'

export function useRequireAuth() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/auth/login')
    })
  }, [router])
}
