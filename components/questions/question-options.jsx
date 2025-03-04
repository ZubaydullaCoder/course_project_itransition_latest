// components/questions/question-options.jsx
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { X, PlusCircle } from 'lucide-react';

export function QuestionOptions({
  options,
  onAddOption,
  onRemoveOption,
  onOptionChange,
  optionsTouched,
  markOptionAsTouched,
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Options</span>
        <Badge variant="outline">{options.length}/4 options</Badge>
      </div>

      {options.map((option, index) => (
        <div key={index} className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Input
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => onOptionChange(index, e.target.value)}
              onBlur={() => markOptionAsTouched(index)}
              className="flex-1"
            />
            {options.length > 2 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemoveOption(index)}
                type="button"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {optionsTouched[index] && !option.trim() && (
            <FormMessage>Option {index + 1} cannot be empty</FormMessage>
          )}
        </div>
      ))}

      {options.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddOption}
          className="w-full mt-2"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      )}
    </div>
  );
}
