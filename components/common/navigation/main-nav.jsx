'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const routes = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/templates',
    label: 'Templates',
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === route.href ? 'text-foreground' : 'text-foreground/60'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
