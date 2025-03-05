
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { Card } from '@/components/ui/card';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';

export default function AdminUsersLoadingPage() {
  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Admin' },
    { label: 'Users', isCurrent: true },
  ];

  return (
    <PageSkeleton
      breadcrumbItems={breadcrumbItems}
      title="Users Management"
      description="Manage user accounts and permissions"
    >
      <Card>
        {}
        <div className="flex items-center justify-between p-4 border-b">
          {}
          <div className="flex items-center gap-2">
            <SkeletonWrapper width={240} height={40} />
          </div>

          {}
          <div className="flex items-center gap-2">
            <SkeletonWrapper width={120} height={40} />
            <SkeletonWrapper width={44} height={40} className="rounded-md" />
          </div>
        </div>

        {}
        <div className="border-b">
          <div className="grid grid-cols-5 px-4 py-3">
            <SkeletonWrapper variant="text" width="60%" />
            <SkeletonWrapper variant="text" width="50%" />
            <SkeletonWrapper variant="text" width="40%" />
            <SkeletonWrapper variant="text" width="35%" />
            <SkeletonWrapper variant="text" width={80} className="ml-auto" />
          </div>
        </div>

        {}
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-5 items-center px-4 py-3 border-b"
            >
              <div className="flex items-center gap-2">
                <SkeletonWrapper variant="avatar" width={32} height={32} />
                <div>
                  <SkeletonWrapper variant="text" width={120} />
                  <SkeletonWrapper
                    variant="text"
                    width={160}
                    className="mt-1"
                    height={12}
                  />
                </div>
              </div>
              <div>
                <SkeletonWrapper variant="text" width="70%" />
              </div>
              <div>
                <SkeletonWrapper variant="text" width={80} />
              </div>
              <div>
                <SkeletonWrapper
                  width={80}
                  height={24}
                  className="rounded-full"
                />
              </div>
              <div className="flex justify-end gap-2">
                <SkeletonWrapper
                  width={34}
                  height={34}
                  className="rounded-md"
                />
                <SkeletonWrapper
                  width={34}
                  height={34}
                  className="rounded-md"
                />
                <SkeletonWrapper
                  width={34}
                  height={34}
                  className="rounded-md"
                />
              </div>
            </div>
          ))}

        {}
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <SkeletonWrapper width={140} height={20} />
          <div className="flex items-center gap-1">
            <SkeletonWrapper width={34} height={34} className="rounded-md" />
            <SkeletonWrapper width={34} height={34} className="rounded-md" />
            <SkeletonWrapper width={90} height={34} className="rounded-md" />
            <SkeletonWrapper width={34} height={34} className="rounded-md" />
            <SkeletonWrapper width={34} height={34} className="rounded-md" />
          </div>
        </div>
      </Card>
    </PageSkeleton>
  );
}
