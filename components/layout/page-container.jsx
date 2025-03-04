// components/layout/page-container.jsx
'use client'; // Converting to client component since we're conditionally rendering based on URL

import { PageBreadcrumb } from '@/components/common/page-breadcrumb';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

/**
 * Reusable page container with consistent layout and breadcrumbs
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {Array} props.breadcrumbItems - Array of breadcrumb items
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.maxWidth - Max width of the container (default: '8xl')
 * @param {string} props.spacing - Spacing between elements (default: '8')
 * @param {boolean} props.centered - Whether to center the content (default: false)
 * @param {boolean} props.hideBreadcrumb - Force hide breadcrumb (default: false)
 */
export function PageContainer({
  children,
  breadcrumbItems,
  className,
  maxWidth = '8xl',
  spacing = '8',
  centered = false,
  hideBreadcrumb = false,
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const shouldShowBreadcrumb =
    !hideBreadcrumb && !isHomePage && breadcrumbItems?.length > 0;

  return (
    <div
      className={cn(
        `container max-w-${maxWidth} py-2 xl:px-0 space-y-${spacing}`,
        centered && 'flex flex-col items-center',
        className
      )}
    >
      {shouldShowBreadcrumb && <PageBreadcrumb items={breadcrumbItems} />}
      {children}
    </div>
  );
}
