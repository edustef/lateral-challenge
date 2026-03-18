import Link from 'next/link';
import { getClaims } from '@/lib/supabase/server';
import { AuthButton } from '@/components/auth-button';

const navLinks = [
  { href: '/', label: 'Stays', active: true },
  { href: '/experiences', label: 'Experiences', active: false },
  { href: '/saved', label: 'Saved', active: false },
];

export async function Header() {
  const user = await getClaims();

  const authUser = user
    ? { email: user.email ?? '', avatarUrl: user.user_metadata?.avatar_url ?? null }
    : null;

  return (
    <header className="bg-bg-card border-b border-border px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="Lateral — home" className="font-heading text-xl font-semibold text-text-primary">
            Lateral
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.active
                    ? 'font-semibold text-text-primary'
                    : 'text-text-body hover:text-text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Auth */}
        <AuthButton user={authUser} />
      </div>
    </header>
  );
}
