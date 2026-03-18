'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function loginWithOtp(formData: FormData): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string
  const redirectPath = formData.get('redirect') as string | null

  if (!email) {
    return { error: 'Email is required' }
  }

  const headerStore = await headers()
  const origin = headerStore.get('origin') ?? headerStore.get('x-forwarded-host') ?? 'http://localhost:3000'
  const baseUrl = origin.startsWith('http') ? origin : `https://${origin}`

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback${redirectPath ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
