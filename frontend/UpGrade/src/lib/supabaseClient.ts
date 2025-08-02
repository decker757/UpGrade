'use client'

import { createClient } from '@supabase/supabase-js'

console.log('✅ Loaded ENV URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('✅ Loaded ENV KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 8) + '...')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)