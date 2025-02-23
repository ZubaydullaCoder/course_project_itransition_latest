'use client';

import Link from 'next/link';
import { useState, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon, Loader2, UserIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

export const mainNavItems = [
  {
    title: 'Templates',
    href: '/templates',
  },
  {
    title: 'My Responses',
    href: '/forms/my-responses',
  },
];

export function MainNav({ user }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('query') || '');
  const [selectedTopic, setSelectedTopic] = useState(
    searchParams.get('topic') || ''
  );

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

  const handleSearch = useCallback(
    (searchValue) => {
      startTransition(() => {
        // For global search, only update the query parameter
        const queryString = createQueryString({
          query: searchValue || undefined,
        });
        router.push(`/templates${queryString ? `?${queryString}` : ''}`);
      });
    },
    [createQueryString, router]
  );

  const handleTopicChange = useCallback(
    (topic) => {
      setSelectedTopic(topic);
      const queryString = createQueryString({
        query: value,
        topic: topic === 'all' ? '' : topic,
      });
      router.push(`/templates${queryString ? `?${queryString}` : ''}`);
    },
    [createQueryString, router, value]
  );

  const debouncedSearch = useDebounce(handleSearch, 300);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  const handleSignOut = async () => {
    await signOut({
      redirect: true,
      callbackUrl: '/',
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="font-semibold">
            Forms App
          </Link>

          {/* Search and Filter Section */}
          <div className="flex-1 max-w-2xl flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8 w-full"
                value={value}
                onChange={handleChange}
              />
              {isPending && (
                <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin" />
              )}
            </div>
            <Select value={selectedTopic} onValueChange={handleTopicChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                {/* Change this line - use "all" instead of empty string */}
                <SelectItem value="all">All Topics</SelectItem>
                {TEMPLATE_TOPICS.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/templates">
                  <Button variant="ghost">Templates</Button>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin/users">
                    <Button variant="outline">Admin</Button>
                  </Link>
                )}
                <ThemeToggle /> {}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <UserIcon className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <span className="font-medium">{user.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/forms/my-responses">My Responses</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <ThemeToggle /> {}
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
