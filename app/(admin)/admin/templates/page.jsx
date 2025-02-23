// app/(admin)/admin/templates/page.jsx
import { getAdminTemplates } from '@/lib/actions/admin-actions';
import { AdminDataTable } from '@/components/admin/data-table/admin-data-table';
import { adminTemplatesColumns } from '@/components/admin/templates/admin-templates-columns';
import { Heading } from '@/components/ui/heading';

export default async function AdminTemplatesPage() {
  const result = await getAdminTemplates();

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
        title="Templates Management"
        description="View and manage all templates in the system"
      />
      <AdminDataTable
        columns={adminTemplatesColumns}
        data={result.data || []}
      />
    </div>
  );
}
