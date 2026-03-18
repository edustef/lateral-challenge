'use client';

import { useCallback } from 'react';
import { useQueryState } from 'nuqs';
import { searchParamsParsers } from '@/lib/search-params';
import {
  User,
  Users,
  Baby,
  UsersRound,
  Mountain,
  Landmark,
  TreePine,
  PartyPopper,
  ChevronDown,
} from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

const travelTypes = [
  { value: 'solo', label: 'Solo', icon: User },
  { value: 'duo', label: 'Duo', icon: Users },
  { value: 'family', label: 'Family', icon: Baby },
  { value: 'group', label: 'Group', icon: UsersRound },
] as const;

const vibes = [
  { value: 'adventure', label: 'Adventure', icon: Mountain },
  { value: 'culture', label: 'Culture', icon: Landmark },
  { value: 'disconnect', label: 'Disconnect', icon: TreePine },
  { value: 'celebration', label: 'Celebration', icon: PartyPopper },
] as const;

export function VibePickerMobile({ staysCount }: { staysCount: number }) {
  const [type, setType] = useQueryState('type', searchParamsParsers.type);
  const [vibe, setVibe] = useQueryState('vibe', searchParamsParsers.vibe);

  const typeLabel = travelTypes.find((t) => t.value === type)?.label ?? 'Anyone';
  const vibeLabel = vibes.find((v) => v.value === vibe)?.label ?? 'Any vibe';

  const summaryParts: string[] = [];
  if (type) {
    const t = travelTypes.find((t) => t.value === type);
    const label = t?.label ?? type;
    summaryParts.push(type === 'solo' ? 'Solo traveler' : label);
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
      <Drawer>
        <DrawerTrigger asChild>
          <button
            type="button"
            aria-label="Open vibe filter"
            className="flex items-center gap-2 rounded-pill border border-border-subtle bg-bg-surface px-4 py-2 text-sm font-medium text-text-body"
          >
            <span>{typeLabel}</span>
            <span className="text-text-muted">&middot;</span>
            <span>{vibeLabel}</span>
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          </button>
        </DrawerTrigger>

        <DrawerContent className="bg-bg-card" aria-label="Vibe filter">
          <DrawerHeader className="text-left">
            <DrawerTitle className="sr-only">Filter stays</DrawerTitle>
          </DrawerHeader>

          <div className="px-6 pb-2">
            {/* Who's traveling? */}
            <div className="mb-6">
              <h3 className="mb-3 font-heading text-lg text-text-primary">
                Who&apos;s traveling?
              </h3>
              <div className="grid grid-cols-2 gap-2">
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
          </div>

          {/* Footer */}
          <DrawerFooter className="border-t border-border">
            <p className="text-sm text-text-secondary">{summaryText}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-muted"
              >
                Reset
              </button>
              <DrawerClose asChild>
                <button
                  type="button"
                  className="rounded-button bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                >
                  Show {staysCount} stays
                </button>
              </DrawerClose>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
