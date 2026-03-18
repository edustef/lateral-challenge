'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton({ label = 'Back', className }: { label?: string; className?: string }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={className}
    >
      <ArrowLeft size={16} /> {label}
    </button>
  )
}
