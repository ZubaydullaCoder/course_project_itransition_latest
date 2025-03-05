
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
        
        setTouched(true);

        
        if (type === QUESTION_TYPES.CHECKBOX && initialData.options) {
          markAllOptionsTouched(initialData.options.length);
        }
      }
    };

    
    document.addEventListener('markQuestionsAsTouched', handleMarkAsTouched);

    
    return () => {
      document.removeEventListener(
        'markQuestionsAsTouched',
        handleMarkAsTouched
      );
    };
  }, [id, type, initialData.options, setTouched, markAllOptionsTouched]);

  return {};
}
