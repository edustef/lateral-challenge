'use client';

import { useState } from 'react';
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
  ChevronUp,
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

export function VibePicker() {
  const [expanded, setExpanded] = useState(false);
  const [type, setType] = useQueryState('type', searchParamsParsers.type);
  const [vibe, setVibe] = useQueryState('vibe', searchParamsParsers.vibe);

  const typeLabel = travelTypes.find((t) => t.value === type)?.label ?? 'Anyone';
  const vibeLabel = vibes.find((v) => v.value === vibe)?.label ?? 'Any vibe';

  function handleChipToggle(
    current: string | null,
    value: string,
    setter: (val: string | null) => void
  ) {
    setter(current === value ? null : value);
  }

  return (
    <div className="hidden md:block">
      {/* Compact pill */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-medium text-text-body transition-colors hover:border-border"
      >
        <span>{typeLabel}</span>
        <span className="text-text-muted">&middot;</span>
        <span>{vibeLabel}</span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-text-secondary" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        )}
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div className="mt-3 rounded-card border border-border-subtle bg-bg-surface p-6 shadow-sm">
          <div className="flex flex-wrap items-start gap-10">
            {/* Who's traveling? */}
            <div>
              <h3 className="mb-3 font-heading text-lg text-text-primary">
                Who&apos;s traveling?
              </h3>
              <div className="flex gap-2">
                {travelTypes.map((t) => {
                  const Icon = t.icon;
                  const selected = type === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleChipToggle(type, t.value, setType)}
                      aria-label={`Filter by ${t.label}`}
                      aria-pressed={selected}
                      className={`flex items-center gap-2 rounded-pill border px-4 py-2 text-sm transition-colors ${
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
            <div>
              <h3 className="mb-3 font-heading text-lg text-text-primary">
                What&apos;s the vibe?
              </h3>
              <div className="flex gap-2">
                {vibes.map((v) => {
                  const Icon = v.icon;
                  const selected = vibe === v.value;
                  return (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => handleChipToggle(vibe, v.value, setVibe)}
                      aria-label={`Filter by ${v.label}`}
                      aria-pressed={selected}
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

            {/* Apply button */}
            <div className="flex flex-1 items-end justify-end self-end">
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="rounded-button bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
