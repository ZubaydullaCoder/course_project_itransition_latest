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
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {React.ReactNode} props.actions - Action buttons or controls to display next to the title
 */
export function PageContainer({
  children,
  breadcrumbItems,
  className,
  maxWidth = '8xl',
  spacing = '8',
  centered = false,
  hideBreadcrumb = false,
  title,
  description,
  actions,
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const isAdminPage = pathname?.startsWith('/admin');

  const shouldShowBreadcrumb =
    !hideBreadcrumb && !isHomePage && breadcrumbItems?.length > 0;

  const showHeader = title || description || actions;

  return (
    <div
      className={cn(
        // For admin pages, don't limit width as much since they already have a sidebar
        isAdminPage
          ? 'w-full py-2 space-y-6 px-1'
          : `container max-w-${maxWidth} py-2 xl:px-0 space-y-${spacing}`,
        centered && 'flex flex-col items-center',
        className
      )}
    >
      {shouldShowBreadcrumb && <PageBreadcrumb items={breadcrumbItems} />}

      {showHeader && (
        <div className="flex items-center justify-between">
          <div>
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
}
