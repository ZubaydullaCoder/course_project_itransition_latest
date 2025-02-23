import { getTemplates } from '@/lib/actions/template-actions';
import { TemplatesList } from '@/components/templates/templates-list';
import { TemplateFilters } from '@/components/templates/template-filters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function TemplatesPage({ searchParams }) {
  const { query, topic, tag, filter, status } = (await searchParams) || {};
  // Set default sort to 'latest' if not specified
  const sort = searchParams?.sort || 'latest';

  const { data: templates, error } = await getTemplates({
    query,
    topic,
    tag,
    filter,
    status,
    sort,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">Manage your form templates</p>
        </div>
        <Link href="/templates/create">
          <Button>Create Template</Button>
        </Link>
      </div>

      <TemplateFilters
        currentTopic={topic}
        currentTag={tag}
        currentFilter={filter}
        currentStatus={status}
        currentSort={sort}
      />

      {error ? (
        <div className="text-center text-muted-foreground">{error}</div>
      ) : (
        <TemplatesList
          templates={templates || []}
          searchQuery={query}
          currentTopic={topic}
          currentTag={tag}
        />
      )}
    </div>
  );
}
