
'use client';

import { useEffect } from 'react';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function useQuestionOptions({
  type,
  initialData,
  onChange,
  markOptionAsTouched,
}) {
  
  useEffect(() => {
    if (
      type === QUESTION_TYPES.CHECKBOX &&
      (!initialData.options || initialData.options.length === 0)
    ) {
      onChange({ options: ['', ''] });
    }
  }, [type, initialData.options, onChange]);

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
      newOptions[index] = value;
      onChange({ options: newOptions });

      // If the option becomes empty after trimming when it wasn't before,
      
      if (value.trim() === '' && initialData.options[index]?.trim() !== '') {
        markOptionAsTouched(index);
      }
    }
  };

  return {
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
  };
}
