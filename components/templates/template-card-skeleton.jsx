
'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';

export function TemplateCardSkeleton() {
  return (
    <Card className="h-[380px] flex flex-col overflow-hidden">
      {}
      <div className="w-full h-[170px] relative">
        <SkeletonWrapper className="absolute inset-0" />
      </div>

      {}
      <div className="h-[9.5rem]">
        <CardHeader className="px-3 py-2 space-y-2">
          {}
          <div className="flex items-start justify-between gap-2">
            <SkeletonWrapper variant="title" height={20} className="flex-1" />
            <SkeletonWrapper width={16} height={16} className="flex-shrink-0" />
          </div>

          {}
          <div className="flex items-center justify-between text-sm">
            <SkeletonWrapper width={80} height={16} />
            <SkeletonWrapper width={60} height={12} />
          </div>

          {}
          <div className="flex items-center gap-1">
            <SkeletonWrapper width={16} height={16} className="rounded-full" />
            <SkeletonWrapper width={120} height={14} />
          </div>
        </CardHeader>

        <CardContent className="px-3 py-1">
          {}
          <div className="flex justify-between items-center gap-2">
            <SkeletonWrapper width={60} height={20} className="rounded-full" />
            <SkeletonWrapper width={80} height={14} />
          </div>
        </CardContent>
      </div>

      {}
      <CardFooter className="mt-auto flex gap-2 items-center justify-between px-2 border-t py-1">
        {}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-0.5">
            {[1, 2, 3].map((i) => (
              <SkeletonWrapper
                key={i}
                width={40 + i * 10}
                height={20}
                className="rounded-full"
              />
            ))}
          </div>
        </div>

        {}
        <SkeletonWrapper
          width={32}
          height={32}
          className="flex-shrink-0 rounded-full"
        />
      </CardFooter>
    </Card>
  );
}
