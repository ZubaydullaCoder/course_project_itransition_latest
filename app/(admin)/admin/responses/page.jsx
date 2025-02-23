// app/(admin)/admin/responses/page.jsx

import { Heading } from '@/components/ui/heading';

export default async function AdminResponsesPage() {
  return (
    <div className="space-y-6">
      <Heading
        title="Form Responses Management"
        description="View and manage all form responses in the system"
      />
    </div>
  );
}
