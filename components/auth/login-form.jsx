'use client';

import { Mail, LogIn } from 'lucide-react';
import { SmartForm } from '@/components/common/smart-form';
import { FormFieldWithIcon } from '@/components/common/form-field-with-icon';
import { PasswordField } from '@/components/common/password-field';
import { FormSection } from '@/components/common/form-section';
import { useLogin } from '@/hooks/use-login';

export function LoginForm() {
  const { form, isSubmitting, onSubmit } = useLogin();

  return (
    <SmartForm
      form={form}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isDisabled={isSubmitting}
      submitText="Sign In"
      submittingText="Signing in..."
      showCancelButton={false}
      withCard={false}
      submitIcon={LogIn}
      submitButtonClassName="w-full"
      actionButtonsClassName="flex justify-center"
    >
      <FormSection>
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
