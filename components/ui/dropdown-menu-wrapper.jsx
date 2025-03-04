// components/ui/dropdown-menu-wrapper.jsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

/**
 * Reusable dropdown menu wrapper that provides consistent styling and behavior
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to display inside the dropdown
 * @param {React.ReactNode} props.trigger - Custom trigger element (overrides default)
 * @param {string} props.triggerText - Text to display on trigger button
 * @param {React.ReactNode} props.icon - Icon to display on trigger button
 * @param {string} props.align - Alignment of dropdown (start, center, end)
 * @param {string} props.side - Side to display dropdown (top, right, bottom, left)
 * @param {string} props.triggerVariant - Button variant for trigger
 * @param {string} props.triggerSize - Button size for trigger
 * @param {string} props.triggerClassName - Additional classes for trigger
 * @param {string} props.contentClassName - Additional classes for dropdown content
 * @param {boolean} props.disabled - Whether the dropdown is disabled
 */
export function DropdownMenuWrapper({
  children,
  trigger,
  triggerText,
  icon,
  align = 'end',
  side,
  triggerVariant = 'ghost',
  triggerSize = 'default',
  triggerClassName,
  contentClassName,
  disabled = false,
  ...props
}) {
  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {trigger || (
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={triggerClassName}
            disabled={disabled}
          >
            {icon && <span className="mr-2">{icon}</span>}
            {triggerText}
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        className={cn('w-56', contentClassName)}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
