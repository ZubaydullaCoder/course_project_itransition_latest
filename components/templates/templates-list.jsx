import { auth } from '@/auth';
import { TemplateCard } from '@/components/templates/template-card';

export async function TemplatesList({ templates }) {
  const session = await auth();

  if (templates.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No templates found
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          isOwner={template.authorId === session?.user?.id}
        />
      ))}
    </div>
  );
}
