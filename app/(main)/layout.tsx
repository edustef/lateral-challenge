import { Header } from '@/components/header';
import { PageTransition } from '@/components/page-transition';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <div className="min-h-screen bg-bg-page">
        <Header />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </NuqsAdapter>
  );
}
