import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAdminResponses } from '@/lib/actions/admin-actions';
import { AdminResponsesTable } from '@/components/admin/responses/admin-responses-table';
import { PageContainer } from '@/components/layout/page-container';

export default async function AdminResponsesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const { data, error } = await getAdminResponses();

  if (error) {
    throw new Error(error);
  }

  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Admin' },
    { label: 'Responses', isCurrent: true },
  ];

  return (
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      title="Form Responses Management"
      description="View and manage all form responses in the system"
    >
      <AdminResponsesTable initialResponses={data} />
    </PageContainer>
  );
}
