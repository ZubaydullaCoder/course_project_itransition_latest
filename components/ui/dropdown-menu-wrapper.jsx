
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';


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
