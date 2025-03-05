
'use client';

import { QUESTION_TYPES } from '@/lib/constants/questions';


export function useQuestionValidation() {
  
  const validateQuestions = (questions) => {
    
    if (!questions || questions.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Please add at least one question',
      };
    }

    
    const emptyTitleQuestions = questions.filter((q) => !q.text?.trim());
    if (emptyTitleQuestions.length > 0) {
      return {
        isValid: false,
        errorMessage: 'One or more questions are missing titles',
        errorQuestions: emptyTitleQuestions,
      };
    }

    
    const invalidCheckboxQuestions = questions.filter(
      (q) =>
        q.type === QUESTION_TYPES.CHECKBOX &&
        (!q.options ||
          q.options.length < 2 ||
          q.options.some((option) => !option.trim()))
    );

    if (invalidCheckboxQuestions.length > 0) {
      return {
        isValid: false,
        errorMessage: 'One or more checkbox questions have invalid options',
        errorQuestions: invalidCheckboxQuestions,
      };
    }

    
    return { isValid: true };
  };

  return {
    validateQuestions,
  };
}
