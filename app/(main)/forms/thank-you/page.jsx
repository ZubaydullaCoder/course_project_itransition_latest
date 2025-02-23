
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function ThankYouPage() {
  return (
    <div className="container max-w-2xl py-20">
      <Card className="p-6">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Thank you for your response!</h1>
            <p className="text-muted-foreground">
              Your form has been successfully submitted.
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/forms/my-responses">View My Responses</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/templates">Back to Templates</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
