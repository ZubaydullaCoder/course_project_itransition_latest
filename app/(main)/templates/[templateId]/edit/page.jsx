import { notFound } from 'next/navigation';
import { TemplateEditForm } from '@/components/templates/template-edit-form';
import { getTemplateForEdit } from '@/lib/actions/template-actions';

export default async function EditTemplatePage({ params }) {
  const { templateId } = await params;
  const result = await getTemplateForEdit(templateId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Template</h1>
        <p className="text-muted-foreground">
          Update your template details and questions
        </p>
      </div>
      <TemplateEditForm template={result.data} />
    </div>
  );
}
