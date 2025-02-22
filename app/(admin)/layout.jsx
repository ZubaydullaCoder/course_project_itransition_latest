// app/(admin)/layout.jsx
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
