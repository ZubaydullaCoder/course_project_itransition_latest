'use client';

import { useCallback, useOptimistic } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
import { useTransition } from 'react';
import { Clock, Globe, Lock, History, Users2, UserCircle2 } from 'lucide-react';

const VIEW_FILTERS = [
  { id: 'other', label: 'Other Templates', icon: Users2 },
  { id: 'my', label: 'My Templates', icon: UserCircle2 },
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
  currentSort = 'latest',
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [_, startTransition] = useTransition();

  const [optimisticFilter, setOptimisticFilter] = useOptimistic(
    currentFilter,
    (state, newFilter) => newFilter
  );
  const [optimisticTopic, setOptimisticTopic] = useOptimistic(
    currentTopic,
    (state, newTopic) => newTopic
  );
  const [optimisticSort, setOptimisticSort] = useOptimistic(
    currentSort,
    (state, newSort) => newSort
  );

  const [optimisticStatus, setOptimisticStatus] = useOptimistic(
    currentStatus,
    (state, newStatus) => newStatus
  );

  const createQueryString = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams);
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
    const newFilter = filter === currentFilter ? null : filter;

    startTransition(() => {
      setOptimisticFilter(newFilter);
      const queryString = createQueryString({ filter: newFilter });
      router.push(`/templates${queryString ? `?${queryString}` : ''}`);
    });
  };

  const handleTopicChange = (topic) => {
    const newTopic = topic === currentTopic ? '' : topic;

    startTransition(() => {
      setOptimisticTopic(newTopic);
      const queryString = createQueryString({ topic: newTopic });
      router.push(`/templates${queryString ? `?${queryString}` : ''}`);
    });
  };

  const handleTagClick = (tag) => {
    const queryString = createQueryString({
      tag: tag === currentTag ? '' : tag,
    });
    router.push(`/templates${queryString ? `?${queryString}` : ''}`);
  };

  // Update the status change handler to use optimistic updates
  const handleStatusChange = (status) => {
    // Toggle status when clicking the same one
    const newStatus = status === currentStatus ? '' : status;

    startTransition(() => {
      setOptimisticStatus(newStatus);
      const queryString = createQueryString({ status: newStatus });
      router.push(`/templates${queryString ? `?${queryString}` : ''}`);
    });
  };

  const handleSortChange = (newSort) => {
    startTransition(() => {
      setOptimisticSort(newSort);
      const queryString = createQueryString({ sort: newSort });
      router.push(`/templates${queryString ? `?${queryString}` : ''}`);
    });
  };

  return (
    <div className="rounded-lg border bg-card sticky top-6">
      <div className="space-y-4 p-4">
        {/* View Filters */}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">View</h3>
          <div className="flex flex-wrap gap-2">
            {VIEW_FILTERS.map((filter) => (
              <Button
                key={filter.id}
                variant={optimisticFilter === filter.id ? 'secondary' : 'ghost'}
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

        {}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Status</h3>
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status.id}
                variant={optimisticStatus === status.id ? 'secondary' : 'ghost'}
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

        {}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Sort By</h3>
          <div className="flex flex-wrap gap-2">
            {TIME_FILTERS.map((sort) => (
              <Button
                key={sort.id}
                variant={optimisticSort === sort.id ? 'secondary' : 'ghost'}
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

        {}
        <div>
          <h3 className="mb-2 text-sm font-medium tracking-tight">Topics</h3>
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 pb-4">
              {TEMPLATE_TOPICS.map((topic) => (
                <Button
                  key={topic}
                  variant={optimisticTopic === topic ? 'secondary' : 'ghost'}
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

        {}
        {(optimisticFilter ||
          optimisticTopic ||
          currentTag ||
          optimisticStatus) && (
          <>
            <Separator />
            <div>
              <h3 className="mb-2 text-sm font-medium tracking-tight">
                Active Filters
              </h3>
              <div className="flex flex-wrap gap-2">
                {optimisticFilter && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleFilterChange(optimisticFilter)}
                  >
                    {VIEW_FILTERS.find((f) => f.id === optimisticFilter)?.label}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {optimisticStatus && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleStatusChange(optimisticStatus)}
                  >
                    {
                      STATUS_FILTERS.find((s) => s.id === optimisticStatus)
                        ?.label
                    }
                    <span className="text-muted-foreground">×</span>
                  </Button>
                )}
                {optimisticTopic && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => handleTopicChange(optimisticTopic)}
                  >
                    Topic: {optimisticTopic}
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
