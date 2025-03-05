import { TemplateCreateForm } from '@/components/templates/template-create/template-create-form';
import { PageContainer } from '@/components/layout/page-container';

export default function CreateTemplatePage() {
  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { label: 'Create Template', isCurrent: true },
  ];

  return (
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      maxWidth="3xl"
      spacing="6"
      title="Create Template"
      description="Create a new template for your forms"
    >
      <TemplateCreateForm />
    </PageContainer>
  );
}
