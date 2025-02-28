'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { QuestionSummaryCard } from './question-summary-card';

export function ResponseSummary({ aggregatedData, responseCount, isLoading }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">
            Response Summary
          </CardTitle>
          <Badge variant="outline" className="ml-2">
            {responseCount} {responseCount === 1 ? 'response' : 'responses'}{' '}
            total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : responseCount === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No data to summarize</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(aggregatedData).map(([questionId, item]) => (
              <QuestionSummaryCard
                key={questionId}
                questionData={item}
                responseCount={responseCount}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
