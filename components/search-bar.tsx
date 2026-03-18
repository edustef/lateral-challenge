'use client';

import { useState, useEffect, useTransition, useRef, useCallback } from 'react';
import { useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchParamsParsers } from '@/lib/search-params';
import { searchStaysPreview, type StayPreview } from '@/lib/actions/stays';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

const DEBOUNCE_MS = 300;

export function SearchBar() {
  const [search, setSearch] = useQueryState(
    'search',
    searchParamsParsers.search.withOptions({ throttleMs: 300 })
  );
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(search ?? '');
  const [results, setResults] = useState<StayPreview[]>([]);
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Clear debounce timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Sync query when dialog opens
  useEffect(() => {
    if (open) {
      setQuery(search ?? '');
      // Load initial results if there's already a search term
      if (search && search.length >= 2) {
        startTransition(async () => {
          const data = await searchStaysPreview(search);
          setResults(data);
        });
      }
    } else {
      setResults([]);
    }
  }, [open, search]);

  // Debounced search preview
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      if (timerRef.current) clearTimeout(timerRef.current);

      if (value.length < 2) {
        setResults([]);
        return;
      }

      timerRef.current = setTimeout(() => {
        startTransition(async () => {
          const data = await searchStaysPreview(value);
          setResults(data);
        });
      }, DEBOUNCE_MS);
    },
    [startTransition]
  );

  // Apply search to URL and close
  function handleSubmit() {
    setSearch(query || null);
    setOpen(false);
  }

  // Navigate directly to a stay
  function handleSelectStay(slug: string) {
    setOpen(false);
    router.push(`/stays/${slug}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-pill border border-border-subtle bg-bg-surface text-text-secondary hover:text-text-primary"
        aria-label="Search stays"
      >
        <Search className="h-4 w-4" />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search stays..."
          value={query}
          onValueChange={handleQueryChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <CommandList>
          {isPending && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-4 w-4 animate-spin text-text-secondary" />
            </div>
          )}

          {!isPending && query.length >= 2 && results.length === 0 && (
            <CommandEmpty>No stays found for &ldquo;{query}&rdquo;</CommandEmpty>
          )}

          {!isPending && query.length < 2 && (
            <CommandEmpty>Type at least 2 characters to search...</CommandEmpty>
          )}

          {!isPending && results.length > 0 && (
            <>
              <CommandGroup heading="Stays">
                {results.map((stay) => (
                  <CommandItem
                    key={stay.id}
                    value={stay.title}
                    onSelect={() => handleSelectStay(stay.slug)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-1 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-text-primary">
                          {stay.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-text-secondary">
                          <MapPin className="h-3 w-3" />
                          {stay.location}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-text-primary">
                        &euro;{stay.price_per_night}
                        <span className="text-xs font-normal text-text-secondary">/night</span>
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandGroup>
                <CommandItem
                  onSelect={handleSubmit}
                  className="cursor-pointer justify-center text-accent"
                >
                  <Search className="h-3.5 w-3.5" />
                  Show all results for &ldquo;{query}&rdquo;
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
