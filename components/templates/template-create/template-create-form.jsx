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
import { TagInput } from '../../ui/tag-input';
import { ImageUpload } from '@/components/ui/image-upload';
import { UserSelect } from '../common/inputs/user-select';
import { useFormSubmission } from '@/hooks/use-form-submission';

export function TemplateCreateForm() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Use the custom form submission hook
  const { isSubmitting, handleSubmit } = useFormSubmission({
    successMessage: 'Template created successfully',
    redirectPath: '/templates',
  });

  // Create a single variable for disabled state
  const isDisabled = isSubmitting || isUploading;

  const form = useForm({
    resolver: zodResolver(TemplateSchema),
    defaultValues: {
      title: '',
      description: '',
      topic: '',
      tags: '',
      isPublic: true,
      allowedUsers: '',
      questions: [],
      image: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(data) {
    // Validate questions first
    const emptyTitleQuestions = questions.filter((q) => !q.text?.trim());

    if (emptyTitleQuestions.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `${emptyTitleQuestions.length} question(s) are missing titles. All questions must have a title.`,
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

    // Create submission function
    const submitTemplate = async (formData) => {
      const fd = new FormData();

      fd.append('title', formData.title);
      fd.append('description', formData.description || '');
      fd.append('topic', formData.topic);
      fd.append('tags', formData.tags || '');
      fd.append('isPublic', String(formData.isPublic));
      fd.append(
        'allowedUsers',
        formData.isPublic ? '' : formData.allowedUsers || ''
      );
      fd.append('image', formData.image || '');
      fd.append('questions', JSON.stringify(questions));

      return await createTemplate(fd);
    };

    // Use our custom hook
    await handleSubmit(submitTemplate, data);
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
                    <Input {...field} disabled={isDisabled} />
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
                    <Textarea {...field} disabled={isDisabled} />
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
                    disabled={isDisabled}
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
                      disabled={isDisabled}
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
                      disabled={isDisabled}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0">
                    Make this template public
                  </FormLabel>
                </FormItem>
              )}
            />

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
                        disabled={isDisabled}
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
                      disabled={isDisabled}
                      onUploadingChange={setIsUploading}
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

            <QuestionsSection
              value={questions}
              onChange={setQuestions}
              disabled={isDisabled}
            />
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isDisabled}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isDisabled}>
            {isSubmitting ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
