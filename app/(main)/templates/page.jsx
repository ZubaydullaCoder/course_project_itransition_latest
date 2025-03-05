import { auth } from '@/auth';
import { getTemplates } from '@/lib/actions/template-actions';
import { TemplatesList } from '@/components/templates/templates-list';
import { TemplateFilters } from '@/components/templates/template-filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/page-container';

export default async function TemplatesPage({ searchParams }) {
  const { query, topic, tag, filter, status, sort } =
    (await searchParams) || {};
  const sortDefault = sort || 'latest';

  const session = await auth();

  const { data: templates, error } = await getTemplates({
    query,
    topic,
    tag,
    filter,
    status,
    sort,
  });

  
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
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      title="Templates"
      description="Manage your form templates"
      actions={createTemplateButton}
    >
      <div className="grid grid-cols-[280px_1fr] gap-6">
        <div className="space-y-4">
          <TemplateFilters
            currentTopic={topic}
            currentTag={tag}
            currentFilter={filter}
            currentStatus={status}
            currentSort={sortDefault}
          />
        </div>
        <div>
          {error ? (
            <div className="text-center text-muted-foreground">{error}</div>
          ) : (
            <TemplatesList
              initialTemplates={templates || []}
              session={session}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
