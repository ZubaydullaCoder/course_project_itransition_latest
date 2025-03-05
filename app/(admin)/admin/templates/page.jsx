import { getAdminTemplates } from '@/lib/actions/admin-actions';
import { AdminDataTable } from '@/components/admin/data-table/admin-data-table';
import { adminTemplatesColumns } from '@/components/admin/templates/admin-templates-columns';
import { PageContainer } from '@/components/layout/page-container';

export default async function AdminTemplatesPage() {
  const result = await getAdminTemplates();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div className="text-destructive">Error: {result.error}</div>
      </div>
    );
  }

  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Admin' },
    { label: 'Templates', isCurrent: true },
  ];

  return (
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      title="Templates Management"
      description="View and manage all templates in the system"
    >
      <AdminDataTable
        columns={adminTemplatesColumns}
        data={result.data || []}
      />
    </PageContainer>
  );
}
