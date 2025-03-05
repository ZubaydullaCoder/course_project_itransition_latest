
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { TemplatesListSkeleton } from '@/components/templates/templates-list-skeleton';
import { TemplateFiltersSkeleton } from '@/components/templates/template-filters-skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TemplatesPageLoading() {
  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { label: 'Templates', isCurrent: true },
  ];

  
  const createTemplateButton = (
    <Link href="/templates/create">
      <Button>Create Template</Button>
    </Link>
  );

  return (
    <PageSkeleton
      breadcrumbItems={breadcrumbItems}
      title="Templates" 
      description="Manage your form templates" 
      actions={createTemplateButton} 
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
