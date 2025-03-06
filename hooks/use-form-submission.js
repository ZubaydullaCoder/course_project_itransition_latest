'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function useFormSubmission(options = {}) {
  const {
    successMessage = 'Operation completed successfully',
    redirectPath,
    shouldRefreshPage = false,
    shouldNavigateBack = false,
  } = options;

  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (submitFn, data, options = {}) => {
    const {
      onSuccess,
      customSuccessMessage,
      customErrorMessage = 'Something went wrong',
      customRedirect,
    } = options;

    setIsSubmitting(true);

    try {
      const result = await submitFn(data);

      // In your form submission handler
      if (result.isDuplicate) {
        toast({
          title: 'Connected to Salesforce',
          description:
            'Your information was matched with existing Salesforce records',
        });
      } else {
        toast({
          title: 'Connected to Salesforce',
          description:
            'New records were created in Salesforce with your information',
        });
      }

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
        setIsSubmitting(false);
        return false;
      }

      toast({
        title: 'Success',
        description: customSuccessMessage || successMessage,
      });

      if (onSuccess) {
        await onSuccess(result);
      }

      if (shouldRefreshPage) {
        router.refresh();
      }

      if (customRedirect) {
        router.push(customRedirect);
      } else if (redirectPath) {
        router.push(redirectPath);
      } else if (shouldNavigateBack) {
        router.back();
      }

      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: customErrorMessage,
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
