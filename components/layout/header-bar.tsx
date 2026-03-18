'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchBar } from '@/components/search/search-bar';
import { AuthButton } from '@/components/auth-button';
import { useFilterTransition } from '@/components/filter-transition-context';

type Props = {
  authUser: { email: string; avatarUrl: string | null } | null;
};

export function HeaderBar({ authUser }: Props) {
  const pathname = usePathname();
  const { heroScrolledPast } = useFilterTransition();
  const showSearch = heroScrolledPast && pathname === '/';

  return (
    <header className="top-0 z-40 bg-bg-page/80 backdrop-blur-xl md:sticky">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" aria-label="Wanderly — home" className="flex shrink-0 items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded-sm">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 107.05 107.71" fill="currentColor" className="size-6 text-primary">
            <path d="M47.885.252c2.712-.397 8.35-.271 11.098.006 14.323 1.4 27.476 8.518 36.482 19.742 10.897 13.58 12.84 27.055 10.934 43.723-8.64-8.939-16.866-19.245-26.141-28.748l-6.834 7.155c-4.373-6.455-12.154-15.662-17.183-21.992l-2.72-3.042-19.765 25.354c-2.384-2.344-5.238-4.72-7.787-6.93-8.747 9.51-17.053 18.627-25.277 28.582l-.083-.578C-3.731 31.463 15.446 4.47 47.885.252" />
            <path d="M53.842 28.732c6.51 8.572 12.111 16.237 19.048 24.55q3.676-3.93 7.223-7.98c8.233 8.797 16.226 17.815 23.97 27.045-4.848 12.751-14.191 23.289-26.27 29.629l-.095-10.056c3.582-.068 7.249-.04 10.84-.053-2.638-3.453-6.06-7.38-8.86-10.859l6.73-.063c-3.014-3.312-5.315-6.68-7.907-10.309 2.1.095 4.294.058 6.401.056-4.218-4.456-6.574-8.122-9.775-13.357-2.913 4.75-5.683 8.711-8.884 13.247l6.082.444c-1.618 2.15-6.461 7.604-7.147 9.699l1.04.496 4.417-.337c-.374 2.254-6.702 8.836-8.603 10.954l10.466.1.012 12.465c-30.518 9.919-56.708-3.017-69.592-31.934 7.665-9 15.452-17.894 23.358-26.683l3.103 2.817c-2.987 3.946-5.96 8.081-8.9 12.077 2.457 1.503 3.782 2.433 6.06 4.158 7.619-11.671 18.98-24.337 27.283-36.105" />
          </svg>
          <span className="font-heading text-lg font-semibold text-text-primary">Wanderly</span>
        </Link>

        {/* Center: Search bar — desktop only, visible when hero scrolled past */}
        {showSearch && (
          <div className="hidden flex-1 md:block md:max-w-md lg:max-w-lg">
            <SearchBar compact />
          </div>
        )}

        {/* Right: Auth */}
        <div className="shrink-0">
          <AuthButton user={authUser} />
        </div>
      </div>
    </header>
  );
}
