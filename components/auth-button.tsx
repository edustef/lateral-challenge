'use client'

import Link from 'next/link'
import { signOut } from '@/lib/actions/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type AuthButtonProps = {
  user: { email: string; avatarUrl?: string | null } | null
}

export function AuthButton({ user }: AuthButtonProps) {
  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded-lg px-4 py-2 text-sm font-medium text-text-primary transition-all duration-150 hover:bg-bg-page active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        Sign in
      </Link>
    )
  }

  const initial = user.email.charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-medium text-white transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 active:scale-95"
        aria-label="User menu"
      >
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt="User avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          initial
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <p className="truncate px-1.5 py-1 text-xs text-muted-foreground">
          {user.email}
        </p>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/profile" />}>
          My Bookings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/wishlist" />}>
          Wishlist
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
