'use client';

import { useRef, useEffect } from 'react';
import { SearchBar } from '@/components/search/search-bar';
import { useFilterTransition } from '@/components/filter-transition-context';

type Props = {
  staysCount: number;
  featuredMode: boolean;
};

export function SearchHero({ staysCount, featuredMode }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { setHeroScrolledPast, heroScrolledPast } = useFilterTransition();

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroScrolledPast(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [setHeroScrolledPast]);

  return (
    <>
      {featuredMode ? (
        <section
          ref={heroRef}
          className="flex flex-col items-center px-4 pb-4 pt-10 text-center sm:px-6 sm:pb-8 sm:pt-20 lg:px-8"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Find your perfect escape
          </h1>
          <p className="mt-2 text-pretty text-base text-text-secondary">
            Describe what you&apos;re looking for and let AI find it
          </p>
          <div className="mt-6 hidden w-full max-w-2xl sm:mt-8 md:block">
            <SearchBar />
          </div>
        </section>
      ) : (
        <div
          ref={heroRef}
          className="sticky top-0 z-20 border-b border-border bg-bg-page/80 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex-1">
              <SearchBar compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
