import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
} from '@/lib/constants/questions';
import {
  CommentForm,
  CommentList,
} from '@/components/templates/template-comments';
import { TemplateLikeButton } from '@/components/templates/template-like-button';
import { CheckCircle } from 'lucide-react'; // Import CheckCircle icon for option bullets

export function TemplateOverviewTab({
  template,
  userResponse,
  session,
  templateId,
  canEdit,
  inTabView = true,
}) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Template Details</h3>
            <p className="text-sm text-muted-foreground">
              Created by {template.author.name}
            </p>
            {template.topic && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{template.topic}</Badge>
              </div>
            )}
            {template.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <div className="pt-2">
              <TemplateLikeButton
                templateId={template.id}
                initialLiked={(template.likes ?? []).length > 0}
                likeCount={template._count?.likes ?? 0}
              />
            </div>
          </div>

          {}
          <div className="flex gap-2">
            {}
            {!inTabView && userResponse ? (
              <Button asChild>
                <Link
                  href={`/templates/${templateId}/responses/${userResponse.id}`}
                >
                  View Your Response
                </Link>
              </Button>
            ) : (
              !inTabView && (
                <Button asChild>
                  <Link href={`/forms/${template.id}`}>Fill Out</Link>
                </Button>
              )
            )}

            {}
            {canEdit && (
              <Button variant="outline" asChild>
                <Link href={`/templates/${template.id}/edit`}>
                  Edit Template
                </Link>
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Questions</h3>
            <p className="text-sm text-muted-foreground">
              This template contains {template.questions.length} question
              {template.questions.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4">
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

                      {/* Display options for checkbox questions with multiple options */}
                      {question.type === QUESTION_TYPES.CHECKBOX &&
                        question.options &&
                        question.options.length >= 2 && (
                          <div className="mt-2 pl-2 border-l-2 border-muted">
                            <p className="text-sm text-muted-foreground mb-1">
                              Options:
                            </p>
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center gap-2 text-sm"
                                >
                                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                  <span>{option}</span>
                                </div>
                              ))}
                            </div>
                          </div>
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
        </div>

        <Separator />

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Comments</h3>
            <p className="text-sm text-muted-foreground">
              Share your thoughts about this template
            </p>
          </div>

          {session?.user ? (
            <CommentForm templateId={template.id} />
          ) : (
            <Card className="p-4">
              <p className="text-center text-muted-foreground">
                Please sign in to comment
              </p>
            </Card>
          )}
          <CommentList comments={template.comments} />
        </div>
      </div>
    </Card>
  );
}
