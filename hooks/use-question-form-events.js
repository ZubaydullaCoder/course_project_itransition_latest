// hooks/use-question-form-events.js
'use client';

import { useEffect } from 'react';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function useQuestionFormEvents({
  id,
  type,
  initialData,
  setTouched,
  markAllOptionsTouched,
}) {
  useEffect(() => {
    const handleMarkAsTouched = (event) => {
      const { questionIds } = event.detail;
      if (questionIds.includes(id)) {
        // Mark the title as touched
        setTouched(true);

        // Mark all options as touched for checkbox questions
        if (type === QUESTION_TYPES.CHECKBOX && initialData.options) {
          markAllOptionsTouched(initialData.options.length);
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
  }, [id, type, initialData.options, setTouched, markAllOptionsTouched]);

  return {};
}
