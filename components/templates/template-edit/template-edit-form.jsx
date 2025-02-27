'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
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
import { TagInput } from '@/components/ui/tag-input';
import { QuestionsSection } from '@/components/questions/questions-section';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import { TemplateSchema } from '@/lib/utils/validators';
import { updateTemplate } from '@/lib/actions/template-actions';
import { UserSelect } from '@/components/templates/common/inputs/user-select';
import { ImageUpload } from '@/components/ui/image-upload';

export function TemplateEditForm({ template }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [questions, setQuestions] = useState(template.questions || []);
  const [hasChanges, setHasChanges] = useState(false);

  const originalQuestions = useMemo(
    () => JSON.stringify(template.questions || []),
    [template.questions]
  );

  const originalFormValues = useMemo(
    () => ({
      title: template.title,
      description: template.description || '',
      topic: template.topic,
      tags: template.tags?.join(',') || '',
      isPublic: template.isPublic,
      allowedUsers: template.allowedUsers
        ? template.allowedUsers.map((u) => u.email).join(',')
        : '',
      image: template.image || '',
    }),
    [template]
  );

  const form = useForm({
    resolver: zodResolver(TemplateSchema),
    defaultValues: { ...originalFormValues },
  });

  // Watch for changes in form values
  const formValues = form.watch();

  // Check for changes when form values or questions change
  useEffect(() => {
    // Helper function to normalize strings for comparison (trim whitespace)
    const normalizeString = (value) =>
      typeof value === 'string' ? value.trim() : value;

    const formChanged = Object.keys(originalFormValues).some((key) => {
      const originalValue = originalFormValues[key];
      const currentValue = formValues[key];

      if (key === 'allowedUsers') {
        const originalUsers = originalValue
          ? originalValue
              .split(',')
              .map((e) => e.trim())
              .filter(Boolean)
              .sort()
          : [];
        const currentUsers = currentValue
          ? currentValue
              .split(',')
              .map((e) => e.trim())
              .filter(Boolean)
              .sort()
          : [];
        return JSON.stringify(originalUsers) !== JSON.stringify(currentUsers);
      }

      return normalizeString(originalValue) !== normalizeString(currentValue);
    });

    const normalizedOriginalQuestions = JSON.parse(originalQuestions).map(
      (q) => ({
        ...q,
        text: q.text?.trim() || '',
        description: q.description?.trim() || '',
      })
    );

    const normalizedCurrentQuestions = questions.map((q) => ({
      ...q,
      text: q.text?.trim() || '',
      description: q.description?.trim() || '',
    }));

    // Compare normalized questions
    const questionsChanged =
      JSON.stringify(normalizedOriginalQuestions) !==
      JSON.stringify(normalizedCurrentQuestions);

    setHasChanges(formChanged || questionsChanged);
  }, [formValues, questions, originalFormValues, originalQuestions]);

  async function onSubmit(data) {
    // Identify questions with empty titles
    const emptyTitleQuestions = questions.filter((q) => !q.text?.trim());

    if (emptyTitleQuestions.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `${emptyTitleQuestions.length} question(s) are missing titles. All questions must have a title.`,
      });
      return;
    }

    const checkboxQuestionsWithoutOptions = questions.filter(
      (q) => q.type === 'CHECKBOX' && (!q.options || q.options.length === 0)
    );

    if (checkboxQuestionsWithoutOptions.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `${checkboxQuestionsWithoutOptions.length} checkbox question(s) are missing options. All checkbox questions must have at least one option.`,
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

      formData.append('id', template.id);

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append('questions', JSON.stringify(questions));

      const result = await updateTemplate(formData);

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
        description: 'Template updated successfully',
      });
      router.back();
      router.refresh();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Update the basic details of your template
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
                Add, remove, or reorder your template questions
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
            disabled={isLoading || isUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isUploading || !hasChanges}
          >
            {isLoading
              ? 'Saving...'
              : hasChanges
                ? 'Save Changes'
                : 'No Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
