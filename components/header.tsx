import Link from 'next/link';
import { User } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Stays', active: true },
  { href: '/experiences', label: 'Experiences', active: false },
  { href: '/saved', label: 'Saved', active: false },
];

export function Header() {
  return (
    <header className="bg-bg-card border-b border-border px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="font-heading text-xl font-semibold text-text-primary">
            Lateral
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
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

        {/* Right: Avatar */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white"
          aria-label="User menu"
        >
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
