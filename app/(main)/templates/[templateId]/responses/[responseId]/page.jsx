import { notFound } from 'next/navigation';
import { getResponseDetails } from '@/lib/actions/form-actions';
import { ResponseDetail } from '@/components/responses/response-detail';

export default async function ResponseDetailPage({ params }) {
  const { templateId, responseId } = await params;
  const result = await getResponseDetails(templateId, responseId);
  console.log({ result });
  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{result.data.template.title}</h1>
        <p className="text-muted-foreground">Response Details</p>
      </div>
      <ResponseDetail templateId={templateId} response={result.data} />
    </div>
  );
}
