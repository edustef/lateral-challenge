import { Suspense } from 'react';
import { Header } from '@/components/header';
import { PageTransition } from '@/components/page-transition';
import { SearchOverlay } from '@/components/search-bar';
import { MobileSearchFab } from '@/components/mobile-search-fab';
import { FilterTransitionProvider } from '@/components/filter-transition-context';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <FilterTransitionProvider>
        <div className="min-h-screen bg-bg-page">
          <Header />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
        <Suspense>
          <MobileSearchFab />
          <SearchOverlay />
        </Suspense>
      </FilterTransitionProvider>
    </NuqsAdapter>
  );
}
