// hooks/use-question-manager.js
'use client';

import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Custom hook for managing questions in a form template
 *
 * @param {Object} options - Hook options
 * @param {Array} options.initialQuestions - Initial array of questions
 * @param {Function} options.onChange - Callback function when questions change
 * @returns {Object} Question management methods and state
 */
export function useQuestionManager({ initialQuestions = [], onChange }) {
  const [questions, setQuestions] = useState(initialQuestions);

  // Calculate question counts by type
  const questionCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {});

  // Add a new question of specified type
  const addQuestion = (type) => {
    const newQuestion = {
      id: `temp_${Date.now()}`,
      type,
      text: '',
      description: '',
      required: true,
      showInResults: true,
      ...(type === 'checkbox' ? { options: ['', ''] } : {}),
    };

    const newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    onChange?.(newQuestions);
    return newQuestion;
  };

  // Update an existing question
  const updateQuestion = (id, changes) => {
    const newQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...changes } : q
    );
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  // Remove a question
  const removeQuestion = (id) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  // Handle drag-and-drop reordering
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  return {
    questions,
    setQuestions,
    questionCounts,
    addQuestion,
    updateQuestion,
    removeQuestion,
    handleDragEnd,
  };
}
