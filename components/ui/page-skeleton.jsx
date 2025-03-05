// components/ui/page-skeleton.jsx
import React from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';

/**
 * Reusable page skeleton component that maintains consistent layout with actual pages
 *
 * @param {Object} props - Component props
 * @param {Array} props.breadcrumbItems - Array of breadcrumb items to maintain layout
 * @param {string} props.title - Whether to show title skeleton
 * @param {boolean} props.description - Whether to show description skeleton
 * @param {boolean} props.actions - Whether to show action button skeleton
 * @param {React.ReactNode} props.children - Content skeleton components
 */
export function PageSkeleton({
  breadcrumbItems,
  title, // Accept either string (static) or true (skeleton) or false (nothing)
  description, // Same approach
  actions, // Same approach
  children,
  ...props
}) {
  // Determine what to render for the title
  const titleElement =
    typeof title === 'string' ? (
      title
    ) : title ? (
      <SkeletonWrapper variant="title" />
    ) : null;

  // Determine what to render for the description
  const descriptionElement =
    typeof description === 'string' ? (
      description
    ) : description ? (
      <SkeletonWrapper variant="subtitle" />
    ) : null;

  // Determine what to render for actions
  const actionElement = React.isValidElement(actions) ? (
    actions
  ) : actions ? (
    <SkeletonWrapper variant="button" />
  ) : null;

  return (
    <PageContainer
      breadcrumbItems={breadcrumbItems}
      title={titleElement}
      description={descriptionElement}
      actions={actionElement}
      {...props}
    >
      <div className="space-y-4">{children}</div>
    </PageContainer>
  );
}
