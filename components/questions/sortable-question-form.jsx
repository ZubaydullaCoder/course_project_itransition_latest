'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FormControl, FormItem, FormMessage } from '../ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { QUESTION_TYPES } from '@/lib/constants/questions';
import { useQuestionFormValidation } from '@/hooks/use-question-form-validation';
import { useQuestionOptions } from '@/hooks/use-question-options';
import { useQuestionFormEvents } from '@/hooks/use-question-form-events';
import { FormSection } from '@/components/common/form-section';
import { QuestionHeader } from './question-header';
import { QuestionOptions } from './question-options';
import { QuestionSettings } from './question-settings';
import { DraggableCardWrapper } from './draggable-card-wrapper';

export function SortableQuestionForm({
  id,
  type,
  initialData = {},
  onChange,
  onRemove,
}) {
  
  const {
    touched,
    optionsTouched,
    markAsTouched,
    markOptionAsTouched,
    markAllOptionsTouched,
    setTouched,
  } = useQuestionFormValidation();

  const { handleAddOption, handleRemoveOption, handleOptionChange } =
    useQuestionOptions({
      type,
      initialData,
      onChange,
      markOptionAsTouched,
    });

  
  useQuestionFormEvents({
    id,
    type,
    initialData,
    setTouched,
    markAllOptionsTouched,
  });

  
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

  return (
    <DraggableCardWrapper
      id={id}
      isDragging={isDragging}
      attributes={attributes}
      listeners={listeners}
      setNodeRef={setNodeRef}
      style={style}
    >
      <QuestionHeader type={type} onRemove={onRemove} />

      <FormSection contentClassName="space-y-4">
        <FormItem>
          <FormControl>
            <Input
              placeholder="Question Title"
              value={initialData.text || ''}
              onChange={(e) => onChange({ text: e.target.value })}
              onBlur={markAsTouched}
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

        {}
        {type === QUESTION_TYPES.CHECKBOX && initialData.options && (
          <QuestionOptions
            options={initialData.options}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onOptionChange={handleOptionChange}
            optionsTouched={optionsTouched}
            markOptionAsTouched={markOptionAsTouched}
          />
        )}

        <QuestionSettings
          required={initialData.required !== false}
          showInResults={initialData.showInResults || false}
          onChangeRequired={(checked) => onChange({ required: checked })}
          onChangeShowInResults={(checked) =>
            onChange({ showInResults: checked })
          }
        />
      </FormSection>
    </DraggableCardWrapper>
  );
}
