import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserProfilePage } from '@/components/profile/user-profile-page';
import { PageContainer } from '@/components/layout/page-container';

export const metadata = {
  title: 'My Profile',
  description: 'View and manage your profile information',
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    return redirect('/auth/signin');
  }

  // Define breadcrumb items for this page
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { label: 'Profile', isCurrent: true },
  ];

  return (
    <PageContainer breadcrumbItems={breadcrumbItems}>
      <UserProfilePage user={session.user} />
    </PageContainer>
  );
}
