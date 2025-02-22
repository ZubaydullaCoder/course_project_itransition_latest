// components/templates/template-gallery.jsx
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';

export function TemplateGallery({ templates }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <h3 className="font-semibold">{template.title}</h3>
            <p className="text-sm text-muted-foreground">
              by {template.author.name}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.description || 'No description'}
            </p>
          </CardContent>
          <CardFooter>
            <Link
              href={`/templates/${template.id}`}
              className="text-sm text-primary hover:underline"
            >
              View template →
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
