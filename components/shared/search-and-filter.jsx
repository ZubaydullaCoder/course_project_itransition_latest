
import { GlobalSearch } from '@/components/shared/global-search';
import { SelectMenu } from '@/components/ui/select-menu';
import { TEMPLATE_TOPICS } from '@/lib/constants/templates';

export function SearchAndFilter({ currentTopic, handleTopicChange }) {
  
  const topicOptions = [
    { value: 'all', label: 'All Topics' },
    ...TEMPLATE_TOPICS.map((topic) => ({ value: topic, label: topic })),
  ];

  return (
    <div className="flex-1 flex gap-2 max-w-full md:max-w-2xl">
      <GlobalSearch />

      <div className="hidden sm:flex shrink-0">
        <SelectMenu
          value={currentTopic}
          onValueChange={handleTopicChange}
          placeholder="All Topics"
          options={topicOptions}
        />
      </div>
    </div>
  );
}
