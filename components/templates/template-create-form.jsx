'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuestionsSection } from '@/components/questions/questions-section';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import { TemplateSchema } from '@/lib/utils/validators';
import { createTemplate } from '@/lib/actions/template-actions';
import { TagInput } from '../ui/tag-input';
import { UserSelect } from '@/components/templates/user-select';
import { ImageUpload } from '@/components/ui/image-upload';

export function TemplateCreateForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Add this state
  const [questions, setQuestions] = useState([]);

  const form = useForm({
    resolver: zodResolver(TemplateSchema),
    defaultValues: {
      title: '',
      description: '',
      topic: '',
      tags: '',
      isPublic: false,
      allowedUsers: '', // Add new field
      questions: [],
      image: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data) {
    // Validate questions first
    const hasEmptyQuestionTitle = questions.some((q) => !q.text?.trim());
    if (hasEmptyQuestionTitle) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'All questions must have a title',
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please add at least one question',
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      // Add basic info as strings
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('topic', data.topic);
      formData.append('tags', data.tags || '');
      formData.append('isPublic', String(data.isPublic));
      formData.append(
        'allowedUsers',
        data.isPublic ? '' : data.allowedUsers || ''
      );
      formData.append('image', data.image || '');
      // Add questions as JSON string
      formData.append('questions', JSON.stringify(questions));

      const result = await createTemplate(formData);

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
        description: 'Template created successfully',
      });
      router.push('/templates');
    } catch (error) {
      console.error('Template creation error:', error);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Provide basic details about your template
              </p>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>
                    Give your template a clear and descriptive title
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isLoading} />
                  </FormControl>
                  <FormDescription>
                    Describe what this template is for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TEMPLATE_TOPICS.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagInput
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    Add up to 5 tags (press Enter or comma to add)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">
                    Make this template public
                  </FormLabel>
                </FormItem>
              )}
            />

            {/* Add restricted access field */}
            {!form.watch('isPublic') && (
              <FormField
                control={form.control}
                name="allowedUsers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowed Users</FormLabel>
                    <FormControl>
                      <UserSelect
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>
                      Select users who can access this template
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      onUploadingChange={setIsUploading} // Add this prop
                    />
                  </FormControl>
                  <FormDescription>
                    Add an optional image for your template
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Questions</h3>
              <p className="text-sm text-muted-foreground">
                Add and organize your template questions
              </p>
            </div>

            <QuestionsSection value={questions} onChange={setQuestions} />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading || isUploading} // Update disable condition
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {' '}
            {/* Update disable condition */}
            {isLoading ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
