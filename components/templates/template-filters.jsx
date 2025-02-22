// components/templates/template-filters.jsx
'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';

const TEMPLATE_FILTERS = [
  { id: 'all', label: 'All Templates' },
  { id: 'my', label: 'My Templates' },
  { id: 'latest', label: 'Latest' },
];

export function TemplateFilters({ currentTopic, currentTag, currentFilter }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams);

      // Update all provided parameters
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      return params.toString();
    },
    [searchParams]
  );

  const handleFilterChange = (filter) => {
    const queryString = createQueryString({
      filter: filter === currentFilter ? '' : filter,
    });
    router.push(`/templates${queryString ? `?${queryString}` : ''}`);
  };

  const handleTopicChange = (topic) => {
    const queryString = createQueryString({
      topic: topic === currentTopic ? '' : topic,
    });
    router.push(`/templates${queryString ? `?${queryString}` : ''}`);
  };

  const handleTagClick = (tag) => {
    const queryString = createQueryString({
      tag: tag === currentTag ? '' : tag,
    });
    router.push(`/templates${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="space-y-4">
      {/* View Filters */}
      <div>
        <h3 className="mb-2 text-sm font-medium">View</h3>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_FILTERS.map((filter) => (
            <Button
              key={filter.id}
              variant={currentFilter === filter.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleFilterChange(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Topics Filter */}
      <div>
        <h3 className="mb-2 text-sm font-medium">Topics</h3>
        <div className="flex flex-wrap gap-2">
          {TEMPLATE_TOPICS.map((topic) => (
            <Button
              key={topic}
              variant={currentTopic === topic ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleTopicChange(topic)}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {(currentFilter || currentTopic || currentTag) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {currentFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange(currentFilter)}
            >
              {TEMPLATE_FILTERS.find((f) => f.id === currentFilter)?.label} ×
            </Button>
          )}
          {currentTopic && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTopicChange(currentTopic)}
            >
              Topic: {currentTopic} ×
            </Button>
          )}
          {currentTag && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleTagClick(currentTag)}
            >
              Tag: {currentTag} ×
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
