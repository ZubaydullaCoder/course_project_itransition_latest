'use client';

import { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Grip, Trash2, PlusCircle, X } from 'lucide-react';
import {
  QUESTION_TYPE_LABELS,
  QUESTION_TYPES,
} from '@/lib/constants/questions';
import { FormControl, FormItem, FormMessage } from '../ui/form';
import { Badge } from '@/components/ui/badge';

export function SortableQuestionForm({
  id,
  type,
  initialData = {},
  onChange,
  onRemove,
}) {
  const [touched, setTouched] = useState(false);
  const [optionsTouched, setOptionsTouched] = useState({});

  // Initialize options if not present
  useEffect(() => {
    if (
      type === QUESTION_TYPES.CHECKBOX &&
      (!initialData.options || initialData.options.length === 0)
    ) {
      onChange({ options: ['', ''] }); // Start with two empty options
    }
  }, [type, initialData.options, onChange]);

  // Add this useEffect to listen for the custom event
  useEffect(() => {
    const handleMarkAsTouched = (event) => {
      const { questionIds } = event.detail;
      if (questionIds.includes(id)) {
        // Mark the title as touched
        setTouched(true);

        // Mark all options as touched for checkbox questions
        if (type === QUESTION_TYPES.CHECKBOX && initialData.options) {
          const newOptionsTouched = {};
          initialData.options.forEach((_, index) => {
            newOptionsTouched[index] = true;
          });
          setOptionsTouched(newOptionsTouched);
        }
      }
    };

    // Add event listener
    document.addEventListener('markQuestionsAsTouched', handleMarkAsTouched);

    // Cleanup
    return () => {
      document.removeEventListener(
        'markQuestionsAsTouched',
        handleMarkAsTouched
      );
    };
  }, [id, type, initialData.options]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddOption = () => {
    if (initialData.options && initialData.options.length < 4) {
      onChange({ options: [...initialData.options, ''] });
    }
  };

  const handleRemoveOption = (index) => {
    if (initialData.options && initialData.options.length > 2) {
      const newOptions = [...initialData.options];
      newOptions.splice(index, 1);
      onChange({ options: newOptions });
    }
  };

  const handleOptionChange = (index, value) => {
    if (initialData.options) {
      const newOptions = [...initialData.options];
      // Store the raw value in the options array
      newOptions[index] = value;
      onChange({ options: newOptions });

      // If the option becomes empty after trimming when it wasn't before,
      // mark it as touched to show validation error immediately
      if (value.trim() === '' && initialData.options[index]?.trim() !== '') {
        setOptionsTouched((prev) => ({ ...prev, [index]: true }));
      }
    }
  };

  const handleOptionBlur = (index) => {
    setOptionsTouched((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-4 ${isDragging ? 'z-50 shadow-lg border-primary' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div {...attributes} {...listeners} className="cursor-grab mt-1">
          <Grip className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {QUESTION_TYPE_LABELS[type]}
            </span>
            <Button variant="ghost" size="icon" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Question Title"
                  value={initialData.text || ''}
                  onChange={(e) => onChange({ text: e.target.value })}
                  onBlur={() => setTouched(true)} // Mark as touched on blur
                />
              </FormControl>
              {touched && !initialData.text && (
                <FormMessage>Question title is required</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Description (Optional)"
                  value={initialData.description || ''}
                  onChange={(e) => onChange({ description: e.target.value })}
                  rows={3}
                />
              </FormControl>
            </FormItem>

            {/* Checkbox Options (only for CHECKBOX type) */}
            {type === QUESTION_TYPES.CHECKBOX && initialData.options && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Options</span>
                  <Badge variant="outline">
                    {initialData.options.length}/4 options
                  </Badge>
                </div>

                {initialData.options.map((option, index) => (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        onBlur={() => handleOptionBlur(index)}
                        className="flex-1"
                      />
                      {initialData.options.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(index)}
                          type="button"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {optionsTouched[index] && !option.trim() && (
                      <FormMessage>
                        Option {index + 1} cannot be empty
                      </FormMessage>
                    )}
                  </div>
                ))}

                {initialData.options.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddOption}
                    className="w-full mt-2"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  checked={initialData.required !== false}
                  onCheckedChange={(checked) => onChange({ required: checked })}
                />
                <span className="text-sm">Required question</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={initialData.showInResults || false}
                  onCheckedChange={(checked) =>
                    onChange({ showInResults: checked })
                  }
                />
                <span className="text-sm">Show in Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
