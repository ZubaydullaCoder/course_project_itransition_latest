import { notFound } from 'next/navigation';
import { TemplateEditForm } from '@/components/templates/template-edit/template-edit-form';
import { getTemplateForEdit } from '@/lib/actions/template-actions';
import { PageContainer } from '@/components/layout/page-container';

export default async function EditTemplatePage({ params }) {
  const { templateId } = await params;
  const result = await getTemplateForEdit(templateId);

  if (result.error || !result.data) {
    notFound();
  }

  // Define breadcrumb items for this page
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { href: `/templates/${templateId}`, label: result.data.title },
    { label: 'Edit Template', isCurrent: true },
  ];

  return (
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      maxWidth="3xl"
      spacing="6"
      title="Edit Template"
      description="Update your template details and questions"
    >
      <TemplateEditForm template={result.data} />
    </PageContainer>
  );
}
