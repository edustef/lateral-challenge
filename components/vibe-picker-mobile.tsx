'use client';

import { useState, useCallback } from 'react';
import { useQueryState } from 'nuqs';
import { searchParamsParsers } from '@/lib/search-params';
import {
  Users,
  Heart,
  Baby,
  Mountain,
  Landmark,
  TreePine,
  PartyPopper,
  ChevronDown,
  X,
} from 'lucide-react';

const travelTypes = [
  { value: 'solo', label: 'Solo', icon: Users },
  { value: 'duo', label: 'Duo', icon: Heart },
  { value: 'family', label: 'Family', icon: Baby },
  { value: 'group', label: 'Group', icon: Users },
] as const;

const vibes = [
  { value: 'adventure', label: 'Adventure', icon: Mountain },
  { value: 'culture', label: 'Culture', icon: Landmark },
  { value: 'disconnect', label: 'Disconnect', icon: TreePine },
  { value: 'celebration', label: 'Celebration', icon: PartyPopper },
] as const;

export function VibePickerMobile({ staysCount }: { staysCount: number }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useQueryState('type', searchParamsParsers.type);
  const [vibe, setVibe] = useQueryState('vibe', searchParamsParsers.vibe);

  const typeLabel = travelTypes.find((t) => t.value === type)?.label ?? 'Anyone';
  const vibeLabel = vibes.find((v) => v.value === vibe)?.label ?? 'Any vibe';

  const summaryParts: string[] = [];
  if (type) {
    const t = travelTypes.find((t) => t.value === type);
    summaryParts.push(`${t?.label ?? type} traveler`);
  }
  if (vibe) {
    const v = vibes.find((v) => v.value === vibe);
    summaryParts.push(`${v?.label ?? vibe} vibe`);
  }
  const summaryText = summaryParts.length > 0 ? summaryParts.join(' \u00b7 ') : 'All stays';

  const handleReset = useCallback(() => {
    setType(null);
    setVibe(null);
  }, [setType, setVibe]);

  function handleChipToggle(
    current: string | null,
    value: string,
    setter: (val: string | null) => void
  ) {
    setter(current === value ? null : value);
  }

  return (
    <div className="md:hidden">
      {/* Compact pill trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-medium text-text-body"
      >
        <span>{typeLabel}</span>
        <span className="text-text-muted">&middot;</span>
        <span>{vibeLabel}</span>
        <ChevronDown className="h-4 w-4 text-text-secondary" />
      </button>

      {/* Bottom sheet overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sheet */}
          <div className="relative w-full rounded-t-card bg-bg-card px-6 pb-8 pt-6 shadow-xl animate-in slide-in-from-bottom duration-300">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1 text-text-secondary hover:text-text-primary"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Who's traveling? */}
            <div className="mb-6">
              <h3 className="mb-3 font-heading text-lg text-text-primary">
                Who&apos;s traveling?
              </h3>
              <div className="flex gap-2 overflow-x-auto">
                {travelTypes.map((t) => {
                  const Icon = t.icon;
                  const selected = type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleChipToggle(type, t.value, setType)}
                      className={`flex shrink-0 items-center gap-2 rounded-pill border px-4 py-2 text-sm transition-colors ${
                        selected
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-bg-card text-text-body hover:border-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What's the vibe? */}
            <div className="mb-6">
              <h3 className="mb-3 font-heading text-lg text-text-primary">
                What&apos;s the vibe?
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {vibes.map((v) => {
                  const Icon = v.icon;
                  const selected = vibe === v.value;
                  return (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => handleChipToggle(vibe, v.value, setVibe)}
                      className={`flex items-center gap-2 rounded-pill border px-4 py-2 text-sm transition-colors ${
                        selected
                          ? 'border-accent bg-accent text-white'
                          : 'border-border bg-bg-card text-text-body hover:border-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-text-secondary">{summaryText}</span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-button border border-border px-4 py-2 text-sm font-medium text-text-body transition-colors hover:bg-bg-muted"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-button bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Show {staysCount} stays
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
