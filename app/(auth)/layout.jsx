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
      <div className="min-h-screen flex items-center justify-center bg-background">
        {children}
      </div>
    </AuthLayout>
  );
}
