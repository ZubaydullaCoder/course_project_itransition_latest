import { TemplateCreateForm } from '@/components/templates/template-create-form';

export default function CreateTemplatePage() {
  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Template</h1>
        <p className="text-muted-foreground">
          Create a new template for your forms
        </p>
      </div>
      <TemplateCreateForm />
    </div>
  );
}
