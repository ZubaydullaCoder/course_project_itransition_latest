// app/(main)/loading.jsx
import { PageSkeleton } from '@/components/ui/page-skeleton';
import { TemplateCarouselSkeleton } from '@/components/home/templates/template-carousel-skeleton';
import { TagCloudSkeleton } from '@/components/home/tag-cloud-skeleton';
import { Separator } from '@/components/ui/separator';
import { HomeSection } from '@/components/home/home-section';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';

export default function HomePageLoading() {
  const breadcrumbItems = [{ href: '/', label: 'Home', isCurrent: true }];

  return (
    <PageSkeleton
      breadcrumbItems={breadcrumbItems}
      title={false}
      description={false}
    >
      <div className="text-center space-y-2 mb-6">
        {' '}
        {/* Added mb-6 to match spacing */}
        <h1 className="text-4xl font-bold">Welcome to Forms App</h1>
        <div className="flex justify-center pt-1">
          {' '}
          {/* Added pt-1 for better alignment */}
          <SkeletonWrapper width={300} height={26} />{' '}
          {/* Adjusted height from 24 to 26 */}
        </div>
      </div>

      <Separator />

      <HomeSection title="Latest Templates">
        <TemplateCarouselSkeleton count={5} />
      </HomeSection>

      <HomeSection title="Most Popular Templates">
        <TemplateCarouselSkeleton count={5} />
      </HomeSection>

      <HomeSection title="Popular Tags" showSeparator={false}>
        <TagCloudSkeleton />
      </HomeSection>
    </PageSkeleton>
  );
}
