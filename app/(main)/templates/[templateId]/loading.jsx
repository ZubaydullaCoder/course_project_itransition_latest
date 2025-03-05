// app/(main)/templates/[templateId]/loading.jsx
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function TemplatePageLoading() {
  // Define breadcrumb items for this page with a skeleton for the template title
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { label: <SkeletonWrapper width={150} height={16} />, isCurrent: true },
  ];

  return (
    <PageSkeleton breadcrumbItems={breadcrumbItems} maxWidth="3xl">
      <div className="space-y-4">
        {/* Title and Description */}
        <div>
          <SkeletonWrapper variant="title" height={32} className="mb-2" />
          <SkeletonWrapper variant="text" width="90%" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="cursor-default">
              Preview
            </TabsTrigger>
            <TabsTrigger value="responses" className="cursor-default">
              Responses
            </TabsTrigger>
            <TabsTrigger value="settings" className="cursor-default">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Preview Tab Content */}
          <TabsContent value="preview" className="mt-4 space-y-4">
            {/* Form Header */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <SkeletonWrapper variant="title" width={200} />
                    <SkeletonWrapper width={80} height={40} />
                  </div>
                  <SkeletonWrapper variant="text" width="70%" />
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2 w-full">
                          <SkeletonWrapper variant="subtitle" width="40%" />
                          <SkeletonWrapper variant="text" width="90%" />
                        </div>
                        <SkeletonWrapper width={24} height={24} />
                      </div>

                      {/* Input field or options */}
                      <div className="pt-2">
                        {i % 2 === 0 ? (
                          // Text input skeleton
                          <SkeletonWrapper height={40} />
                        ) : (
                          // Options skeleton
                          <div className="space-y-3">
                            {Array(3)
                              .fill(null)
                              .map((_, j) => (
                                <div
                                  key={j}
                                  className="flex items-center gap-2"
                                >
                                  <SkeletonWrapper
                                    width={18}
                                    height={18}
                                    className="rounded-full"
                                  />
                                  <SkeletonWrapper width="60%" height={20} />
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <SkeletonWrapper width={120} height={40} />
            </div>
          </TabsContent>

          {/* Hidden Content for Other Tabs - They will be shown on actual tab selection */}
          <TabsContent value="responses" className="hidden">
            {/* Content is hidden during loading */}
          </TabsContent>

          <TabsContent value="settings" className="hidden">
            {/* Content is hidden during loading */}
          </TabsContent>
        </Tabs>
      </div>
    </PageSkeleton>
  );
}
