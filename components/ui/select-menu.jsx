// components/ui/select-menu.jsx
'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/**
 * Reusable select menu component for consistent UI across the application
 *
 * @param {Object} props - Component props
 * @param {string} props.value - Currently selected value
 * @param {Function} props.onValueChange - Handler for value changes
 * @param {string} props.placeholder - Placeholder text when no value is selected
 * @param {Array} props.options - Array of options to display
 * @param {string} props.options[].value - Option value
 * @param {string} props.options[].label - Option display label
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.className - Additional classes for the trigger
 * @param {string} props.contentClassName - Additional classes for the content
 */
export function SelectMenu({
  value,
  onValueChange,
  placeholder = 'Select an option',
  options = [],
  disabled = false,
  className,
  contentClassName,
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={cn('w-[180px]', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
