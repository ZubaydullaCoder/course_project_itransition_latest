// hooks/use-password-visibility.js
'use client';

import { useState } from 'react';

/**
 * Custom hook for managing password visibility toggle functionality
 * @returns {Object} Password visibility state and togglers
 */
export function usePasswordVisibility() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return {
    showPassword,
    togglePasswordVisibility,
  };
}
