// components/templates/template-comments.jsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { addComment } from '@/lib/actions/template-social-actions';
import { formatDate } from '@/lib/utils';

export function CommentForm({ templateId }) {
  const router = useRouter();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await addComment(templateId, content);
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        return;
      }

      setContent('');
      router.refresh();
      toast({
        title: 'Success',
        description: 'Comment added successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading || !content.trim()}>
        {isLoading ? 'Adding...' : 'Add Comment'}
      </Button>
    </form>
  );
}

export function CommentList({ comments }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="border-b pb-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{comment.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(comment.createdAt)}
              </p>
            </div>
          </div>
          <p className="mt-2">{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
