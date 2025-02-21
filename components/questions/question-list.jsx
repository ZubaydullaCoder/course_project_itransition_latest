// 'use client';

// import { useState } from 'react';
// import {
//   DndContext,
//   closestCenter,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { SortableQuestionItem } from './sortable-question-item';
// import { useToast } from '@/hooks/use-toast';
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import {
//   reorderQuestions,
//   deleteQuestion,
// } from '@/lib/actions/question-manager-actions';
// import { QuestionPreview } from './question-preview';
// import { usePreviewMode } from '@/contexts/preview-mode-context';

// export function QuestionList({
//   questions: initialQuestions,
//   onQuestionsChange,
//   onQuestionDelete,
// }) {
//   const [questions, setQuestions] = useState(initialQuestions);
//   const [deleteId, setDeleteId] = useState(null);
//   const [isReordering, setIsReordering] = useState(false);
//   const { isPreviewMode } = usePreviewMode();
//   const { toast } = useToast();

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   const handleDragEnd = async (event) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) return;

//     const oldIndex = questions.findIndex((q) => q.id === active.id);
//     const newIndex = questions.findIndex((q) => q.id === over.id);

//     const newQuestions = arrayMove(questions, oldIndex, newIndex);
//     setQuestions(newQuestions);
//     setIsReordering(true);

//     try {
//       const result = await reorderQuestions(
//         templateId,
//         newQuestions.map((q) => q.id)
//       );

//       if (result.error) {
//         toast({
//           variant: 'destructive',
//           title: 'Error',
//           description: result.error,
//         });
//         // Revert to original order
//         setQuestions(initialQuestions);
//         return;
//       }

//       toast({
//         title: 'Success',
//         description: 'Questions reordered successfully',
//       });
//     } catch (error) {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Failed to reorder questions',
//       });
//       // Revert to original order
//       setQuestions(initialQuestions);
//     } finally {
//       setIsReordering(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;

//     try {
//       const result = await deleteQuestion(deleteId);

//       if (result.error) {
//         toast({
//           variant: 'destructive',
//           title: 'Error',
//           description: result.error,
//         });
//         return;
//       }

//       // Remove question from local state
//       setQuestions(questions.filter((q) => q.id !== deleteId));

//       toast({
//         title: 'Success',
//         description: result.success,
//       });
//     } finally {
//       setDeleteId(null);
//     }
//   };

//   if (!questions.length) {
//     return (
//       <div className="text-center text-muted-foreground py-8">
//         No questions added yet
//       </div>
//     );
//   }
//   if (isPreviewMode) {
//     return (
//       <div className="space-y-6">
//         {questions.map((question) => (
//           <QuestionPreview key={question.id} question={question} />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <>
//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={questions.map((q) => q.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           <div className="space-y-4">
//             {questions.map((question) => (
//               <SortableQuestionItem
//                 key={question.id}
//                 question={question}
//                 onDelete={setDeleteId}
//               />
//             ))}
//           </div>
//         </SortableContext>
//       </DndContext>

//       <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the
//               question.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={handleDelete}
//               className="bg-destructive hover:bg-destructive/90"
//             >
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
