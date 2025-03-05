// app/(main)/profile/loading.jsx
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { UserProfileSkeleton } from '@/components/profile/user-profile-skeleton';

export default function ProfileLoading() {
  // Define static breadcrumb items for this page
  // We don't know if it's admin view yet, so use the default breadcrumb
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
