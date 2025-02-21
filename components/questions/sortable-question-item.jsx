'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grip, Trash2 } from 'lucide-react';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function SortableQuestionItem({ question, onDelete }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const renderAnswerPreview = () => {
    switch (question.type) {
      case QUESTION_TYPES.SINGLE_LINE:
        return <Input disabled placeholder="Single line answer" />;
      case QUESTION_TYPES.MULTI_LINE:
        return <Textarea disabled placeholder="Multi line answer" />;
      case QUESTION_TYPES.INTEGER:
        return <Input type="number" disabled placeholder="0" />;
      case QUESTION_TYPES.CHECKBOX:
        return <Switch disabled />;
      default:
        return null;
    }
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 relative ${
        isDragging ? 'z-50 shadow-lg border-primary' : ''
      } ${disabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div {...attributes} {...listeners} className="cursor-grab">
          <Grip className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-medium">
                {question.text}
                {question.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </p>
              <div className="flex gap-2">
                <Badge variant="outline">
                  {question.type.replace('_', ' ').toUpperCase()}
                </Badge>
                {question.required && (
                  <Badge variant="secondary">Required</Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete?.(question.id)}
              disabled={disabled}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

          <div>{renderAnswerPreview()}</div>
        </div>
      </div>
    </Card>
  );
}
