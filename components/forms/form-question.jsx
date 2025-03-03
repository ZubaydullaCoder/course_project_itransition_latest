'use client';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { QUESTION_TYPES } from '@/lib/constants/questions';
import { useState } from 'react';

export function FormQuestion({ question, control, disabled = false }) {
  const renderInput = (field) => {
    switch (question.type) {
      case QUESTION_TYPES.SINGLE_LINE:
        return <Input {...field} disabled={disabled} />;
      case QUESTION_TYPES.MULTI_LINE:
        return <Textarea {...field} disabled={disabled} />;
      case QUESTION_TYPES.INTEGER:
        return <Input {...field} type="number" disabled={disabled} />;
      case QUESTION_TYPES.CHECKBOX:
        // Handle checkbox questions with multiple options
        if (question.options && question.options.length >= 2) {
          const selectedValues = field.value ? JSON.parse(field.value) : [];

          return (
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`${question.id}-option-${index}`}
                    checked={selectedValues.includes(index)}
                    onCheckedChange={(checked) => {
                      const newSelectedValues = [...selectedValues];
                      if (checked) {
                        if (!newSelectedValues.includes(index)) {
                          newSelectedValues.push(index);
                        }
                      } else {
                        const valueIndex = newSelectedValues.indexOf(index);
                        if (valueIndex !== -1) {
                          newSelectedValues.splice(valueIndex, 1);
                        }
                      }
                      field.onChange(JSON.stringify(newSelectedValues));
                    }}
                    disabled={disabled}
                  />
                  <label
                    htmlFor={`${question.id}-option-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={question.id}
      render={({ field }) => (
        <FormItem
          className={
            question.type === QUESTION_TYPES.CHECKBOX ? 'space-y-3' : ''
          }
        >
          <FormLabel>
            {question.text}
            {question.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </FormLabel>
          <FormControl>{renderInput(field)}</FormControl>
          {question.description && (
            <FormDescription>{question.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
