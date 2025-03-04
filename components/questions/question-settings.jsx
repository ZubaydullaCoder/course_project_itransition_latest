// components/questions/question-settings.jsx
import { Switch } from '@/components/ui/switch';

export function QuestionSettings({
  required = true,
  showInResults = false,
  onChangeRequired,
  onChangeShowInResults,
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Switch checked={required} onCheckedChange={onChangeRequired} />
        <span className="text-sm">Required question</span>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={showInResults}
          onCheckedChange={onChangeShowInResults}
        />
        <span className="text-sm">Show in Results</span>
      </div>
    </div>
  );
}
