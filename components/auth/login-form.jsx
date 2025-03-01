'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { LoginSchema } from '@/lib/utils/validators';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormSubmission } from '@/hooks/use-form-submission';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const { update } = useSession();

  // Get returnTo path from query params
  const queryReturnTo = searchParams.get('returnTo');

  // Create form with validation
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Validate the return URL is safe (internal link)
  const isValidReturnUrl = (url) => {
    return url && url.startsWith('/') && !url.startsWith('//');
  };

  // Use the custom submission hook (without redirect path, we'll handle it manually)
  const { isSubmitting, handleSubmit } = useFormSubmission();

  async function onSubmit(data) {
    // Custom submission function for login
    const loginUser = async (credentials) => {
      const result = await signIn('credentials', {
        ...credentials,
        redirect: false,
      });

      if (result?.error) {
        // Return in format compatible with our hook
        return {
          error:
            result.error === 'Configuration'
              ? 'Invalid email or password'
              : result.error || 'Authentication failed',
        };
      }

      // Success case
      return { success: true };
    };

    // Handle submission with our custom hook
    const success = await handleSubmit(loginUser, data, {
      customSuccessMessage: 'You have successfully logged in.',
      onSuccess: async () => {
        await update();
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Look for a user-specific return path using the email
        const userSpecificPath = localStorage.getItem(
          `returnPath_${encodeURIComponent(data.email)}`
        );

        // Prioritize paths: user-specific path > query param > default
        const redirectUrl =
          queryReturnTo && isValidReturnUrl(queryReturnTo)
            ? queryReturnTo
            : userSpecificPath && isValidReturnUrl(userSpecificPath)
              ? userSpecificPath
              : '/';

        // Clear user-specific path after use
        if (userSpecificPath) {
          localStorage.removeItem(
            `returnPath_${encodeURIComponent(data.email)}`
          );
        }

        router.refresh();
        router.push(redirectUrl);
      },
      // Don't auto-redirect - we handle it in the onSuccess callback
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Form fields remain the same */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@example.com"
                    disabled={isSubmitting}
                    className="pl-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            'Loading...'
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
