import { auth } from '@/auth';
import {
  getLatestTemplates,
  getTopTemplates,
  getPopularTags,
} from '@/lib/actions/template-actions';
import { TemplateCarousel } from '@/components/templates/template-carousel';
import { TagCloud } from '@/components/templates/tag-cloud';
import { Separator } from '@/components/ui/separator';

export default async function HomePage() {
  const session = await auth();
  const latestTemplates = await getLatestTemplates(5); // Get 5 latest templates
  const topTemplates = await getTopTemplates(5); // Get top 5 by form submissions
  const popularTags = await getPopularTags();

  return (
    <div className="container max-w-7xl py-6 space-y-8">
      {/* Welcome Section */}
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

      {/* Latest Templates */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Latest Templates</h2>
        <TemplateCarousel templates={latestTemplates} />
      </section>

      <Separator />

      {/* Popular Templates */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Most Popular Templates</h2>
        <TemplateCarousel templates={topTemplates} />
      </section>

      <Separator />

      {/* Tag Cloud */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Popular Tags</h2>
        <TagCloud tags={popularTags} />
      </section>
    </div>
  );
}
