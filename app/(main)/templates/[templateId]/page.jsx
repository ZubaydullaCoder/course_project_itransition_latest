import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { getTemplateById } from '@/lib/actions/template-actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { QUESTION_TYPE_LABELS } from '@/lib/constants/questions';
import {
  CommentForm,
  CommentList,
} from '@/components/templates/template-comments';
import { TemplateLikeButton } from '@/components/templates/template-like-button';

export default async function TemplatePage({ params }) {
  const { templateId } = await params;
  const session = await auth();
  const { data: template, error } = await getTemplateById(templateId);

  if (error || !template) {
    notFound();
  }

  const isOwner = template.author.id === session?.user?.id;

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{template.title}</h1>
          <p className="text-muted-foreground">{template.description}</p>
          <p className="text-sm text-muted-foreground">
            Created by {template.author.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/forms/${template.id}`}>Fill Out</Link>
          </Button>
          {isOwner && (
            <Button variant="outline" asChild>
              <Link href={`/templates/${template.id}/edit`}>Edit Template</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <TemplateLikeButton
          templateId={template.id}
          initialLiked={(template.likes ?? []).length > 0}
          likeCount={template._count?.likes ?? 0}
        />
      </div>

      <Separator />

      {/* Questions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Questions</h2>
        {template.questions.map((question, index) => (
          <Card key={question.id} className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {index + 1}. {question.text}
                  </p>
                  {question.description && (
                    <p className="text-sm text-muted-foreground">
                      {question.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary">
                  {QUESTION_TYPE_LABELS[question.type]}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Comments</h2>
        {session?.user ? (
          <CommentForm templateId={template.id} />
        ) : (
          <p className="text-center text-muted-foreground">
            Please sign in to comment
          </p>
        )}
        <CommentList comments={template.comments} />
      </div>
    </div>
  );
}
