import { TemplateCreateForm } from '@/components/templates/template-create-form';

export default function CreateTemplatePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-bold">Create Template</h1>
          <p className="text-muted-foreground">
            Create a new template for your forms
          </p>
        </div>
        <TemplateCreateForm />
      </div>
    </div>
  );
}
