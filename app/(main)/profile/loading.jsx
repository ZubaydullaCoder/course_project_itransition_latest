
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { UserProfileSkeleton } from '@/components/profile/user-profile-skeleton';

export default function ProfileLoading() {
  
  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { label: 'Profile', isCurrent: true },
  ];

  return (
    <PageSkeleton
      breadcrumbItems={breadcrumbItems}
      title="Profile"
      description="View and manage profile information"
    >
      <UserProfileSkeleton />
    </PageSkeleton>
  );
}
