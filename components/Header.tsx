import Link from 'next/link';
import { useState } from 'react';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'AI Assistant', href: '/chat' },
  { label: 'Weather', href: '/weather' },
  { label: 'Crop Health', href: '/pest-detect' },
  { label: 'Mandi Prices', href: '/market' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e4e9df] bg-[#fdfdf9]/95 shadow-[0_3px_16px_-12px_rgba(32,60,43,0.25)] backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#78a96a] focus:ring-offset-2"
            onClick={() => setIsMenuOpen(false)}
            aria-label="KrishiSethuu home"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#285b3b] text-2xl text-white shadow-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-7 w-7"
                aria-hidden="true"
              >
                <path
                  d="M12 21v-9m0 4C5 16 4 10 4 6c5 0 9 2 9 8m-1-2c0-5 3-8 8-9 1 6-2 11-8 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span>
              <span className="block text-lg font-bold tracking-tight text-[#244d33] sm:text-xl">
                KrishiSethuu
              </span>
              <span className="hidden text-[11px] font-medium tracking-wide text-[#7b887a] sm:block">
                SMARTER FARMING, BETTER DECISIONS
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-[#596b5b] transition-colors hover:bg-[#edf2e8] hover:text-[#285b3b] focus:outline-none focus:ring-2 focus:ring-[#78a96a]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop call to action */}
          <Link
            href="/chat"
            className="hidden shrink-0 items-center gap-2 rounded-xl bg-[#285b3b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1d472d] focus:outline-none focus:ring-2 focus:ring-[#78a96a] focus:ring-offset-2 sm:inline-flex"
          >
            <span aria-hidden="true">✳</span>
            Ask AI
            <span aria-hidden="true">↗</span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#dce4d7] bg-white text-[#285b3b] transition hover:bg-[#edf2e8] focus:outline-none focus:ring-2 focus:ring-[#78a96a] lg:hidden"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="border-t border-[#e4e9df] py-3 lg:hidden"
          >
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[#49604b] transition hover:bg-[#edf2e8] hover:text-[#285b3b] focus:outline-none focus:ring-2 focus:ring-[#78a96a]"
                >
                  {item.label}
                  <span aria-hidden="true" className="text-[#82a276]">→</span>
                </Link>
              ))}

              <Link
                href="/feedback"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 flex items-center justify-center rounded-xl border border-[#dce4d7] bg-white px-4 py-3 text-sm font-semibold text-[#285b3b] transition hover:bg-[#edf2e8]"
              >
                Share feedback
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;