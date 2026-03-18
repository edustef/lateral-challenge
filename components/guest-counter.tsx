'use client';

import { Users, Minus, Plus } from 'lucide-react';

interface GuestCounterProps {
  value: number;
  min?: number;
  max: number;
  onChange: (value: number) => void;
  className?: string;
}

export function GuestCounter({ value, min = 1, max, onChange, className }: GuestCounterProps) {
  return (
    <div className={className ?? "flex items-center justify-between rounded-small border border-border bg-bg-card px-4 h-11 sm:h-12"}>
      <div className="flex items-center gap-2.5">
        <Users size={16} className="text-text-muted" />
        <span className="text-sm text-text-primary">
          {value} adult{value !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label="Decrease guests"
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-secondary hover:bg-bg-muted disabled:opacity-40 transition"
        >
          <Minus size={14} />
        </button>
        <span className="min-w-[1.25rem] text-center text-sm font-medium text-text-primary">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label="Increase guests"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-white disabled:opacity-40 transition"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
