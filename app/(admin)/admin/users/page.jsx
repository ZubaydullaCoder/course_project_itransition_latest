

import { getUsers } from '@/lib/actions/admin-actions';

import { AdminDataTable } from '@/components/admin/data-table/admin-data-table';
import { usersTableColumns } from '@/components/admin/users/users-table-columns';
import { Heading } from '@/components/ui/heading';

export default async function UsersPage() {
  const result = await getUsers();

  if (result.error) {
    return (
      <div className="space-y-6">
        <div className="text-destructive">Error: {result.error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Heading
        title="Users Management"
        description="Manage user accounts and permissions"
      />
      <AdminDataTable columns={usersTableColumns} data={result.data || []} />
    </div>
  );
}
