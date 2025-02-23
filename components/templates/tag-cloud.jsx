
'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';

export function TagCloud({ tags }) {
  const router = useRouter();

  const handleTagClick = (tag) => {
    router.push(`/templates?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant="secondary"
          className="cursor-pointer hover:bg-secondary/80"
          style={{
            fontSize: `${Math.max(0.8, Math.min(2, tag.count / 10))}rem`,
          }}
          onClick={() => handleTagClick(tag.name)}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
