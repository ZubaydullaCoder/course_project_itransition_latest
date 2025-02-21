import { getTemplates, searchTemplates } from '@/lib/actions/template-actions';
import { TemplatesList } from '@/components/templates/templates-list';
import { TemplateSearch } from '@/components/templates/template-search';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function TemplatesPage({ searchParams }) {
  const { query } = (await searchParams) || {};
  //   const query = searchParams?.query;
  const { data: templates, error } = query
    ? await searchTemplates(query)
    : await getTemplates();

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

      <div className="max-w-md">
        <TemplateSearch />
      </div>

      {error ? (
        <div className="text-center text-muted-foreground">{error}</div>
      ) : (
        <TemplatesList templates={templates || []} searchQuery={query} />
      )}
    </div>
  );
}
