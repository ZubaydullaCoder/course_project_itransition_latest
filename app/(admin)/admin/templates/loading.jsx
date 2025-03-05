
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { Card } from '@/components/ui/card';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';

export default function AdminTemplatesLoading() {
  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/admin', label: 'Admin' },
    { label: 'Templates', isCurrent: true },
  ];

  return (
    <PageSkeleton
      breadcrumbItems={breadcrumbItems}
      title="Templates Management"
      description="View and manage all templates in the system"
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
          <div className="flex items-center h-10 px-4">
            <div className="flex-1 grid grid-cols-5 gap-2">
              <SkeletonWrapper height={16} className="w-[80%]" />
              <SkeletonWrapper height={16} className="w-[70%]" />
              <SkeletonWrapper height={16} className="w-[60%]" />
              <SkeletonWrapper height={16} className="w-[50%]" />
              <SkeletonWrapper height={16} className="w-[40%]" />
            </div>
          </div>
        </div>

        {}
        <div>
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <div key={index} className="border-b px-4 py-4">
                <div className="grid grid-cols-5 gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <SkeletonWrapper
                      width={36}
                      height={36}
                      className="rounded-md"
                    />
                    <div className="space-y-1">
                      <SkeletonWrapper width={160} height={16} />
                      <SkeletonWrapper width={100} height={14} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <SkeletonWrapper width={120} height={16} />
                    <SkeletonWrapper width={80} height={14} />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonWrapper
                      width={60}
                      height={24}
                      className="rounded-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <SkeletonWrapper width={80} height={16} />
                    <SkeletonWrapper width={50} height={14} />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <SkeletonWrapper
                      width={36}
                      height={36}
                      className="rounded-md"
                    />
                    <SkeletonWrapper
                      width={36}
                      height={36}
                      className="rounded-md"
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>

        {}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <SkeletonWrapper width={100} height={20} />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonWrapper width={36} height={36} className="rounded-md" />
            <SkeletonWrapper width={36} height={36} className="rounded-md" />
            <SkeletonWrapper width={36} height={36} className="rounded-md" />
            <SkeletonWrapper width={36} height={36} className="rounded-md" />
          </div>
        </div>
      </Card>
    </PageSkeleton>
  );
}
