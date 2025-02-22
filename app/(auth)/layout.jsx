import { auth } from '@/auth';
import { redirect } from 'next/navigation';
// import { AuthLayout } from '@/components/layouts/auth-layout';
import Image from 'next/image';
import { AuthLayout } from '@/components/layout/auth-layout';

export default async function AuthRootLayout({ children }) {
  const session = await auth();

  if (session?.user) {
    redirect('/');
  }

  return <AuthLayout>{children}</AuthLayout>;
}
