import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Singleton pattern to prevent "Multiple GoTrueClient instances" race condition
let cachedClient: ReturnType<typeof createSupabaseClient> | null = null

export const createClient = () => {
  if (cachedClient) {
    return cachedClient
  }
  
  cachedClient = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
  
  return cachedClient
}

export const supabase = createClient()
