'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton({ label = 'Back', className }: { label?: string; className?: string }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className ?? "flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm"}
    >
      <ArrowLeft size={16} /> {label}
    </button>
  )
}
