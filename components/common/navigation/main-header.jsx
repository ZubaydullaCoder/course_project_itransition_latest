'use client';

import { ModeToggle } from '@/components/common/theme/mode-toggle';
import { Button } from '@/components/ui/button';
import { MainNav } from './main-nav';
import Link from 'next/link';

export function MainHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold">
            Forms App
          </Link>
          <MainNav />
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant="default" size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
