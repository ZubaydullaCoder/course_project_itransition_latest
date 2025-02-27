// components/shared/global-search.jsx
'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon, Loader2 } from 'lucide-react';

export function GlobalSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('query') || '');

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
        const queryString = createQueryString({
          query: searchValue || undefined,
        });
        router.push(`/templates${queryString ? `?${queryString}` : ''}`);
      });
    },
    [createQueryString, router]
  );

  const debouncedSearch = useDebounce(handleSearch, 300);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedSearch(newValue);
  };

  return (
    <div className="relative flex-1 min-w-0">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search templates..."
        className="pl-8 w-full"
        value={value}
        onChange={handleChange}
      />
      {isPending && (
        <Loader2 className="absolute right-8 top-2.5 h-4 w-4 animate-spin" />
      )}
    </div>
  );
}
