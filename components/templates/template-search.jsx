'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { SearchIcon, Loader2 } from 'lucide-react';

export function TemplateSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get('query') || '');

  const debouncedCallback = useDebounce((value) => {
    startTransition(() => {
      if (value) {
        router.push(`/templates?query=${encodeURIComponent(value)}`);
      } else {
        router.push('/templates');
      }
    });
  }, 300);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedCallback(newValue);
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search templates..."
        className="pl-8"
        value={value}
        onChange={handleChange}
      />
      {isPending && (
        <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin" />
      )}
    </div>
  );
}
