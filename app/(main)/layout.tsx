import { Header } from '@/components/header';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <div className="min-h-screen bg-bg-page">
        <Header />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </NuqsAdapter>
  );
}
