import { TemplateCreateForm } from '@/components/templates/template-create/template-create-form';
import { PageContainer } from '@/components/layout/page-container';

export default function CreateTemplatePage() {
  // Define breadcrumb items for this page
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { label: 'Create Template', isCurrent: true },
  ];

  return (
    <PageContainer breadcrumbItems={breadcrumbItems} maxWidth="3xl" spacing="6">
      <div>
        <h1 className="text-2xl font-bold">Create Template</h1>
        <p className="text-muted-foreground">
          Create a new template for your forms
        </p>
      </div>
      <TemplateCreateForm />
    </PageContainer>
  );
}
