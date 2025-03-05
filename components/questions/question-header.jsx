
import { QUESTION_TYPE_LABELS } from '@/lib/constants/questions';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function QuestionHeader({ type, onRemove }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">
        {QUESTION_TYPE_LABELS[type]}
      </span>
      <Button variant="ghost" size="icon" onClick={onRemove}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
