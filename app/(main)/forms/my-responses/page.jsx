// app/(main)/forms/my-responses/page.jsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUserResponses } from '@/lib/actions/form-actions';
import { ResponsesTable } from '@/components/forms/responses-table';

export default async function MyResponsesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const responses = await getUserResponses();

  return (
    <div className="container max-w-5xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Form Responses</h1>
        <p className="text-muted-foreground">
          View and manage your form submissions
        </p>
      </div>

      <ResponsesTable responses={responses} />
    </div>
  );
}
