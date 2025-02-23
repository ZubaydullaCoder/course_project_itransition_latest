import { notFound } from 'next/navigation';
import { getTemplateWithQuestions } from '@/lib/actions/form-actions';
import { FormFill } from '@/components/forms/form-fill';

export default async function FormPage({ params }) {
  const { templateId } = await params;
  const result = await getTemplateWithQuestions(templateId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{result.data.title}</h1>
        {result.data.description && (
          <p className="text-muted-foreground">{result.data.description}</p>
        )}
      </div>
      <FormFill template={result.data} />
    </div>
  );
}
