'use client';

import { QuestionTypeCard } from './question-type-card';
import {
  QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
} from '@/lib/constants/questions';

export function QuestionTypeSelector({ onSelect, questionCounts = {} }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.values(QUESTION_TYPES).map((type) => {
        const count = questionCounts[type] || 0;
        const isDisabled = count >= 4;

        return (
          <QuestionTypeCard
            key={type}
            type={type}
            label={QUESTION_TYPE_LABELS[type]}
            count={count}
            onClick={() => onSelect(type)}
            disabled={isDisabled}
          />
        );
      })}
    </div>
  );
}
