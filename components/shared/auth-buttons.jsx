
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/theme-toggle';

export function AuthButtons() {
  return (
    <div className="flex items-center gap-2 md:gap-4">
      <ThemeToggle />
      <Link href="/login">
        <Button variant="ghost" size="sm" className="md:size-default">
          Sign In
        </Button>
      </Link>
      <Link href="/register" className="hidden sm:block">
        <Button size="sm" className="md:size-default">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
