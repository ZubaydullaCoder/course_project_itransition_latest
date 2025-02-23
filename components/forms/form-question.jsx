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

export function FormQuestion({ question, control }) {
  const renderInput = (field) => {
    switch (question.type) {
      case QUESTION_TYPES.SINGLE_LINE:
        return <Input {...field} />;
      case QUESTION_TYPES.MULTI_LINE:
        return <Textarea {...field} />;
      case QUESTION_TYPES.INTEGER:
        return <Input {...field} type="number" />;
      case QUESTION_TYPES.CHECKBOX:
        return (
          <Checkbox
            checked={field.value === 'true'}
            onCheckedChange={(checked) => field.onChange(checked.toString())}
          />
        );
      default:
        return null;
    }
  };

  return (
    <FormField
      control={control}
      name={question.id}
      render={({ field }) => (
        <FormItem>
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
