
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function TemplatePageLoading() {
  
  const breadcrumbItems = [
    { href: '/', label: 'Home' },
    { href: '/templates', label: 'Templates' },
    { label: <SkeletonWrapper width={150} height={16} />, isCurrent: true },
  ];

  return (
    <PageSkeleton breadcrumbItems={breadcrumbItems} maxWidth="3xl">
      <div className="space-y-4">
        {}
        <div>
          <SkeletonWrapper variant="title" height={32} className="mb-2" />
          <SkeletonWrapper variant="text" width="90%" />
        </div>

        {}
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

          {}
          <TabsContent value="preview" className="mt-4 space-y-4">
            {}
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

            {}
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

                      {}
                      <div className="pt-2">
                        {i % 2 === 0 ? (
                          
                          <SkeletonWrapper height={40} />
                        ) : (
                          
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

            {}
            <div className="flex justify-end mt-6">
              <SkeletonWrapper width={120} height={40} />
            </div>
          </TabsContent>

          {}
          <TabsContent value="responses" className="hidden">
            {}
          </TabsContent>

          <TabsContent value="settings" className="hidden">
            {}
          </TabsContent>
        </Tabs>
      </div>
    </PageSkeleton>
  );
}
