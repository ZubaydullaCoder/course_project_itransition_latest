import { auth } from '@/auth';
import { TemplateCard } from '@/components/templates/template-card';

export async function TemplatesList({ templates }) {
  const session = await auth();
  const isAdmin = session?.user?.role === 'ADMIN';

  if (templates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No templates found
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {' '}
      {/* Adjust grid and gap */}
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isOwner={template.authorId === session?.user?.id}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
