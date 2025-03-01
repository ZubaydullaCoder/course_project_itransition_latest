// components/shared/global-search.jsx
'use client';

import { useState, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon, Loader2 } from 'lucide-react';
import { useQueryParams } from '@/hooks/use-query-params';

export function GlobalSearch() {
  const { params, setParams } = useQueryParams({ baseUrl: '/templates' });
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(params.query || '');

  const handleSearch = (searchValue) => {
    startTransition(() => {
      setParams({
        query: searchValue || undefined,
      });
    });
  };

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
