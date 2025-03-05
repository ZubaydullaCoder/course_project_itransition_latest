// components/templates/templates-list-skeleton.jsx
'use client';

import { TemplateCardSkeleton } from '@/components/templates/template-card-skeleton';

export function TemplatesListSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array(8)
        .fill(null)
        .map((_, index) => (
          <TemplateCardSkeleton key={index} />
        ))}
    </div>
  );
}
