// components/shared/main-nav.jsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { useNavigation } from '@/hooks/use-navigation';
import { NavLogo } from './nav-logo';
import { SearchAndFilter } from './search-and-filter';
import { UserMenu } from './user-menu';
import { AuthButtons } from './auth-buttons';

export const mainNavItems = [
  {
    title: 'Templates',
    href: '/templates',
  },
  {
    title: 'My Responses',
    href: '/forms/my-responses',
  },
  {
    title: 'Profile',
    href: '/profile',
  },
];

export function MainNav() {
  const { data: session } = useSession();
  const user = session?.user;
  const { handleTopicChange, handleSignOut, currentTopic } = useNavigation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <NavLogo />
          <SearchAndFilter
            currentTopic={currentTopic}
            handleTopicChange={handleTopicChange}
          />

          <nav className="flex items-center gap-2 md:gap-4 shrink-0">
            {user ? (
              <>
                <Link href="/templates" className="hidden md:block">
                  <Button variant="ghost">Templates</Button>
                </Link>

                <ThemeToggle />
                <UserMenu user={user} handleSignOut={handleSignOut} />
              </>
            ) : (
              <AuthButtons />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
