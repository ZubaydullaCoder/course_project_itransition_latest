// app/(admin)/admin/users/page.jsx
import { DataTable } from '@/components/admin/users/data-table';
import { columns } from '@/components/admin/users/columns';
import { getUsers } from '@/lib/actions/admin-actions';

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">
          Manage user accounts and permissions
        </p>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
