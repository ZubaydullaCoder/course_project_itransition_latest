'use client';

import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { QuestionTypeCards } from './question-type-cards';
import { SortableQuestionForm } from './sortable-question-form';
import { useQuestionManager } from '@/hooks/use-question-manager';
import { useDragSensors } from '@/hooks/use-drag-sensors';

export function QuestionsSection({ value = [], onChange, disabled = false }) {
  
  const {
    questions,
    questionCounts,
    addQuestion,
    updateQuestion,
    removeQuestion,
    handleDragEnd,
  } = useQuestionManager({
    initialQuestions: value,
    onChange,
  });

  const sensors = useDragSensors();

  return (
    <div className="space-y-6">
      <QuestionTypeCards
        onSelect={addQuestion}
        questionCounts={questionCounts}
        disabled={disabled}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {questions.map((question, index) => (
              <SortableQuestionForm
                key={question.id}
                id={question.id}
                type={question.type}
                initialData={question}
                index={index}
                onChange={(changes) => updateQuestion(question.id, changes)}
                onRemove={() => removeQuestion(question.id)}
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
