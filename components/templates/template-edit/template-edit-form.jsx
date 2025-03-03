'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { QuestionsSection } from '@/components/questions/questions-section';
import { useTemplateForm } from '@/hooks/use-template-form';
import { useFormFields } from '@/hooks/use-form-fields';
import { FormActions } from '@/components/ui/form-buttons';
import { QUESTION_TYPES } from '@/lib/constants/questions';

export function TemplateEditForm({ template }) {
  const router = useRouter();

  // Use our template form hook with edit mode settings
  const {
    form,
    questions,
    setQuestions,
    isDisabled,
    isSubmitting,
    setIsUploading,
    hasChanges,
    handleSubmit,
  } = useTemplateForm({
    template,
    successMessage: 'Template updated successfully',
    shouldNavigateBack: true,
    shouldRefreshPage: true,
    isEdit: true,
  });

  // Use our form fields hook
  const {
    renderTextField,
    renderTopicField,
    renderTagsField,
    renderVisibilityField,
    renderAllowedUsersField,
    renderImageField,
  } = useFormFields();

  // Get the current state of isPublic field
  const isPublic = form.watch('isPublic');

  // Add this function to the TemplateEditForm component
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
          question.options.every((option) => option.trim() !== ''); // Ensure trim is applied here

        if (!isValid) {
          allQuestionsValid = false;
          invalidQuestions.push(question.id);
        }
      }

      // Also check for empty titles with trim to ignore spaces
      if (!question.text?.trim()) {
        allQuestionsValid = false;
        invalidQuestions.push(question.id);
      }
    });

    // Only submit if both validations pass
    if (isFormValid && allQuestionsValid) {
      return handleSubmit();
    } else {
      // Mark all fields as touched to show validation errors
      form.trigger();

      // Mark question titles and options as touched
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
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          checkAndSubmit();
        }}
        className="space-y-6"
      >
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Update the basic details of your template
              </p>
            </div>

            {/* Title field */}
            {renderTextField({
              control: form.control,
              name: 'title',
              label: 'Title',
              description: 'Give your template a clear and descriptive title',
              disabled: isDisabled,
            })}

            {/* Description field */}
            {renderTextField({
              control: form.control,
              name: 'description',
              label: 'Description',
              description: 'Describe what this template is for',
              multiline: true,
              disabled: isDisabled,
            })}

            {/* Topic field */}
            {renderTopicField({
              control: form.control,
              disabled: isDisabled,
            })}

            {/* Tags field */}
            {renderTagsField({
              control: form.control,
              disabled: isDisabled,
            })}

            {/* Visibility field */}
            {renderVisibilityField({
              control: form.control,
              disabled: isDisabled,
            })}

            {/* Allowed users field */}
            {renderAllowedUsersField({
              control: form.control,
              disabled: isDisabled,
              isPublic,
            })}

            {/* Image field */}
            {renderImageField({
              control: form.control,
              disabled: isDisabled,
              onUploadingChange: setIsUploading,
            })}
          </div>

          <Separator className="my-8" />

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Questions</h3>
              <p className="text-sm text-muted-foreground">
                Add, remove, or reorder your template questions
              </p>
            </div>

            <QuestionsSection
              value={questions}
              onChange={setQuestions}
              disabled={isDisabled}
            />
          </div>
        </Card>

        <FormActions
          onCancel={() => router.back()}
          isSubmitting={isSubmitting}
          isDisabled={isDisabled}
          hasChanges={hasChanges}
          submitText="Save Changes"
          noChangesText="No Changes"
          submittingText="Saving..."
        />
      </form>
    </Form>
  );
}
