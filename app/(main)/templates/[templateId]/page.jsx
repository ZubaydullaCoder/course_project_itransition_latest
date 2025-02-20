import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getTemplateById } from '@/lib/actions/template-actions';
import { TemplateHeader } from '@/components/templates/template-header';
import { TemplateActions } from '@/components/templates/template-actions';
import { TemplateContent } from '@/components/templates/template-content';

export default async function TemplatePage({ params }) {
  const session = await auth();
  const { data: template, error } = await getTemplateById(params.templateId);

  if (error) {
    notFound();
  }

  const isOwner = template.author.id === session?.user?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  const canEdit = isOwner || isAdmin;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <TemplateHeader template={template} />
        {canEdit && <TemplateActions template={template} />}
      </div>
      <TemplateContent template={template} />
    </div>
  );
}
