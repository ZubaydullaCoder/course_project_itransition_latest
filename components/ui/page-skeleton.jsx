
import React from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { SkeletonWrapper } from '@/components/ui/skeleton-wrapper';


export function PageSkeleton({
  breadcrumbItems,
  title, 
  description, 
  actions, 
  children,
  ...props
}) {
  
  const titleElement =
    typeof title === 'string' ? (
      title
    ) : title ? (
      <SkeletonWrapper variant="title" />
    ) : null;

  
  const descriptionElement =
    typeof description === 'string' ? (
      description
    ) : description ? (
      <SkeletonWrapper variant="subtitle" />
    ) : null;

  
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
