

import { Badge } from '@/components/ui/badge';

export function MultipleCheckboxSummary({ data }) {
  const { optionStats, totalResponses } = data;

  
  if (!optionStats || !Array.isArray(optionStats) || optionStats.length === 0) {
    return <div className="p-4">No data available for this question</div>;
  }

  return (
    <div className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <p className="text-sm text-muted-foreground mb-3">
          Option Selection Distribution
        </p>

        {optionStats.map((option, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium truncate max-w-[70%]">
                {option.text}
              </span>
              <Badge variant="outline">
                {typeof option.percentage === 'number'
                  ? option.percentage.toFixed(1)
                  : '0'}
                %
              </Badge>
            </div>
            {}
            <div className="w-full bg-secondary h-2 rounded-full">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${option.percentage || 0}%` }}
              />
            </div>
            <p className="text-xs text-right mt-1 text-muted-foreground">
              {option.count || 0} of {totalResponses || 0} responses
            </p>
          </div>
        ))}
      </div>

      {data.mostSelected && data.mostSelected.count > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Most Selected Option
          </p>
          <div className="flex items-center justify-between">
            <span className="font-medium">{data.mostSelected.text}</span>
            <Badge>{data.mostSelected.count} selections</Badge>
          </div>
        </div>
      )}
    </div>
  );
}
