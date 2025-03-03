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

    try {
      // Use the simplified aggregation logic
      const aggregated = aggregateResponseData(responseData);
      setAggregatedData(aggregated);
    } catch (error) {
      console.error('Error processing aggregated data:', error);
      setAggregatedData({});
    }
  };

  console.log({ aggregatedData });

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

// Helper function to aggregate response data - simplified version
function aggregateResponseData(responses) {
  // If there are no responses, return empty object
  if (!responses || responses.length === 0) {
    return {};
  }

  const aggregated = {};

  // Process all responses to build the aggregated data
  responses.forEach((response) => {
    if (!response.answers) return;

    response.answers.forEach((answer) => {
      const questionId = answer.questionId;
      if (!questionId) return;

      // Initialize the question data structure if it doesn't exist yet
      if (!aggregated[questionId]) {
        aggregated[questionId] = {
          questionText: answer.question?.text || 'Unknown Question',
          type: answer.question?.type || 'Unknown Type',
          values: [],
          options: answer.question?.options || [],
        };
      }

      // Add this answer's value to the collection
      if (answer.value !== null && answer.value !== undefined) {
        aggregated[questionId].values.push(answer.value);
      }
    });
  });

  // Calculate aggregations for each question type
  Object.keys(aggregated).forEach((questionId) => {
    const question = aggregated[questionId];
    const values = question.values;
    const type = question.type?.toLowerCase();

    // Handle number/integer questions
    if (type === 'integer' || type === 'number') {
      // Existing number logic...
      const numericValues = values
        .map((v) => {
          if (v === '' || v === null) return 0;
          return parseFloat(v);
        })
        .filter((v) => !isNaN(v));

      question.sum = numericValues.reduce((sum, val) => sum + val, 0);
      question.count = numericValues.length;
      question.average = question.count > 0 ? question.sum / question.count : 0;
    }
    // Handle text/textarea questions
    else if (
      type === 'text' ||
      type === 'textarea' ||
      type === 'single_line' ||
      type === 'multi_line'
    ) {
      // Existing text logic...
      const frequencies = {};
      values.forEach((value) => {
        if (value && value.trim() !== '') {
          frequencies[value] = (frequencies[value] || 0) + 1;
        }
      });

      let mostFrequentValue = null;
      let maxCount = 0;

      Object.entries(frequencies).forEach(([value, count]) => {
        if (count > maxCount) {
          mostFrequentValue = value;
          maxCount = count;
        }
      });

      question.mostFrequent = {
        value: mostFrequentValue,
        count: maxCount,
      };
    }
    // Handle checkbox questions
    else if (type === 'checkbox') {
      // Initialize counts for each option
      const optionCounts = new Array(question.options.length).fill(0);
      let totalSelections = 0;

      // Process each response
      values.forEach((value) => {
        if (!value) return; // Skip empty values

        try {
          // Parse the JSON string to get selected indices
          const selectedIndices = JSON.parse(value);

          // Count each selected option
          if (Array.isArray(selectedIndices)) {
            selectedIndices.forEach((index) => {
              if (index >= 0 && index < optionCounts.length) {
                optionCounts[index]++;
                totalSelections++;
              }
            });
          }
        } catch (e) {
          // Handle parsing errors (malformed JSON)
          console.error('Error parsing checkbox value:', e);
        }
      });

      // Calculate selection percentages
      const totalResponses = values.filter((v) => v).length;
      const optionStats = question.options.map((option, index) => ({
        text: option,
        count: optionCounts[index] || 0, // Ensure we have a value
        percentage:
          totalResponses > 0 ? (optionCounts[index] / totalResponses) * 100 : 0,
      }));

      // Sort by count descending
      const sortedOptions = [...optionStats].sort((a, b) => b.count - a.count);

      // Store the aggregated data
      question.optionStats = optionStats;
      question.mostSelected = sortedOptions[0] || null;
      question.totalResponses = totalResponses;
      question.totalSelections = totalSelections;
    }
  });

  return aggregated;
}
