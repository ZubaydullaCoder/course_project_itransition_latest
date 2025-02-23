'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { FormQuestion } from './form-question';
import { QUESTION_TYPES } from '@/lib/constants/questions';
import {
  checkExistingResponse,
  submitFormResponse,
} from '@/lib/actions/form-actions';
import { createFormResponseSchema } from '@/lib/utils/validators';

export function FormFill({ template }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [existingResponse, setExistingResponse] = useState(null);

  // Create validation schema
  const validationSchema = createFormResponseSchema(template.questions);

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: template.questions.reduce((acc, question) => {
      acc[question.id] =
        question.type === QUESTION_TYPES.CHECKBOX ? 'false' : '';
      return acc;
    }, {}),
    mode: 'onSubmit',
  });

  useEffect(() => {
    async function checkResponse() {
      const result = await checkExistingResponse(template.id);
      if (result.data) {
        setExistingResponse(result.data);
        const values = template.questions.reduce((acc, question) => {
          acc[question.id] =
            question.type === QUESTION_TYPES.CHECKBOX ? 'false' : '';
          return acc;
        }, {});
        result.data.answers.forEach((answer) => {
          values[answer.questionId] = answer.value;
        });
        form.reset(values);
      }
      setIsLoading(false);
    }
    checkResponse();
  }, [template.id, form, template.questions]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const result = await submitFormResponse(template.id, formData);

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

      router.push('/forms/thank-you');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit form',
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">Loading form...</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {template.questions.map((question) => (
            <FormQuestion
              key={question.id}
              question={question}
              control={form.control}
            />
          ))}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit">
              {existingResponse ? 'Update Response' : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
