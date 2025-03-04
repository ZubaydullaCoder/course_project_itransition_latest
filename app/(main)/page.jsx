import { auth } from '@/auth';
import {
  getLatestTemplates,
  getTopTemplates,
  getPopularTags,
} from '@/lib/actions/template-actions';
import { TemplateCarousel } from '@/components/home/templates/template-carousel';
import { TagCloud } from '@/components/home/tag-cloud';
import { Separator } from '@/components/ui/separator';
import { HomeSection } from '@/components/home/home-section';
import { PageContainer } from '@/components/layout/page-container';

export default async function HomePage() {
  const session = await auth();
  const latestTemplates = await getLatestTemplates(5);
  const topTemplates = await getTopTemplates(5);
  const popularTags = await getPopularTags();

  const breadcrumbItems = [{ href: '/', label: 'Home', isCurrent: true }];

  return (
    <PageContainer breadcrumbItems={breadcrumbItems}>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Welcome to Forms App</h1>
        {session?.user ? (
          <p className="text-xl text-muted-foreground">
            Welcome back, {session.user.name}!
          </p>
        ) : (
          <p className="text-xl text-muted-foreground">
            Create and share forms, surveys, and quizzes
          </p>
        )}
      </div>

      <Separator />

      <HomeSection title="Latest Templates">
        <TemplateCarousel templates={latestTemplates} count={5} />
      </HomeSection>

      <HomeSection title="Most Popular Templates">
        <TemplateCarousel templates={topTemplates} count={5} />
      </HomeSection>

      <HomeSection title="Popular Tags" showSeparator={false}>
        <TagCloud tags={popularTags} />
      </HomeSection>
    </PageContainer>
  );
}
