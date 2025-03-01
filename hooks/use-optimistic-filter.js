// hooks/use-optimistic-filter.js
'use client';

import { useOptimistic, useTransition } from 'react';
import { useQueryParams } from '@/hooks/use-query-params';

/**
 * Hook for managing filter state with optimistic UI updates
 * @param {string} initialValue - Initial filter value
 * @param {string} paramName - URL parameter name
 * @param {Object} options - Additional options
 * @returns {Object} Filter state and handlers
 */
export function useOptimisticFilter(initialValue, paramName, options = {}) {
  const { baseUrl = '/templates', preventToggle = false } = options;
  const { setParams } = useQueryParams({ baseUrl });
  const [_, startTransition] = useTransition();

  const [optimisticValue, setOptimisticValue] = useOptimistic(
    initialValue,
    (state, newValue) => newValue
  );

  const handleChange = (value) => {
    // If this is already the active value and preventToggle is true,
    // do nothing (this prevents toggling off sort filters)
    if (value === optimisticValue && preventToggle) {
      return optimisticValue;
    }

    // Toggle behavior: if current value is selected again, clear it
    const newValue = value === optimisticValue ? null : value;

    startTransition(() => {
      setOptimisticValue(newValue);
      setParams({ [paramName]: newValue });
    });

    return newValue;
  };

  return {
    value: optimisticValue,
    setValue: setOptimisticValue,
    handleChange,
    isActive: !!optimisticValue,
  };
}
