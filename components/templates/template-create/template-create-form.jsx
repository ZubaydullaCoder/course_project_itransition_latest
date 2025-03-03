'use client';

import { useRouter } from 'next/navigation';
import { useTemplateForm } from '@/hooks/use-template-form';
import { useFormFields } from '@/hooks/use-form-fields';
import { SmartForm } from '@/components/common/smart-form';
import { FormSection } from '@/components/common/form-section';
import { QuestionsSection } from '@/components/questions/questions-section';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function TemplateCreateForm() {
  const router = useRouter();

  const {
    form,
    questions,
    setQuestions,
    isDisabled,
    isSubmitting,
    setIsUploading,
    handleSubmit,
  } = useTemplateForm({
    successMessage: 'Template created successfully',
    redirectPath: '/templates',
  });

  const {
    renderTextField,
    renderTopicField,
    renderTagsField,
    renderVisibilityField,
    renderAllowedUsersField,
    renderImageField,
  } = useFormFields();

  const isPublic = form.watch('isPublic');

  const checkAndSubmit = async () => {
    // First validate the form fields with React Hook Form
    const isFormValid = await form.trigger();

    // Then manually check all checkbox questions options
    let allQuestionsValid = true;
    const invalidQuestions = [];

    questions.forEach((question) => {
      if (question.type === QUESTION_TYPES.CHECKBOX) {
        const isValid =
          question.options &&
          question.options.length >= 2 &&
          question.options.every((option) => option.trim());

        if (!isValid) {
          allQuestionsValid = false;
          invalidQuestions.push(question.id);
        }
      }

      // Also check for empty titles
      if (!question.text?.trim()) {
        allQuestionsValid = false;
        invalidQuestions.push(question.id);
      }
    });

    // Only submit if both validations pass
    if (isFormValid && allQuestionsValid) {
      return handleSubmit();
    } else {
      // Mark all fields as touched
      form.trigger();

      // Mark question titles and options as touched
      // This will dispatch a custom event that SortableQuestionForm components can listen for
      if (invalidQuestions.length > 0) {
        // Create and dispatch a custom event
        const event = new CustomEvent('markQuestionsAsTouched', {
          detail: { questionIds: invalidQuestions },
        });
        document.dispatchEvent(event);
      }

      return false;
    }
  };

  return (
    <SmartForm
      form={form}
      onSubmit={checkAndSubmit}
      onCancel={() => router.back()}
      isSubmitting={isSubmitting}
      isDisabled={isDisabled}
      submitText="Create Template"
      submittingText="Creating..."
    >
      <FormSection
        title="Basic Information"
        description="Provide basic details about your template"
      >
        {renderTextField({
          control: form.control,
          name: 'title',
          label: 'Title',
          description: 'Give your template a clear and descriptive title',
          disabled: isDisabled,
        })}

        {renderTextField({
          control: form.control,
          name: 'description',
          label: 'Description',
          description: 'Describe what this template is for',
          multiline: true,
          disabled: isDisabled,
        })}

        {renderTopicField({
          control: form.control,
          disabled: isDisabled,
        })}

        {renderTagsField({
          control: form.control,
          disabled: isDisabled,
        })}

        {renderVisibilityField({
          control: form.control,
          disabled: isDisabled,
        })}

        {renderAllowedUsersField({
          control: form.control,
          disabled: isDisabled,
          isPublic,
        })}

        {renderImageField({
          control: form.control,
          disabled: isDisabled,
          onUploadingChange: setIsUploading,
        })}
      </FormSection>

      <FormSection
        title="Questions"
        description="Add and organize your template questions"
        withSeparator
      >
        <QuestionsSection
          value={questions}
          onChange={setQuestions}
          disabled={isDisabled}
        />
      </FormSection>
    </SmartForm>
  );
}
