import { Card, CardContent } from '@/components/ui/card';

export function TemplateContent({ template }) {
  return (
    <Card>
      <CardContent className="pt-6">
        {template.description ? (
          <p className="whitespace-pre-wrap">{template.description}</p>
        ) : (
          <p className="text-muted-foreground italic">
            No description provided
          </p>
        )}
      </CardContent>
    </Card>
  );
}
