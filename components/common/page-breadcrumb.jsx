// components/common/page-breadcrumb.jsx
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import React from 'react';

/**
 * Reusable breadcrumb component
 * @param {Object[]} items - Array of breadcrumb items
 * @param {string} items[].href - Link for the breadcrumb item (optional for the last item)
 * @param {string} items[].label - Text to display for the breadcrumb item
 * @param {boolean} items[].isCurrent - Whether this is the current page (last item)
 */
export function PageBreadcrumb({ items = [] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={`${item.href || ''}-${index}`}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isCurrent ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
