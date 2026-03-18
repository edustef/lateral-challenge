import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { clientEnv } from '@/lib/env.client'
import type { Database } from './types'

export async function getClaims() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    clientEnv.supabaseUrl,
    clientEnv.supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  )
}
