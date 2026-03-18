import { createBrowserClient } from '@supabase/ssr'
import { clientEnv } from '@/lib/env.client'
import type { Database } from './types'

export function createClient() {
  return createBrowserClient<Database>(
    clientEnv.supabaseUrl,
    clientEnv.supabaseKey
  )
}
