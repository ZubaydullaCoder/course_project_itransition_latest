
'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


export function SkeletonWrapper({
  className,
  width,
  height,
  rounded = true,
  variant,
  children,
  ...props
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full';
      case 'title':
        return 'h-7 w-3/4';
      case 'subtitle':
        return 'h-5 w-1/2';
      case 'button':
        return 'h-10 w-32';
      case 'card':
        return 'h-40 w-full';
      case 'avatar':
        return 'h-10 w-10 rounded-full';
      case 'image':
        return 'h-40 w-full rounded-md';
      default:
        return '';
    }
  };

  const style = {
    width: width
      ? typeof width === 'number'
        ? `${width}px`
        : width
      : undefined,
    height: height
      ? typeof height === 'number'
        ? `${height}px`
        : height
      : undefined,
  };

  return (
    <Skeleton
      className={cn(
        getVariantClasses(),
        rounded && !variant?.includes('rounded') && 'rounded-md',
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </Skeleton>
  );
}
