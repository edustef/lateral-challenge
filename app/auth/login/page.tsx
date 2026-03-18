'use client'

import { useActionState } from 'react'
import { loginWithOtp } from '@/lib/actions/auth'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean }, formData: FormData) => {
      return await loginWithOtp(formData)
    },
    {}
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-page px-4">
      <div className="w-full max-w-sm rounded-card border border-border bg-bg-card p-8 shadow-sm">
        <h1 className="font-heading mb-6 text-center text-2xl font-semibold text-text-primary">
          Sign in to Lateral
        </h1>

        {state.success ? (
          <div className="rounded-lg bg-accent/10 p-4 text-center text-sm text-accent">
            Check your email for a magic link!
          </div>
        ) : (
          <form action={formAction} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-text-body">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-bg-page px-3 py-2 text-sm text-text-primary placeholder:text-text-body/50 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            {state.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {isPending ? 'Sending...' : 'Send magic link'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
