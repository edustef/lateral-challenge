'use client'

import { Suspense } from 'react'
import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginWithOtp, signInWithOAuth } from '@/lib/actions/auth'
import { Mail, Trees, Compass, Star } from 'lucide-react'
import Image from 'next/image'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')

  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string; success?: boolean }, formData: FormData) => {
      if (redirectTo) {
        formData.append('redirect', redirectTo)
      }
      return await loginWithOtp(formData)
    },
    {}
  )

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel — brand + hero */}
      <div className="hidden w-1/2 flex-col justify-center gap-10 bg-[#F0EDE8] px-20 py-16 lg:flex">
        <div className="overflow-hidden rounded-[20px]">
          <Image
            src="https://images.unsplash.com/photo-1693298025107-f1729daf904b?w=1080&q=80"
            alt="Treehouse in forest"
            width={600}
            height={300}
            className="h-60 w-full object-cover"
            priority
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-lg leading-relaxed text-text-body">
            Discover unique stays tailored to your style.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Trees size={20} className="shrink-0 text-accent" />
            <span className="text-sm text-text-body">Treehouses, cabins, yurts & more</span>
          </div>
          <div className="flex items-center gap-3">
            <Compass size={20} className="shrink-0 text-accent" />
            <span className="text-sm text-text-body">AI-powered discovery for every traveler</span>
          </div>
          <div className="flex items-center gap-3">
            <Star size={20} className="shrink-0 text-accent" />
            <span className="text-sm text-text-body">Trusted reviews from real adventurers</span>
          </div>
        </div>
      </div>

      {/* Right Panel — form */}
      <div className="flex w-full items-center justify-center bg-bg-card px-8 py-16 lg:w-1/2 lg:px-20">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="font-heading text-[28px] font-medium tracking-tight text-text-primary">
              Welcome back
            </h1>
            <p className="text-sm leading-relaxed text-text-muted">
              Sign in with a magic link — no password needed.
            </p>
          </div>

          {/* Email + Magic Link */}
          {state.success ? (
            <div className="rounded-xl bg-accent/10 p-4 text-center text-sm text-accent">
              Check your email for a magic link!
            </div>
          ) : (
            <form action={formAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-[13px] font-medium text-text-primary">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-full border border-[#E8E4DF] bg-white px-5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                />
              </div>

              {state.error && (
                <p className="text-sm text-red-500">{state.error}</p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50 active:scale-[0.98]"
              >
                <Mail size={16} />
                {isPending ? 'Sending...' : 'Send magic link'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[#E8E4DF]" />
            <span className="text-xs text-text-muted">or</span>
            <div className="h-px flex-1 bg-[#E8E4DF]" />
          </div>

          {/* OAuth buttons */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => signInWithOAuth('google', redirectTo)}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#E8E4DF] bg-white text-sm font-medium text-text-primary transition-colors hover:bg-bg-page active:scale-[0.98]"
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => signInWithOAuth('github', redirectTo)}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-[#E8E4DF] bg-white text-sm font-medium text-text-primary transition-colors hover:bg-bg-page active:scale-[0.98]"
            >
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
