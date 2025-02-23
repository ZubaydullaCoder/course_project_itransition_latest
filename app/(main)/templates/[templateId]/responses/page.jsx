import { notFound } from 'next/navigation';
import { getTemplateWithResponses } from '@/lib/actions/form-actions';
import { ResponsesList } from '@/components/responses/responses-list';

export default async function ResponsesPage({ params }) {
  const { templateId } = await params;
  const result = await getTemplateWithResponses(templateId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {result.data.title} - Responses
          </h1>
          <p className="text-muted-foreground">
            View and manage form responses
          </p>
        </div>
      </div>
      <ResponsesList
        templateId={templateId}
        initialResponses={result.data.responses}
        questions={result.data.questions}
      />
    </div>
  );
}
