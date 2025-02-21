import Link from 'next/link';
import { UserNav } from '@/components/dashboard/user-nav';

export function DashboardHeader({ user }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold">
            Forms App
          </Link>
        </div>
        <UserNav user={user} />
      </div>
    </header>
  );
}
