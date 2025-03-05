'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormFieldWithIcon } from '@/components/common/form-field-with-icon';
import { usePasswordVisibility } from '@/hooks/use-password-visibility';


export function PasswordField({
  control,
  name,
  label = 'Password',
  description,
  placeholder = '••••••••',
  disabled = false,
  required = false,
  className,
  ...props
}) {
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();

  return (
    <FormFieldWithIcon
      control={control}
      name={name}
      label={label}
      description={description}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      type={showPassword ? 'text' : 'password'}
      leadingIcon={<Lock className="h-4 w-4" />}
      trailingIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      onTrailingIconClick={togglePasswordVisibility}
      className={className}
      {...props}
    />
  );
}
