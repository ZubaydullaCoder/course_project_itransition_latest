'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { LoginSchema } from '@/lib/utils/validators';

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      // Validate form data
      LoginSchema.parse(data);

      const result = await signIn('credentials', {
        ...data,
        redirect: false,
      });
      // console.log({ resultError: });
      if (result?.error) {
        // Match exact error messages from auth.js
        console.log({ resultError: result.error });
        const errorMessage =
          result.error === 'Configuration' &&
          'No account found with this email or The password you entered is incorrect.';

        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: errorMessage,
        });
        return;
      }

      router.refresh();
      router.push('/');
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    } catch (error) {
      console.log({ error });
      if (error.errors) {
        // Zod validation errors
        toast({
          variant: 'destructive',
          title: 'Invalid Input',
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description:
            'Unable to sign in at the moment. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign In'}
      </Button>
    </form>
  );
}
