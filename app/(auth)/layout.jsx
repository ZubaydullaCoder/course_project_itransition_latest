import { auth } from '@/auth';
import { redirect } from 'next/navigation';

import { AuthLayout } from '@/components/layout/auth-layout';

export default async function AuthRootLayout({ children }) {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }

  return (
    <AuthLayout>
      <div className="flex h-full items-center justify-center bg-background overflow-hidden">
        {children}
      </div>
    </AuthLayout>
  );
}
