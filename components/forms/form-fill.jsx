'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { FormQuestion } from './form-question';
import { QUESTION_TYPES } from '@/lib/constants/questions';
import { Separator } from '@/components/ui/separator';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalValues, setOriginalValues] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const searchParams = useSearchParams();
  const responseId = searchParams.get('responseId');
  const validationSchema = createFormResponseSchema(template.questions);

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: template.questions.reduce((acc, question) => {
      acc[question.id] =
        question.type === QUESTION_TYPES.CHECKBOX ? 'false' : '';
      return acc;
    }, {}),
    mode: 'onSubmit',
  });

  
  const formValues = form.watch();

  useEffect(() => {
    async function checkResponse() {
      const result = await checkExistingResponse(template.id, responseId);
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

        // Store normalized original values
        const normalizedValues = Object.entries(values).reduce(
          (acc, [key, value]) => {
            acc[key] = typeof value === 'string' ? value.trim() : value;
            return acc;
          },
          {}
        );

        setOriginalValues(normalizedValues);
        form.reset(values);
      }
      setIsLoading(false);
    }
    checkResponse();
  }, [template.id, form, template.questions, responseId]);

  
  useEffect(() => {
    if (!existingResponse) {
      
      setHasChanges(true);
      return;
    }

    
    const hasChanged = Object.keys(formValues).some((key) => {
      const original = originalValues[key];
      const current = formValues[key];

      
      const normalizedOriginal =
        typeof original === 'string' ? original.trim() : original;
      const normalizedCurrent =
        typeof current === 'string' ? current.trim() : current;

      return normalizedOriginal !== normalizedCurrent;
    });

    setHasChanges(hasChanged);
  }, [formValues, originalValues, existingResponse]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
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

      router.push(
        `/forms/thank-you?responseId=${result.data.id}&templateId=${template.id}`
      );
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit form',
      });
    } finally {
      setIsSubmitting(false);
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
          {template.questions.map((question, index) => (
            <div key={question.id} className="space-y-6">
              {index > 0 && <Separator className="my-6" />}
              <FormQuestion question={question} control={form.control} />
            </div>
          ))}

          <Separator className="my-6" />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (existingResponse && !hasChanges)}
            >
              {isSubmitting
                ? existingResponse
                  ? 'Updating...'
                  : 'Submitting...'
                : existingResponse
                  ? 'Update Response'
                  : 'Submit'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
