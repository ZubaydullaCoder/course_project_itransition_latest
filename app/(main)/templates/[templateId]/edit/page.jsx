import { notFound } from 'next/navigation';
import { getTemplateById } from '@/lib/actions/template-actions';
import { TemplateEditForm } from '@/components/templates/template-edit-form';
import { auth } from '@/auth';

export default async function EditTemplatePage({ params }) {
  const session = await auth();
  const { data: template, error } = await getTemplateById(params.templateId);

  if (error || !template) {
    notFound();
  }

  // Check if user has permission to edit
  if (
    template.authorId !== session?.user?.id &&
    session?.user?.role !== 'ADMIN'
  ) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Edit Template</h1>
          <p className="text-muted-foreground">Update your template details</p>
        </div>
        <TemplateEditForm template={template} />
      </div>
    </div>
  );
}
