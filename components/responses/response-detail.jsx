'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { deleteResponse } from '@/lib/actions/form-actions';
import { Badge } from '@/components/ui/badge';
import { useSession } from 'next-auth/react';

export function ResponseDetail({ templateId, response }) {
  const router = useRouter();
  const { toast } = useToast();
  const session = useSession();
  const isAuthor = session?.data?.user?.id === response.userId;
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  console.log({ response });
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const result = await deleteResponse(response.id);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      toast({
        title: 'Success',
        description: result.success,
      });
      router.push(`/templates/${templateId}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete response',
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const getAnswerValue = (questionId) => {
    const answer = response.answers.find((a) => a.questionId === questionId);
    if (!answer?.value) return '-';

    // Format based on question type
    const question = response.template.questions.find(
      (q) => q.id === questionId
    );
    switch (question?.type) {
      case 'checkbox':
        return answer.value === 'true' ? 'Yes' : 'No';
      case 'integer':
        return parseInt(answer.value).toLocaleString();
      default:
        return answer.value;
    }
  };

  return (
    <>
      <Card className="p-6 space-y-6">
        {/* Header with user info and submission date */}
        <div>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium">{response.user.name}</h2>
              <p className="text-sm text-muted-foreground">
                {response.user.email}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Submitted on {format(new Date(response.createdAt), 'PPP')}
              </p>
              {response.updatedAt !== response.createdAt && (
                <p className="text-sm text-muted-foreground">
                  Updated on {format(new Date(response.updatedAt), 'PPP')}
                </p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Questions and Answers */}
        <div className="space-y-6">
          {response.template.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{question.text}</h3>
                <Badge variant="secondary" className="text-xs">
                  {question.type.replace('_', ' ')}
                </Badge>
              </div>
              {question.description && (
                <p className="text-sm text-muted-foreground">
                  {question.description}
                </p>
              )}
              <p className="text-sm p-3 bg-muted rounded-md">
                {getAnswerValue(question.id)}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Back
        </Button>

        {/* Show edit button only to response author */}
        {isAuthor && (
          <Button asChild>
            <Link href={`/forms/${templateId}`} className="gap-2">
              Edit Response
            </Link>
          </Button>
        )}

        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isLoading}
        >
          Delete Response
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              response.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? 'Deleting...' : 'Delete Response'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
