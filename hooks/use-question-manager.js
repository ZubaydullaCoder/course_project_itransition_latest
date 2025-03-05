
'use client';

import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';


export function useQuestionManager({ initialQuestions = [], onChange }) {
  const [questions, setQuestions] = useState(initialQuestions);

  
  const questionCounts = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {});

  
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

  
  const updateQuestion = (id, changes) => {
    const newQuestions = questions.map((q) =>
      q.id === id ? { ...q, ...changes } : q
    );
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  
  const removeQuestion = (id) => {
    const newQuestions = questions.filter((q) => q.id !== id);
    setQuestions(newQuestions);
    onChange?.(newQuestions);
  };

  
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
