'use client';

import { useCallback } from 'react';
import { useQueryState } from 'nuqs';
import {
  X,
  User,
  Users,
  Globe,
  House,
  Mountain,
  Landmark,
  WifiOff,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { searchParamsParsers } from '@/lib/search-params';
import { useFilterTransition } from '@/components/filter-transition-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
  { value: 'solo', label: 'Solo', description: 'Just me', icon: User },
  { value: 'duo', label: 'Duo', description: 'For two', icon: Users },
  { value: 'family', label: 'Family', description: 'Kids welcome', icon: House },
  { value: 'group', label: 'Group', description: 'The crew', icon: Globe },
] as const;

const vibes = [
  { value: 'adventure', label: 'Adventure', description: 'Get out there', icon: Mountain },
  { value: 'culture', label: 'Culture', description: 'Immerse yourself', icon: Landmark },
  { value: 'disconnect', label: 'Disconnect', description: 'Off the grid', icon: WifiOff },
  { value: 'celebration', label: 'Celebration', description: 'Something special', icon: Sparkles },
] as const;

function CardGrid({
  items,
  selected,
  onToggle,
}: {
  items: readonly { value: string; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[];
  selected: string | null;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isSelected = selected === item.value;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => onToggle(item.value)}
            aria-label={`Filter by ${item.label}`}
            aria-pressed={isSelected}
            className={`flex items-center gap-3 rounded-small px-2 py-2.5 text-left transition-all duration-150 active:scale-[0.97] ${
              isSelected
                ? 'bg-accent-tint'
                : 'hover:bg-bg-surface'
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${isSelected ? 'text-accent' : 'text-text-muted'}`} />
            <div className="min-w-0">
              <div className={`text-[13px] font-medium leading-tight ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                {item.label}
              </div>
              <div className={`text-[11px] leading-tight ${isSelected ? 'text-accent/60' : 'text-text-muted'}`}>
                {item.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function FilterContent({
  type,
  vibe,
  onToggleType,
  onToggleVibe,
}: {
  type: string | null;
  vibe: string | null;
  onToggleType: (value: string) => void;
  onToggleVibe: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="flex flex-col gap-3 lg:flex-1">
        <h3 className="text-sm text-text-secondary">
          Who&apos;s traveling?
        </h3>
        <CardGrid items={travelTypes} selected={type} onToggle={onToggleType} />
      </div>
      <div className="hidden lg:block w-px bg-border self-stretch" />
      <div className="flex flex-col gap-3 lg:flex-1">
        <h3 className="text-sm text-text-secondary">
          What&apos;s the vibe?
        </h3>
        <CardGrid items={vibes} selected={vibe} onToggle={onToggleVibe} />
      </div>
    </div>
  );
}

function PillTrigger({
  typeLabel,
  vibeLabel,
  hasSelection,
  TypeIcon,
  VibeIcon,
}: {
  typeLabel: string;
  vibeLabel: string;
  hasSelection: boolean;
  TypeIcon?: React.ComponentType<{ className?: string }>;
  VibeIcon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-button border px-4 h-10 text-chip font-medium transition-colors ${
        hasSelection
          ? 'border-accent bg-accent-tint text-accent'
          : 'border-border bg-white text-text-primary'
      }`}
    >
      <Sparkles className="h-4 w-4 text-accent" />
      <span className="flex items-center gap-1">
        {TypeIcon && <TypeIcon className="h-3.5 w-3.5" />}
        {typeLabel}
      </span>
      <span className="text-text-muted">&middot;</span>
      <span className="flex items-center gap-1">
        {VibeIcon && <VibeIcon className="h-3.5 w-3.5" />}
        {vibeLabel}
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
    </div>
  );
}

export function FilterPill({ staysCount }: { staysCount: number }) {
  const { startTransition, clearConcierge } = useFilterTransition();
  const [type, setType] = useQueryState('type', { ...searchParamsParsers.type, startTransition });
  const [vibe, setVibe] = useQueryState('vibe', { ...searchParamsParsers.vibe, startTransition });

  const typeMatch = travelTypes.find((t) => t.value === type);
  const vibeMatch = vibes.find((v) => v.value === vibe);
  const typeLabel = typeMatch?.label ?? 'Anyone';
  const vibeLabel = vibeMatch?.label ?? 'Any vibe';
  const TypeIcon = typeMatch?.icon;
  const VibeIcon = vibeMatch?.icon;
  const hasSelection = !!(type || vibe);

  const handleToggleType = useCallback(
    (value: string) => {
      setType((prev) => (prev === value ? null : value));
      clearConcierge();
    },
    [setType, clearConcierge],
  );

  const handleToggleVibe = useCallback(
    (value: string) => {
      setVibe((prev) => (prev === value ? null : value));
      clearConcierge();
    },
    [setVibe, clearConcierge],
  );

  const handleReset = useCallback(() => {
    setType(null);
    setVibe(null);
    clearConcierge();
  }, [setType, setVibe, clearConcierge]);

  const summaryParts: string[] = [];
  if (type) {
    const label = travelTypes.find((t) => t.value === type)?.label ?? type;
    summaryParts.push(type === 'solo' ? 'Solo traveler' : label);
  }
  if (vibe) {
    const label = vibes.find((v) => v.value === vibe)?.label ?? vibe;
    summaryParts.push(`${label} vibe`);
  }
  const summaryText = summaryParts.length > 0 ? summaryParts.join(' \u00b7 ') : 'All stays';

  return (
    <div className="flex items-center gap-2">
      {/* Desktop: Popover */}
      <div className="hidden md:block">
        <Popover>
          <PopoverTrigger aria-label="Open filters">
            <PillTrigger typeLabel={typeLabel} vibeLabel={vibeLabel} hasSelection={hasSelection} TypeIcon={TypeIcon} VibeIcon={VibeIcon} />
          </PopoverTrigger>
          <PopoverContent
            align="start"
            sideOffset={8}
            className="w-auto rounded-card border border-border bg-white px-5 py-5 shadow-md"
          >
            <FilterContent
              type={type}
              vibe={vibe}
              onToggleType={handleToggleType}
              onToggleVibe={handleToggleVibe}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Mobile: Drawer */}
      <div className="md:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button" aria-label="Open filters">
              <PillTrigger typeLabel={typeLabel} vibeLabel={vibeLabel} hasSelection={hasSelection} TypeIcon={TypeIcon} VibeIcon={VibeIcon} />
            </button>
          </DrawerTrigger>
          <DrawerContent className="bg-bg-card" aria-label="Filter stays">
            <DrawerHeader className="text-left">
              <DrawerTitle className="sr-only">Filter stays</DrawerTitle>
            </DrawerHeader>
            <div className="px-5 pb-2">
              <FilterContent
                type={type}
                vibe={vibe}
                onToggleType={handleToggleType}
                onToggleVibe={handleToggleVibe}
              />
            </div>
            <DrawerFooter className="border-t border-border">
              <p className="text-sm text-text-secondary">{summaryText}</p>
              <div className="grid grid-cols-2 gap-3">
                <DrawerClose asChild>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-button border border-border px-4 py-2.5 text-sm font-medium text-text-body transition-colors hover:bg-bg-muted"
                  >
                    Reset
                  </button>
                </DrawerClose>
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

      {/* Clear button (visible on both when filters active) */}
      {hasSelection && (
        <button
          type="button"
          onClick={handleReset}
          aria-label="Clear filters"
          className="flex items-center gap-1.5 h-10 px-3 rounded-button text-chip font-medium text-text-secondary transition-colors hover:bg-bg-muted hover:text-text-primary"
        >
          <X className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Clear</span>
        </button>
      )}
    </div>
  );
}
