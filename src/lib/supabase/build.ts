import { createClient } from '@supabase/supabase-js'

// Build-time client that doesn't require cookies
export function createBuildClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 