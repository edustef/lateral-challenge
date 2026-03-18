'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'

type AuthButtonProps = {
  user: { email: string; avatarUrl?: string | null } | null
}

export function AuthButton({ user }: AuthButtonProps) {
  const [open, setOpen] = useState(false)

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded-lg px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-bg-page"
      >
        Sign in
      </Link>
    )
  }

  const initial = user.email.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-medium text-white"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-card border border-border bg-bg-card p-3 shadow-lg">
          <p className="mb-2 truncate text-sm text-text-body">{user.email}</p>
          <Link
            href="/profile"
            className="block w-full rounded-lg px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-bg-page"
            onClick={() => setOpen(false)}
          >
            My Bookings
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-text-primary transition-colors hover:bg-bg-page"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
