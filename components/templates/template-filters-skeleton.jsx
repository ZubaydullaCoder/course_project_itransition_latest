
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';

export function TemplateFiltersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SkeletonWrapper variant="subtitle" width={80} />
        <SkeletonWrapper height={36} />
      </div>

      <div className="space-y-2">
        <SkeletonWrapper variant="subtitle" width={60} />
        <div className="space-y-1">
          {Array(5)
            .fill(null)
            .map((_, index) => (
              <SkeletonWrapper key={index} height={28} />
            ))}
        </div>
      </div>

      <div className="space-y-2">
        <SkeletonWrapper variant="subtitle" width={70} />
        <div className="space-y-1">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <SkeletonWrapper key={index} height={28} />
            ))}
        </div>
      </div>

      <div className="space-y-2">
        <SkeletonWrapper variant="subtitle" width={60} />
        <div className="grid grid-cols-2 gap-2">
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <SkeletonWrapper key={index} height={28} />
            ))}
        </div>
      </div>
    </div>
  );
}
