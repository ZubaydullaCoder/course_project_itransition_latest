import { getUsers } from '@/lib/actions/admin-actions';
import { AdminDataTable } from '@/components/admin/data-table/admin-data-table';
import { usersTableColumns } from '@/components/admin/users/users-table-columns';
import { PageContainer } from '@/components/layout/page-container';

export default async function UsersPage() {
  const result = await getUsers();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div className="text-destructive">Error: {result.error}</div>
      </div>
    );
  }

  // Define breadcrumb items for this page
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Admin' },
    { label: 'Users', isCurrent: true },
  ];

  return (
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      title="Users Management"
      description="Manage user accounts and permissions"
    >
      <AdminDataTable columns={usersTableColumns} data={result.data || []} />
    </PageContainer>
  );
}
