import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';

export async function MainNav() {
  const session = await auth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-semibold">
            Forms App
          </Link>

          <nav className="flex items-center gap-6">
            {session?.user ? (
              <div className="flex items-center gap-4">
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline">Admin Dashboard</Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <span className="font-medium">{session.user.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/templates">My Templates</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <form
                        action={async () => {
                          'use server';
                          await signOut();
                        }}
                        className="w-full"
                      >
                        <button type="submit" className="w-full text-left">
                          Sign Out
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
