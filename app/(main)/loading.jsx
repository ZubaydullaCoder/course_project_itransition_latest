
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function HomeLoading() {
  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Welcome to Forms App</h1>
        <p className="text-xl text-muted-foreground">
          Create and share forms, surveys, and quizzes
        </p>
      </div>

      <Separator />

      {}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Templates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={`latest-${i}`} className="rounded-lg border h-[380px]">
                <div className="relative w-full h-[180px]">
                  <Skeleton className="h-full w-full rounded-t-lg" />
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 mt-auto">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <Separator />

      {}
      <section>
        <h2 className="text-2xl font-bold mb-4">Most Popular Templates</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <div key={`popular-${i}`} className="rounded-lg border h-[380px]">
                <div className="relative w-full h-[180px]">
                  <Skeleton className="h-full w-full rounded-t-lg" />
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-4 mt-auto">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <Separator />

      {}
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Tags</h2>
        <div className="flex flex-wrap gap-2">
          {Array(8)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={`tag-${i}`} className="h-8 w-24" />
            ))}
        </div>
      </section>
    </div>
  );
}
