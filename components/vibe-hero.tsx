'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  SlidersHorizontal,
} from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { searchParamsParsers } from '@/lib/search-params';
import { useFilterTransition } from '@/components/filter-transition-context';
import { SearchBar, SearchOverlay } from '@/components/search-bar';
import { SortToggle } from '@/components/sort-toggle';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

/* ─── Data ─────────────────────────────────────────── */

const vibes = [
  { value: 'adventure', label: 'Adventure', tagline: 'Get out there', icon: Mountain, color: 'var(--warm-accent)' },
  { value: 'culture', label: 'Culture', tagline: 'Immerse yourself', icon: Landmark, color: 'var(--vibe-culture)' },
  { value: 'disconnect', label: 'Disconnect', tagline: 'Off the grid', icon: WifiOff, color: 'var(--vibe-disconnect)' },
  { value: 'celebration', label: 'Celebration', tagline: 'Something special', icon: Sparkles, color: 'var(--vibe-celebration)' },
] as const;

const travelTypes = [
  { value: 'solo', label: 'Solo', tagline: 'Just me', icon: User },
  { value: 'duo', label: 'Duo', tagline: 'For two', icon: Users },
  { value: 'family', label: 'Family', tagline: 'Kids welcome', icon: House },
  { value: 'group', label: 'Group', tagline: 'The crew', icon: Globe },
] as const;

function getVibeColor(value: string | null) {
  return vibes.find((v) => v.value === value)?.color ?? 'var(--accent)';
}

/* ─── Icon hover animations ────────────────────────── */

const iconVariants: Record<string, Variants> = {
  adventure: {
    hover: { y: [0, -4, 0], transition: { duration: 0.3, ease: 'easeInOut' } },
  },
  culture: {
    hover: { rotate: [0, -6, 6, 0], transition: { duration: 0.3, ease: 'easeInOut' } },
  },
  disconnect: {
    hover: { y: [0, -3, 0, -3, 0], transition: { duration: 0.6, ease: 'easeInOut' } },
  },
  celebration: {
    hover: { scale: [1, 1.3, 1], transition: { duration: 0.25, ease: 'easeOut' } },
  },
};

/* ─── Reduced motion hook ──────────────────────────── */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ─── VibeCard ─────────────────────────────────────── */

function VibeCard({
  value,
  label,
  tagline,
  icon: Icon,
  color,
  selected,
  siblingSelected,
  onSelect,
}: {
  value: string;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  selected: boolean;
  siblingSelected: boolean;
  onSelect: (value: string) => void;
}) {
  const MotionIcon = motion.create(Icon);
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(value)}
      aria-label={`Filter by ${label}`}
      aria-pressed={selected}
      whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex flex-col items-center justify-center gap-2 rounded-card border-2 px-3 py-4 md:py-5 transition-all duration-200 cursor-pointer"
      style={{
        borderColor: selected ? color : 'transparent',
        background: selected
          ? `linear-gradient(135deg, color-mix(in srgb, ${color} 14%, white), color-mix(in srgb, ${color} 6%, white))`
          : 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
        opacity: siblingSelected && !selected ? 0.45 : 1,
        boxShadow: selected
          ? `0 8px 24px -4px color-mix(in srgb, ${color} 25%, transparent), 0 0 0 1px ${color}`
          : '0 2px 8px -2px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl transition-colors duration-200"
        style={{
          backgroundColor: selected
            ? `color-mix(in srgb, ${color} 18%, white)`
            : `color-mix(in srgb, ${color} 8%, var(--bg-muted))`,
        }}
      >
        <MotionIcon
          className="h-5 w-5 md:h-6 md:w-6"
          style={{ color: selected ? color : `color-mix(in srgb, ${color} 50%, var(--text-secondary))` }}
          variants={reducedMotion ? undefined : iconVariants[value]}
          whileHover="hover"
        />
      </div>
      <div className="text-center">
        <div
          className="text-sm font-semibold"
          style={{ color: selected ? color : 'var(--text-primary)' }}
        >
          {label}
        </div>
        <div
          className="mt-0.5 text-xs"
          style={{ color: selected ? `color-mix(in srgb, ${color} 60%, var(--text-secondary))` : 'var(--text-secondary)' }}
        >
          {tagline}
        </div>
      </div>
    </motion.button>
  );
}

/* ─── TravelTypePill ───────────────────────────────── */

function TravelTypePill({
  value,
  label,
  icon: Icon,
  selected,
  onSelect,
}: {
  value: string;
  label: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  selected: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-label={`Filter by ${label}`}
      aria-pressed={selected}
      className={`flex items-center gap-2 rounded-pill border px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-[0.97] cursor-pointer ${
        selected
          ? 'border-accent bg-accent-tint text-accent'
          : 'border-border bg-white text-text-primary hover:bg-bg-surface'
      }`}
    >
      <Icon className={`h-4 w-4 ${selected ? 'text-accent' : 'text-text-muted'}`} />
      {label}
    </button>
  );
}

/* ─── Shared filter panel (used in popover + drawer) ── */

function FilterPanel({
  vibe,
  type,
  onSelectVibe,
  onSelectType,
}: {
  vibe: string | null;
  type: string | null;
  onSelectVibe: (value: string) => void;
  onSelectType: (value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">Vibe</p>
        <div className="grid grid-cols-2 gap-2">
          {vibes.map((v) => {
            const isSelected = vibe === v.value;
            return (
              <button
                key={v.value}
                type="button"
                onClick={() => onSelectVibe(v.value)}
                aria-pressed={isSelected}
                className="flex items-center gap-2 rounded-small border px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer"
                style={{
                  borderColor: isSelected ? v.color : 'var(--border)',
                  backgroundColor: isSelected ? `color-mix(in srgb, ${v.color} 10%, white)` : 'transparent',
                  color: isSelected ? v.color : 'var(--text-primary)',
                }}
              >
                <v.icon
                  className="h-4 w-4"
                  style={{ color: isSelected ? v.color : `color-mix(in srgb, ${v.color} 50%, var(--text-secondary))` }}
                />
                {v.label}
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-text-secondary mb-2">Who&apos;s going?</p>
        <div className="grid grid-cols-2 gap-2">
          {travelTypes.map((t) => {
            const isSelected = type === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => onSelectType(t.value)}
                aria-pressed={isSelected}
                className={`flex items-center gap-2 rounded-small border px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-accent bg-accent-tint text-accent'
                    : 'border-border text-text-primary hover:bg-bg-surface'
                }`}
              >
                <t.icon className={`h-4 w-4 ${isSelected ? 'text-accent' : 'text-text-muted'}`} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── StickyFilterTrigger ─────────────────────────── */

function StickyFilterTrigger({
  vibe,
  type,
  vibeMatch,
  typeMatch,
  vibeColor,
  hasSelection,
  onSelectVibe,
  onSelectType,
  onClear,
}: {
  vibe: string | null;
  type: string | null;
  vibeMatch: (typeof vibes)[number] | undefined;
  typeMatch: (typeof travelTypes)[number] | undefined;
  vibeColor: string;
  hasSelection: boolean;
  onSelectVibe: (value: string) => void;
  onSelectType: (value: string) => void;
  onClear: () => void;
}) {
  const triggerContent = hasSelection ? (
    <div className="flex items-center gap-2">
      {vibeMatch && (
        <span
          className="flex items-center gap-1.5 text-chip font-medium"
          style={{ color: vibeColor }}
        >
          <vibeMatch.icon className="h-3.5 w-3.5" />
          {vibeMatch.label}
        </span>
      )}
      {vibeMatch && typeMatch && (
        <span className="text-text-muted">&middot;</span>
      )}
      {typeMatch && (
        <span className="flex items-center gap-1.5 text-chip font-medium text-accent">
          <typeMatch.icon className="h-3.5 w-3.5" />
          {typeMatch.label}
        </span>
      )}
      <SlidersHorizontal className="h-3.5 w-3.5 text-text-muted" />
    </div>
  ) : (
    <div className="flex items-center gap-2 text-chip font-medium text-text-secondary">
      <SlidersHorizontal className="h-3.5 w-3.5" />
      Filters
    </div>
  );

  return (
    <>
      {/* Desktop: Popover */}
      <Popover>
        <PopoverTrigger className="hidden md:flex items-center gap-2 rounded-pill border border-border bg-white px-3 py-1.5 transition-colors hover:bg-bg-surface cursor-pointer">
          {triggerContent}
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-80 p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-text-primary">Filters</span>
            {hasSelection && (
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
          <FilterPanel
            vibe={vibe}
            type={type}
            onSelectVibe={onSelectVibe}
            onSelectType={onSelectType}
          />
        </PopoverContent>
      </Popover>

      {/* Mobile: Drawer */}
      <Drawer>
        <DrawerTrigger className="flex md:hidden items-center gap-2 rounded-pill border border-border bg-white px-3 py-1.5 transition-colors active:scale-[0.97] cursor-pointer">
          {triggerContent}
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <div className="flex items-center justify-between">
              <DrawerTitle>Filters</DrawerTitle>
              {hasSelection && (
                <button
                  type="button"
                  onClick={onClear}
                  className="text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <FilterPanel
              vibe={vibe}
              type={type}
              onSelectVibe={onSelectVibe}
              onSelectType={onSelectType}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

/* ─── VibeHero (exported) ──────────────────────────── */

export function VibeHero({ staysCount }: { staysCount: number }) {
  const { startTransition, clearConcierge } = useFilterTransition();
  const [vibe, setVibe] = useQueryState('vibe', { ...searchParamsParsers.vibe, startTransition });
  const [type, setType] = useQueryState('type', { ...searchParamsParsers.type, startTransition });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isStuck, setIsStuck] = useState(false);

  const hasSelection = !!(vibe || type);

  // Sentinel above the sticky element detects when we've scrolled past
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSelectVibe = useCallback(
    (value: string) => {
      setVibe((prev) => (prev === value ? null : value));
      clearConcierge();
    },
    [setVibe, clearConcierge],
  );

  const handleSelectType = useCallback(
    (value: string) => {
      setType((prev) => (prev === value ? null : value));
      clearConcierge();
    },
    [setType, clearConcierge],
  );

  const handleClear = useCallback(() => {
    setVibe(null);
    setType(null);
    clearConcierge();
  }, [setVibe, setType, clearConcierge]);

  const vibeMatch = vibes.find((v) => v.value === vibe);
  const typeMatch = travelTypes.find((t) => t.value === type);
  const vibeColor = getVibeColor(vibe);

  return (
    <>
      {/* ── Expanded hero ── normal document flow, never collapses */}
      <div className="relative bg-bg-page">
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          {/* Decorative background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -top-24 left-1/2 h-[320px] w-[600px] -translate-x-1/2 rounded-full bg-warm-accent/8 blur-[100px]" />
            <div className="absolute -top-16 left-1/4 h-[200px] w-[400px] rounded-full bg-vibe-culture/6 blur-[80px]" />
            <div className="absolute -top-16 right-1/4 h-[200px] w-[400px] rounded-full bg-vibe-disconnect/6 blur-[80px]" />
          </div>

          <div className="relative">
            <p className="text-center text-sm font-medium uppercase tracking-widest text-warm-accent mb-2">
              Discover your next escape
            </p>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary text-center mb-2">
              Where will you go?
            </h2>
            <p className="text-center text-text-secondary mb-8 max-w-md mx-auto">
              Pick a vibe and let us find the perfect stay for you
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
              {vibes.map((v) => (
                <VibeCard
                  key={v.value}
                  value={v.value}
                  label={v.label}
                  tagline={v.tagline}
                  icon={v.icon}
                  color={v.color}
                  selected={vibe === v.value}
                  siblingSelected={!!vibe && vibe !== v.value}
                  onSelect={handleSelectVibe}
                />
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-text-secondary mb-3">Who&apos;s going?</p>
              <div className="flex flex-wrap justify-center gap-2">
                {travelTypes.map((t) => (
                  <TravelTypePill
                    key={t.value}
                    value={t.value}
                    label={t.label}
                    tagline={t.tagline}
                    icon={t.icon}
                    selected={type === t.value}
                    onSelect={handleSelectType}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sentinel — sits between hero and content; when it scrolls out, strip appears */}
      <div ref={sentinelRef} className="h-0 w-full" />

      {/* ── Compact sticky strip ── slides in when scrolled past the hero */}
      <div
        className="sticky top-0 md:top-14 z-30 transition-all duration-200"
        style={{
          opacity: isStuck ? 1 : 0,
          pointerEvents: isStuck ? 'auto' : 'none',
          transform: isStuck ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        <div className="border-b border-border-subtle bg-bg-page/90 backdrop-blur-xl">
          <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
            {/* Filter trigger — popover on md+, drawer on mobile */}
            <StickyFilterTrigger
              vibe={vibe}
              type={type}
              vibeMatch={vibeMatch}
              typeMatch={typeMatch}
              vibeColor={vibeColor}
              hasSelection={hasSelection}
              onSelectVibe={handleSelectVibe}
              onSelectType={handleSelectType}
              onClear={handleClear}
            />

            <div className="ml-auto flex shrink-0 items-center gap-3">
              <SearchBar />
              <SortToggle />
            </div>

            <SearchOverlay />
          </div>
        </div>
      </div>
    </>
  );
}
