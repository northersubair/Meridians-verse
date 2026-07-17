'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useId } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useActiveSection } from '@/hooks/useActiveSection';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const mobileMenuId = useId();
  const activeSection = useActiveSection();

  const isActive = (id: string) => activeSection === id;

  const baseNavClassName =
    'text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50';

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-primary">M</div>
            <span className="text-lg font-semibold text-foreground">MERIDIAN</span>
          </div>
          <h1 className="sr-only">Meridian Focus</h1>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#focus"
              aria-current={isActive('focus') ? 'page' : undefined}
              className={baseNavClassName}
            >
              Focus
            </Link>
            <Link
              href="#stream"
              aria-current={isActive('stream') ? 'page' : undefined}
              className={baseNavClassName}
            >
              Stream
            </Link>
            <Link
              href="#pool"
              aria-current={isActive('pool') ? 'page' : undefined}
              className={baseNavClassName}
            >
              Pool
            </Link>
            <Link
              href="#features"
              aria-current={isActive('features') ? 'page' : undefined}
              className={baseNavClassName}
            >
              Features
            </Link>
          </nav>

          {/* CTA - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button className="px-6 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              Sign In
            </button>
            <button className="px-6 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
            aria-controls={mobileMenuId}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            {isOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav id={mobileMenuId} className="md:hidden pb-4 space-y-2">
            <Link
              href="#focus"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Focus
            </Link>
            <Link
              href="#stream"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Stream
            </Link>
            <Link
              href="#pool"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Pool
            </Link>
            <Link
              href="#features"
              className="block px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <div className="flex items-center justify-between gap-2 px-4 pt-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>
            <button className="w-full px-4 py-2 text-sm font-medium rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Get Started
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
