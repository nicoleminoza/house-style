'use client'

import { createBrowserClient } from '@supabase/ssr'
import { supabaseAnonKey, supabaseUrl } from '@/lib/env'

/** Browser-side Supabase client (auth, sign-in/out). */
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
