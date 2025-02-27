import { notFound } from 'next/navigation';
import { getTemplateWithQuestions } from '@/lib/actions/form-actions';
import { FormFill } from '@/components/forms/form-fill';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';

export default async function FormPage({ params }) {
  const { templateId } = await params;
  const result = await getTemplateWithQuestions(templateId);

  if (result.error || !result.data) {
    notFound();
  }

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/templates" asChild>
              <Link href="/templates">Templates</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/templates/${result.data.id}`} asChild>
              <Link href={`/templates/${result.data.id}`}>
                {result.data.title}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Fill Form</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{result.data.title}</h1>
        {result.data.description && (
          <p className="text-muted-foreground">{result.data.description}</p>
        )}
      </div>
      <FormFill template={result.data} />
    </div>
  );
}
