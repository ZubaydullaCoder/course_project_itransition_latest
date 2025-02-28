'use client';

import { useState, useEffect, useCallback } from 'react';
import { Separator } from '@/components/ui/separator';
import { getTemplateResponses } from '@/lib/actions/template-actions';
import { useToast } from '@/hooks/use-toast';
import { ResponsesTable } from './responses-table';
import { ResponseSummary } from './response-summary';
import { ResponseDetailsModal } from '../response-details-modal';
import { DeleteResponseDialog } from './delete-response-dialog';

export function TemplateResultsTab({ templateId }) {
  const { toast } = useToast();
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aggregatedData, setAggregatedData] = useState({});
  const [selectedResponseId, setSelectedResponseId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState(null);

  const loadResponses = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getTemplateResponses(templateId);
      if (result.error) {
        setError(result.error);
      } else {
        setResponses(result.data || []);
        processAggregatedData(result.data || []);
      }
    } catch (err) {
      setError('Failed to load responses');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [templateId]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  const handleViewResponse = (responseId) => {
    setSelectedResponseId(responseId);
    setIsModalOpen(true);
  };

  const handleDeleteResponse = (response) => {
    setResponseToDelete(response);
  };

  const handleDeleteSuccess = (deletedId) => {
    // Remove the deleted response from state
    const updatedResponses = responses.filter((r) => r.id !== deletedId);
    setResponses(updatedResponses);

    // Update aggregated data with filtered responses
    processAggregatedData(updatedResponses);

    toast({
      title: 'Success',
      description: 'Response deleted successfully',
    });
  };

  const processAggregatedData = (responseData) => {
    if (!responseData.length) {
      setAggregatedData({});
      return;
    }

    // Use the extracted aggregation logic
    const aggregated = aggregateResponseData(responseData);
    setAggregatedData(aggregated);
  };

  return (
    <div className="space-y-6">
      {/* Responses Table Component */}
      <ResponsesTable
        responses={responses}
        isLoading={isLoading}
        error={error}
        onRefresh={loadResponses}
        onViewResponse={handleViewResponse}
        onDeleteResponse={handleDeleteResponse}
      />

      <Separator />

      {/* Response Summary Component */}
      <ResponseSummary
        aggregatedData={aggregatedData}
        responseCount={responses.length}
        isLoading={isLoading}
      />

      {/* Response Details Modal */}
      <ResponseDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        responseId={selectedResponseId}
        templateId={templateId}
      />

      {/* Delete Response Dialog */}
      <DeleteResponseDialog
        responseToDelete={responseToDelete}
        onClose={() => setResponseToDelete(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

// Helper function to aggregate response data
function aggregateResponseData(responses) {
  const aggregated = {};

  // Initialize aggregation structure from first response
  if (responses.length > 0) {
    const sample = responses[0];
    sample.answers.forEach((answer) => {
      const questionId = answer.questionId;
      const questionType = answer.question?.type;

      aggregated[questionId] = {
        questionText: answer.question?.text || 'Unknown Question',
        type: questionType,
        data: {},
      };

      // Initialize metrics based on question type
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

    // Process all responses
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

    // Calculate derived metrics
    Object.keys(aggregated).forEach((questionId) => {
      const question = aggregated[questionId];

      if (question.type === 'NUMBER') {
        question.average = question.count ? question.sum / question.count : 0;
      } else if (question.type === 'CHECKBOX') {
        const total = question.trueCount + question.falseCount;
        question.percentage = total ? (question.trueCount / total) * 100 : 0;
      }
    });
  }

  return aggregated;
}
