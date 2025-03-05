// app/(main)/templates/loading.jsx
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { TemplatesListSkeleton } from '@/components/templates/templates-list-skeleton';
import { TemplateFiltersSkeleton } from '@/components/templates/template-filters-skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TemplatesPageLoading() {
  // Define breadcrumb items for this page
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { label: 'Templates', isCurrent: true },
  ];

  // Create the action button - not a skeleton since it's not data-dependent
  const createTemplateButton = (
    <Link href="/templates/create">
      <Button>Create Template</Button>
    </Link>
  );

  return (
    <PageSkeleton
      breadcrumbItems={breadcrumbItems}
      title="Templates" // Now this will be rendered as static text
      description="Manage your form templates" // Now this will be rendered as static text
      actions={createTemplateButton} // Now this will be rendered as a static button
    >
      <div className="grid grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <TemplateFiltersSkeleton />
        </div>
        <div>
          <TemplatesListSkeleton />
        </div>
      </div>
    </PageSkeleton>
  );
}
