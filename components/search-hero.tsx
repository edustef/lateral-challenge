'use client';

import { SearchBar } from '@/components/search-bar';

type Props = {
  staysCount: number;
  featuredMode: boolean;
};

export function SearchHero({ staysCount, featuredMode }: Props) {
  return (
    <>
      {featuredMode ? (
        <section className="flex flex-col items-center px-4 pb-8 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
            Find your perfect escape
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            Describe what you&apos;re looking for and let AI find it
          </p>
          <div className="mt-8 w-full max-w-2xl">
            <SearchBar />
          </div>
        </section>
      ) : (
        <div className="sticky top-0 z-20 border-b border-border bg-bg-page/80 backdrop-blur-sm">
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
