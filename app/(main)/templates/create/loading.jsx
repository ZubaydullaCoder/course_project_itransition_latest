
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CreateTemplateLoading() {
  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { label: 'Create Template', isCurrent: true },
  ];

  return (
    <PageSkeleton
      breadcrumbItems={breadcrumbItems}
      title="Create Template"
      description="Create a new template for your forms"
    >
      <Card className="p-6">
        <div className="space-y-8">
          {}
          <div className="flex items-center gap-4">
            <SkeletonWrapper width={160} height={160} className="rounded-lg" />
            <div className="space-y-2">
              <SkeletonWrapper width={120} height={40} />
              <SkeletonWrapper variant="text" width={140} />
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Enter the basic details of your template
              </p>
            </div>

            {}
            <div className="space-y-2">
              <div className="font-medium text-sm">Title</div>
              <SkeletonWrapper height={40} />
            </div>

            {}
            <div className="space-y-2">
              <div className="font-medium text-sm">Description</div>
              <SkeletonWrapper height={128} />
            </div>

            {}
            <div className="space-y-2">
              <div className="font-medium text-sm">Topic</div>
              <SkeletonWrapper height={40} />
            </div>

            {}
            <div className="space-y-2">
              <div className="font-medium text-sm">Tags</div>
              <SkeletonWrapper height={40} />
            </div>
          </div>

          <Separator />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Questions</h3>
              <p className="text-sm text-muted-foreground">
                Add questions to your template
              </p>
            </div>

            <div className="flex items-center justify-between">
              <SkeletonWrapper variant="subtitle" />
              <SkeletonWrapper width={140} height={40} />
            </div>

            {}
            {Array(2)
              .fill(null)
              .map((_, index) => (
                <Card key={index} className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                      <div className="space-y-2">
                        <div className="font-medium text-sm">Question Type</div>
                        <SkeletonWrapper height={40} />
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-sm">Description</div>
                        <SkeletonWrapper height={80} />
                      </div>
                      <div className="space-y-2">
                        <div className="font-medium text-sm">Options</div>
                        <SkeletonWrapper height={40} />
                      </div>
                    </div>
                    <SkeletonWrapper width={40} height={40} />
                  </div>
                </Card>
              ))}
          </div>

          <div className="flex items-center gap-4">
            <SkeletonWrapper width={100} height={40} />
            <SkeletonWrapper width={100} height={40} />
          </div>
        </div>
      </Card>
    </PageSkeleton>
  );
}
