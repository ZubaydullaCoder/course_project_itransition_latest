import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function FormLoading() {
  return (
    <div className="container max-w-2xl py-6 space-y-6">
      {}
      <div className="space-y-2">
        <Skeleton className="h-8 w-3/4" /> {}
        <Skeleton className="h-5 w-full" /> {}
      </div>

      {}
      <div className="space-y-8">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <Card key={index} className="p-6 space-y-4">
              {}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-2/3" /> {}
                  <Skeleton className="h-5 w-20" /> {}
                </div>
                <Skeleton className="h-4 w-3/4" /> {}
              </div>
              {}
              <Skeleton className="h-10 w-full" /> {}
            </Card>
          ))}

        {}
        <Skeleton className="h-10 w-24 mt-6" />
      </div>
    </div>
  );
}
