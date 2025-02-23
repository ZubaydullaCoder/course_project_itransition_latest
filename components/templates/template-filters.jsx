// components/templates/template-filters.jsx
'use client';

import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import { Filter, Clock, UserSquare2, Globe, Lock, History } from 'lucide-react';

const VIEW_FILTERS = [
  { id: 'all', label: 'All Templates', icon: Filter },
  { id: 'my', label: 'My Templates', icon: UserSquare2 },
];

const STATUS_FILTERS = [
  { id: 'public', label: 'Public', icon: Globe },
  { id: 'private', label: 'Private', icon: Lock },
];

const TIME_FILTERS = [
  { id: 'latest', label: 'Latest First', icon: Clock },
  { id: 'oldest', label: 'Oldest First', icon: History },
];

export function TemplateFilters({
  currentTopic,
  currentTag,
  currentFilter,
  currentStatus,
  currentSort = 'latest', // Default to 'latest'
}) {
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

  const handleStatusChange = (status) => {
    const queryString = createQueryString({
      status: status === currentStatus ? '' : status,
    });
    router.push(`/templates${queryString ? `?${queryString}` : ''}`);
  };

  const handleSortChange = (newSort) => {
    const queryString = createQueryString({
      sort: newSort,
    });
    router.push(`/templates${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="rounded-lg border bg-card">
      <div className="space-y-4 p-4">
        {/* View Filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">View</h3>
          <div className="flex flex-wrap gap-2">
            {VIEW_FILTERS.map((filter) => (
              <Button
                key={filter.id}
                variant={currentFilter === filter.id ? 'secondary' : 'ghost'}
                size="sm"
                className="justify-start"
                onClick={() => handleFilterChange(filter.id)}
              >
                <filter.icon className="mr-2 h-4 w-4" />
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status Filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status.id}
                variant={currentStatus === status.id ? 'secondary' : 'ghost'}
                size="sm"
                className="justify-start"
                onClick={() => handleStatusChange(status.id)}
              >
                <status.icon className="mr-2 h-4 w-4" />
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Sort Options */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            {TIME_FILTERS.map((sort) => (
              <Button
                key={sort.id}
                variant={currentSort === sort.id ? 'secondary' : 'ghost'}
                size="sm"
                className="justify-start"
                onClick={() => handleSortChange(sort.id)}
              >
                <sort.icon className="mr-2 h-4 w-4" />
                {sort.label}
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Topics Filter */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Topics</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-4">
              {TEMPLATE_TOPICS.map((topic) => (
                <Button
                  key={topic}
                  variant={currentTopic === topic ? 'secondary' : 'ghost'}
                  size="sm"
                  className="min-w-fit"
                  onClick={() => handleTopicChange(topic)}
                >
                  {topic}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Active Filters Display */}
        {(currentFilter || currentTopic || currentTag) && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 text-sm font-medium tracking-tight">
                Active Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentFilter && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleFilterChange(currentFilter)}
                  >
                    {VIEW_FILTERS.find((f) => f.id === currentFilter)?.label}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {currentTopic && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleTopicChange(currentTopic)}
                  >
                    Topic: {currentTopic}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {currentTag && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleTagClick(currentTag)}
                  >
                    Tag: {currentTag}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
