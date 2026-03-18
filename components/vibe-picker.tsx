'use client';

import { useQueryState } from 'nuqs';
import { searchParamsParsers } from '@/lib/search-params';
import {
  User,
  Users,
  Globe,
  House,
  Mountain,
  Landmark,
  WifiOff,
  Sparkles,
  ChevronDown,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const travelTypes = [
  { value: 'solo', label: 'Solo', icon: User },
  { value: 'duo', label: 'Duo', icon: Users },
  { value: 'family', label: 'Family', icon: House },
  { value: 'group', label: 'Group', icon: Globe },
] as const;

const vibes = [
  { value: 'adventure', label: 'Adventure', icon: Mountain },
  { value: 'culture', label: 'Culture', icon: Landmark },
  { value: 'disconnect', label: 'Disconnect', icon: WifiOff },
  { value: 'celebration', label: 'Celebration', icon: Sparkles },
] as const;

export function VibePicker() {
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

  const hasSelection = type || vibe;

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    setType(null);
    setVibe(null);
  }

  return (
    <div className="hidden md:flex items-center gap-2">
      <Popover>
        <PopoverTrigger
          className={`flex items-center gap-2 rounded-button border px-4 h-10 text-chip font-medium transition-colors ${
            hasSelection
              ? 'border-accent bg-accent-tint text-accent'
              : 'border-border bg-white text-text-primary'
          }`}
        >
          <Sparkles className="h-4 w-4 text-accent" />
          <span>{typeLabel}</span>
          <span className="text-text-muted">&middot;</span>
          <span>{vibeLabel}</span>
          <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
        </PopoverTrigger>

        <PopoverContent
          align="start"
          sideOffset={8}
          className="w-auto rounded-card border border-border bg-white p-7 shadow-md"
        >
          <div className="flex flex-col gap-6">
            {/* Who's traveling? */}
            <div className="flex flex-col gap-3.5">
              <h3 className="font-heading text-lg font-normal text-text-primary">
                Who&apos;s traveling?
              </h3>
              <div className="flex gap-2.5">
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
                      className={`flex items-center gap-1.5 rounded-button border h-9 px-3.5 text-chip font-medium transition-all duration-150 active:scale-95 ${
                        selected
                          ? 'border-accent border-w-active bg-accent-tint text-accent'
                          : 'border-border bg-white text-text-secondary hover:border-accent'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${selected ? 'text-accent' : ''}`} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* What's the vibe? */}
            <div className="flex flex-col gap-3.5">
              <h3 className="font-heading text-lg font-normal text-text-primary">
                What&apos;s the vibe?
              </h3>
              <div className="flex gap-2.5">
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
                      className={`flex items-center gap-1.5 rounded-button border h-9 px-3.5 text-chip font-medium transition-all duration-150 active:scale-95 ${
                        selected
                          ? 'border-accent border-w-active bg-accent-tint text-accent'
                          : 'border-border bg-white text-text-secondary hover:border-accent'
                      }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${selected ? 'text-accent' : ''}`} />
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {hasSelection && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear filters"
          className="flex items-center gap-1.5 h-10 px-3 rounded-button text-chip font-medium text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary"
        >
          <X className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
