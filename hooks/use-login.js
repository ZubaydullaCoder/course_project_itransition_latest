// hooks/use-login.js
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn, useSession } from 'next-auth/react';
import { LoginSchema } from '@/lib/utils/validators';
import { useFormSubmission } from '@/hooks/use-form-submission';

/**
 * Custom hook for managing login form state and submission
 * @returns {Object} Login form utilities and state
 */
export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();
  const queryReturnTo = searchParams.get('returnTo');

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Leveraging existing form submission hook
  const { isSubmitting, handleSubmit } = useFormSubmission();

  const isValidReturnUrl = (url) => {
    return url && url.startsWith('/') && !url.startsWith('//');
  };

  // Login submission handler
  const onSubmit = async (data) => {
    const loginUser = async (credentials) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        return {
          error:
            result.error === 'Configuration'
              ? 'Invalid email or password'
              : result.error || 'Authentication failed',
        };
      }

      return { success: true };
    };

    // Handle submission with our custom hook
    await handleSubmit(loginUser, data, {
      customSuccessMessage: 'You have successfully logged in.',
      onSuccess: async () => {
        // Redirect logic
        await update();
        await new Promise((resolve) => setTimeout(resolve, 500));

        const userSpecificPath = localStorage.getItem(
          `returnPath_${encodeURIComponent(data.email)}`
        );

        const redirectUrl =
          queryReturnTo && isValidReturnUrl(queryReturnTo)
            ? queryReturnTo
            : userSpecificPath && isValidReturnUrl(userSpecificPath)
              ? userSpecificPath
              : '/';

        if (userSpecificPath) {
          localStorage.removeItem(
            `returnPath_${encodeURIComponent(data.email)}`
          );
        }

        router.refresh();
        router.push(redirectUrl);
      },
    });
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
}
