'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, UserPlus } from 'lucide-react';
import { registerUser } from '@/lib/actions/auth';
import { RegisterSchema } from '@/lib/utils/validators';
import { useFormSubmission } from '@/hooks/use-form-submission';
import { SmartForm } from '@/components/common/smart-form';
import { FormFieldWithIcon } from '@/components/common/form-field-with-icon';
import { FormSection } from '@/components/common/form-section';
import { PasswordField } from '@/components/common/password-field';

export function RegisterForm() {
  
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

  
  const onSubmit = async (data) => {
    await handleSubmit(registerUser, data, {
      customErrorMessage: 'Registration failed. Please try again.',
    });
  };

  return (
    <SmartForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isDisabled={isSubmitting}
      submitText="Create Account"
      submittingText="Creating account..."
      showCancelButton={false}
      withCard={false}
      submitIcon={UserPlus}
      submitButtonClassName="w-full"
      actionButtonsClassName="flex justify-center"
    >
      <FormSection>
        <FormFieldWithIcon
          control={form.control}
          name="name"
          label="Name"
          placeholder="John Doe"
          type="text"
          leadingIcon={<User className="h-4 w-4" />}
          disabled={isSubmitting}
        />

        <FormFieldWithIcon
          control={form.control}
          name="email"
          label="Email"
          placeholder="name@example.com"
          type="email"
          leadingIcon={<Mail className="h-4 w-4" />}
          disabled={isSubmitting}
        />

        <PasswordField
          control={form.control}
          name="password"
          disabled={isSubmitting}
        />
      </FormSection>
    </SmartForm>
  );
}
