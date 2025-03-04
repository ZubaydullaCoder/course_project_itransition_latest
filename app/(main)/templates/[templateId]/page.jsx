import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getTemplateById } from '@/lib/actions/template-actions';
import { TemplateTabs } from '@/components/templates/template-detail/template-tabs/template-tabs';
import { TemplatePageClientFallback } from '@/components/templates/template-detail/loading/template-page-client-fallback';
import { PageContainer } from '@/components/layout/page-container';

export default async function TemplatePage({ params, searchParams }) {
  const { templateId } = await params;
  const session = await auth();

  // If no session but has a special parameter, show a loading state instead of 404
  if (!session?.user && searchParams.initialLoad === 'true') {
    return <TemplatePageClientFallback templateId={templateId} />;
  }

  const { data: template, error } = await getTemplateById(templateId);

  if (error || !template) {
    notFound();
  }

  const userResponse = template.responses?.[0];

  // Define breadcrumb items for this page
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { label: template.title, isCurrent: true },
  ];

  return (
    <PageContainer breadcrumbItems={breadcrumbItems} maxWidth="3xl">
      <div>
        <h1 className="text-2xl font-bold">{template.title}</h1>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      <TemplateTabs
        template={template}
        session={session}
        userResponse={userResponse}
        templateId={templateId}
      />
    </PageContainer>
  );
}
