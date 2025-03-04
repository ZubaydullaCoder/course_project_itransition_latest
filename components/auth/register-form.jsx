'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '@/components/ui/form-buttons'; // Import the SubmitButton component
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/lib/actions/auth';
import { RegisterSchema } from '@/lib/utils/validators';
import { User, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { usePasswordVisibility } from '@/hooks/use-password-visibility';

export function RegisterForm() {
  const { toast } = useToast();

  // Use the password visibility hook
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  // Use form submission hook
  const { isSubmitting, handleSubmit } = useFormSubmission({
    successMessage: 'Account created successfully!',
    redirectPath: '/login',
  });

  // Submit handler
  const onSubmit = async (data) => {
    await handleSubmit(registerUser, data, {
      customErrorMessage: 'Registration failed. Please try again.',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    {...field}
                    type="text"
                    placeholder="John Doe"
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
                    onClick={togglePasswordVisibility}
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

        <SubmitButton
          isSubmitting={isSubmitting}
          isDisabled={isSubmitting}
          submittingText="Creating account..."
          icon={UserPlus}
          className="w-full"
        >
          Create Account
        </SubmitButton>
      </form>
    </Form>
  );
}
