'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  RotateCw,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Eye,
  Trash2,
} from 'lucide-react';
import { getTemplateResponses } from '@/lib/actions/template-actions';
import { formatDate } from '@/lib/utils';

import { Skeleton } from '@/components/ui/skeleton';

import { ResponseDetailsModal } from './response-details-modal';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { deleteResponse } from '@/lib/actions/form-actions';

export function TemplateResultsTab({ templateId }) {
  const { toast } = useToast();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aggregatedData, setAggregatedData] = useState({});
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add sorting state
  const [sorting, setSorting] = useState({
    column: 'createdAt',
    direction: 'desc',
  });

  useEffect(() => {
    async function fetchResponses() {
      setIsLoading(true);
      try {
        const result = await getTemplateResponses(templateId);
        if (result.error) {
          setError(result.error);
        } else {
          setResponses(result.data || []);
          aggregateResponseData(result.data || []);
        }
      } catch (err) {
        setError('Failed to load responses');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResponses();
  }, [templateId]);

  function aggregateResponseData(responses) {
    if (!responses.length) return;

    const aggregated = {};

    const sample = responses[0];

    sample.answers.forEach((answer) => {
      const questionId = answer.questionId;
      const questionType = answer.question?.type;

      aggregated[questionId] = {
        questionText: answer.question?.text || 'Unknown Question',
        type: questionType,
        data: {},
      };

      if (questionType === 'NUMBER') {
        aggregated[questionId].sum = 0;
        aggregated[questionId].count = 0;
        aggregated[questionId].average = 0;
      } else if (questionType === 'TEXT' || questionType === 'TEXTAREA') {
        aggregated[questionId].frequencies = {};
        aggregated[questionId].mostFrequent = { value: null, count: 0 };
      } else if (questionType === 'CHECKBOX') {
        aggregated[questionId].trueCount = 0;
        aggregated[questionId].falseCount = 0;
        aggregated[questionId].percentage = 0;
      }
    });

    responses.forEach((response) => {
      response.answers.forEach((answer) => {
        const questionId = answer.questionId;
        const type = aggregated[questionId]?.type;

        if (type === 'NUMBER') {
          const value = parseInt(answer.value || '0');
          if (!isNaN(value)) {
            aggregated[questionId].sum += value;
            aggregated[questionId].count += 1;
          }
        } else if (type === 'TEXT' || type === 'TEXTAREA') {
          const value = answer.value || '';
          if (value) {
            aggregated[questionId].frequencies[value] =
              (aggregated[questionId].frequencies[value] || 0) + 1;

            if (
              aggregated[questionId].frequencies[value] >
              (aggregated[questionId].mostFrequent?.count || 0)
            ) {
              aggregated[questionId].mostFrequent = {
                value: value,
                count: aggregated[questionId].frequencies[value],
              };
            }
          }
        } else if (type === 'CHECKBOX') {
          const checked = answer.value === 'true';
          if (checked) {
            aggregated[questionId].trueCount += 1;
          } else {
            aggregated[questionId].falseCount += 1;
          }
        }
      });
    });

    Object.keys(aggregated).forEach((questionId) => {
      const question = aggregated[questionId];

      if (question.type === 'NUMBER') {
        question.average = question.count ? question.sum / question.count : 0;
      } else if (question.type === 'CHECKBOX') {
        const total = question.trueCount + question.falseCount;
        question.percentage = total ? (question.trueCount / total) * 100 : 0;
      }
    });

    setAggregatedData(aggregated);
  }

  // Handle sorting
  const handleSort = (column) => {
    setSorting((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Helper for sort indicator
  const getSortIcon = (column) => {
    if (sorting.column !== column)
      return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sorting.direction === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  // Sort responses
  const sortedResponses = [...responses].sort((a, b) => {
    const { column, direction } = sorting;

    // For user name sorting
    if (column === 'user') {
      const nameA = a.user?.name || '';
      const nameB = b.user?.name || '';
      return direction === 'asc'
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }

    // For dates
    if (column === 'createdAt' || column === 'updatedAt') {
      const dateA = new Date(a[column]);
      const dateB = new Date(b[column]);
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    }

    // For status
    if (column === 'status') {
      const statusA = a.updatedAt !== a.createdAt ? 'Updated' : 'Submitted';
      const statusB = b.updatedAt !== b.createdAt ? 'Updated' : 'Submitted';
      return direction === 'asc'
        ? statusA.localeCompare(statusB)
        : statusB.localeCompare(statusA);
    }

    return 0;
  });

  // Handle refresh
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const result = await getTemplateResponses(templateId);
      if (result.error) {
        setError(result.error);
      } else {
        setResponses(result.data || []);
        aggregateResponseData(result.data || []);
      }
    } catch (err) {
      setError('Failed to refresh responses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewResponse = (responseId) => {
    setSelectedResponseId(responseId);
    setIsModalOpen(true);
  };

  // Handle delete response
  const handleDelete = async () => {
    if (!responseToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteResponse(responseToDelete.id);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error,
        });
      } else {
        // Remove the deleted response from state
        setResponses(responses.filter((r) => r.id !== responseToDelete.id));

        // Update aggregated data
        aggregateResponseData(
          responses.filter((r) => r.id !== responseToDelete.id)
        );

        toast({
          title: 'Success',
          description: 'Response deleted successfully',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete response',
      });
    } finally {
      setIsDeleting(false);
      setResponseToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Form Responses
            </CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-center text-destructive p-4">{error}</div>
          ) : responses.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No responses yet</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('user')}
                    >
                      <div className="flex items-center">
                        User
                        {getSortIcon('user')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center">
                        Submitted Date
                        {getSortIcon('createdAt')}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {getSortIcon('status')}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedResponses.map((response) => (
                    <TableRow key={response.id}>
                      <TableCell className="font-medium">
                        {response.user?.name || 'Unknown User'}
                      </TableCell>
                      <TableCell>{formatDate(response.createdAt)}</TableCell>
                      <TableCell>
                        {response.updatedAt !== response.createdAt ? (
                          <Badge variant="outline">Updated</Badge>
                        ) : (
                          <Badge variant="secondary">Submitted</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewResponse(response.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setResponseToDelete(response)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Aggregation Card - No changes needed */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Response Summary
            </CardTitle>
            <Badge variant="outline" className="ml-2">
              {responses.length}{' '}
              {responses.length === 1 ? 'response' : 'responses'} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Rest of aggregation content remains unchanged */}
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : responses.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No data to summarize</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.values(aggregatedData).map((item) => (
                <Card key={item.questionText} className="border shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <CardTitle className="text-md">
                        {item.questionText}
                      </CardTitle>
                      <Badge className="mt-2 sm:mt-0">{item.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Content for each question type remains unchanged */}
                    {/* NUMBER type */}
                    {item.type === 'NUMBER' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">
                            Total Responses
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {item.count || 0}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">
                            Average
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {item.count ? item.average.toFixed(2) : 'N/A'}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-muted flex flex-col items-center justify-center">
                          <p className="text-sm text-muted-foreground">Sum</p>
                          <p className="text-2xl font-bold mt-1">
                            {item.sum || 0}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* TEXT or TEXTAREA type */}
                    {(item.type === 'TEXT' || item.type === 'TEXTAREA') && (
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Most Common Answer
                        </p>
                        {item.mostFrequent.value ? (
                          <div className="mt-3">
                            <div className="flex justify-between items-center">
                              <div className="max-w-[80%]">
                                <p className="text-md font-medium line-clamp-2">
                                  &quot;{item.mostFrequent.value}&quot;
                                </p>
                              </div>
                              <Badge variant="secondary">
                                {item.mostFrequent.count}{' '}
                                {item.mostFrequent.count === 1
                                  ? 'response'
                                  : 'responses'}
                              </Badge>
                            </div>
                            <div className="mt-2">
                              <div className="w-full bg-secondary h-2 rounded-full">
                                <div
                                  className="bg-primary h-2 rounded-full"
                                  style={{
                                    width: `${Math.min(100, (item.mostFrequent.count / responses.length) * 100)}%`,
                                  }}
                                />
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 text-right">
                                {Math.round(
                                  (item.mostFrequent.count / responses.length) *
                                    100
                                )}
                                % of responses
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-md mt-2">No common answer found</p>
                        )}
                      </div>
                    )}

                    {/* CHECKBOX type */}
                    {item.type === 'CHECKBOX' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-muted p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <p className="text-sm text-muted-foreground">
                              Checked vs Unchecked
                            </p>
                            <Badge variant="outline">
                              {item.percentage.toFixed(1)}% checked
                            </Badge>
                          </div>
                          <div className="w-full bg-secondary h-4 rounded-full">
                            <div
                              className="bg-primary h-4 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span>Checked: {item.trueCount}</span>
                            <span>Unchecked: {item.falseCount}</span>
                          </div>
                        </div>

                        <div className="bg-muted p-4 rounded-lg flex flex-col justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              Response Distribution
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-primary"></div>
                              <span>Checked</span>
                              <span className="font-medium ml-auto">
                                {item.trueCount} ({item.percentage.toFixed(1)}%)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="h-3 w-3 rounded-full bg-secondary"></div>
                              <span>Unchecked</span>
                              <span className="font-medium ml-auto">
                                {item.falseCount} (
                                {(100 - item.percentage).toFixed(1)}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Response Details Modal */}
      <ResponseDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        responseId={selectedResponseId}
        templateId={templateId}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={!!responseToDelete}
        onOpenChange={(open) => !open && setResponseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              response from {responseToDelete?.user?.name || 'this user'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
