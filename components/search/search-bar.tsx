'use client';

import { useRef, useState } from 'react';
import { Search, Sparkles, X, Loader2 } from 'lucide-react';
import { useSearchQuery } from '@/lib/hooks/use-search-query';
import { SearchSuggestions } from '@/components/search/search-suggestions';
import { Popover, PopoverContent } from '@/components/ui/popover';

type SearchBarProps = {
  compact?: boolean;
};

/**
 * AI-powered search bar (desktop only, hidden on mobile).
 * Simple queries do text search; complex queries are parsed by AI into structured filters.
 * Submits on Enter. Focus popover shows suggestions in hero mode.
 */
export function SearchBar({ compact = false }: SearchBarProps) {
  const {
    localValue,
    setLocalValue,
    isLoading,
    submitQuery,
    handleClear,
    handleKeyDown: baseKeyDown,
  } = useSearchQuery();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  function handleKeyDown(e: React.KeyboardEvent) {
    baseKeyDown(e);
    if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  }

  const inputSize = compact
    ? 'h-10 text-base rounded-full'
    : 'h-10 text-base rounded-full md:h-14';

  const input = (
    <div ref={wrapperRef} className={`relative ${compact ? 'w-full max-w-sm' : 'w-full'}`}>
      <Sparkles className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-accent ${compact ? 'h-4 w-4' : 'h-4 w-4 md:left-4 md:h-5 md:w-5'}`} />
      <input
        ref={inputRef}
        type="text"
        placeholder="Try 'cozy cabin for 2 under $200'..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={isLoading}
        className={`${inputSize} w-full border bg-white font-medium text-text-primary placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none ${
          compact ? 'pl-9 pr-9' : 'pl-9 pr-16 md:pl-11 md:pr-20'
        } ${isLoading ? 'border-accent animate-pulse opacity-70' : 'border-border'}`}
      />
      {isLoading ? (
        <Loader2 className={`absolute top-1/2 -translate-y-1/2 animate-spin text-accent ${compact ? 'right-3 h-3.5 w-3.5' : 'right-4 h-4 w-4 md:right-5'}`} />
      ) : localValue ? (
        <button
          type="button"
          onClick={() => { handleClear(); inputRef.current?.focus(); }}
          aria-label="Clear search"
          className={`absolute top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary ${compact ? 'right-3' : 'right-14 md:right-[4.5rem]'}`}
        >
          <X className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </button>
      ) : null}
      {!compact && (
        <button
          type="button"
          onClick={() => submitQuery(localValue)}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent/90 md:right-2 md:h-10 md:w-10"
        >
          <Search className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </button>
      )}
    </div>
  );

  if (compact) {
    return <div className="hidden md:block">{input}</div>;
  }

  return (
    <div className="hidden md:block w-full">
      <Popover open={!compact && isFocused} onOpenChange={setIsFocused}>
        {input}
        <PopoverContent
          align="start"
          sideOffset={8}
          className="rounded-xl border border-border bg-white p-4 shadow-lg"
        >
          <SearchSuggestions onSelect={(text) => { setLocalValue(text); setIsFocused(false); submitQuery(text); }} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
