// hooks/use-question-validation.js
'use client';

import { QUESTION_TYPES } from '@/lib/constants/questions';

/**
 * Custom hook for validating template questions
 * @returns {Object} Validation methods
 */
export function useQuestionValidation() {
  /**
   * Validates that all questions are properly configured
   * @param {Array} questions - Array of question objects to validate
   * @returns {Object} Validation result with status and any error details
   */
  const validateQuestions = (questions) => {
    // Check if there are any questions
    if (!questions || questions.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Please add at least one question',
      };
    }

    // Check for questions without titles
    const emptyTitleQuestions = questions.filter((q) => !q.text?.trim());
    if (emptyTitleQuestions.length > 0) {
      return {
        isValid: false,
        errorMessage: 'One or more questions are missing titles',
        errorQuestions: emptyTitleQuestions,
      };
    }

    // Check checkbox questions for at least 2 options and no empty options
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

    // All validations passed
    return { isValid: true };
  };

  return {
    validateQuestions,
  };
}
