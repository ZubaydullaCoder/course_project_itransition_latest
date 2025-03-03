'use client';

import Link from 'next/link';
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { GlobalSearch } from '@/components/shared/global-search';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTopic = searchParams.get('topic') || 'all';

  const createQueryString = useCallback(
    (params) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const handleTopicChange = useCallback(
    (topic) => {
      const queryString = createQueryString({
        query: searchParams.get('query'),
        topic: topic === 'all' ? '' : topic,
      });
      router.push(`/templates${queryString ? `?${queryString}` : ''}`);
    },
    [createQueryString, router, searchParams]
  );

  const handleSignOut = async () => {
    // Store the current path with user ID as part of the key
    const currentPath = window.location.pathname + window.location.search;
    if (
      currentPath !== '/' &&
      currentPath !== '/login' &&
      currentPath !== '/register'
    ) {
      // Store both the user's email and the path
      if (user?.email) {
        localStorage.setItem(
          `returnPath_${encodeURIComponent(user.email)}`,
          currentPath
        );
      }
    }
    await signOut({
      redirect: true,
      callbackUrl: `/`,
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="hidden md:block font-semibold">
            Forms App
          </Link>

          <div className="flex-1 flex gap-2 max-w-full md:max-w-2xl">
            <GlobalSearch />

            <div className="hidden sm:flex shrink-0">
              <Select value={selectedTopic} onValueChange={handleTopicChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {TEMPLATE_TOPICS.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <nav className="flex items-center gap-2 md:gap-4 shrink-0">
            {user ? (
              <>
                <Link href="/templates" className="hidden md:block">
                  <Button variant="ghost">Templates</Button>
                </Link>

                <ThemeToggle />

                {/* Refactored User Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <UserIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {/* User information */}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        <div className="flex flex-col w-full">
                          <span className="font-medium truncate">
                            {user.name}
                          </span>
                          <span className="text-xs text-muted-foreground mt-1 truncate">
                            {user.email}
                          </span>
                          {user.role === 'ADMIN' && (
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded mt-1 inline-block">
                              Admin
                            </span>
                          )}
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {}
                    {user.role === 'ADMIN' && (
                      <>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <span>Admin Panel</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-48">
                              <DropdownMenuItem asChild>
                                <Link
                                  href="/admin/users"
                                  className="w-full cursor-pointer"
                                >
                                  Users Management
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href="/admin/templates"
                                  className="w-full cursor-pointer"
                                >
                                  Templates Management
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  href="/admin/responses"
                                  className="w-full cursor-pointer"
                                >
                                  Responses Management
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                      </>
                    )}

                    {}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <span>My Content</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent className="w-48">
                          <DropdownMenuItem asChild>
                            <Link
                              href="/profile?tab=templates"
                              className="w-full cursor-pointer"
                            >
                              My Templates
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href="/profile?tab=responses"
                              className="w-full cursor-pointer"
                            >
                              My Responses
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>

                    {}
                    <DropdownMenuItem className="md:hidden" asChild>
                      <Link href="/templates" className="w-full cursor-pointer">
                        Templates
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {}
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
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
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
