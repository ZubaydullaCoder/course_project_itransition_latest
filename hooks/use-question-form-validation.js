
'use client';

import { useState } from 'react';

export function useQuestionFormValidation() {
  const [touched, setTouched] = useState(false);
  const [optionsTouched, setOptionsTouched] = useState({});

  const markAsTouched = () => setTouched(true);

  const markOptionAsTouched = (index) => {
    setOptionsTouched((prev) => ({ ...prev, [index]: true }));
  };

  const markAllOptionsTouched = (optionsCount) => {
    const newOptionsTouched = {};
    for (let i = 0; i < optionsCount; i++) {
      newOptionsTouched[i] = true;
    }
    setOptionsTouched(newOptionsTouched);
  };

  return {
    touched,
    optionsTouched,
    markAsTouched,
    markOptionAsTouched,
    markAllOptionsTouched,
    setTouched,
    setOptionsTouched,
  };
}
