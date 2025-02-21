// 'use client';

// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardFooter } from '@/components/ui/card';
// import { useToast } from '@/hooks/use-toast';
// import { addQuestionToTemplate } from '@/lib/actions/question-manager-actions';

// import { QUESTION_TYPES } from '@/lib/constants/questions';

// export function QuestionForm({ templateId, type, onCancel, onSuccess }) {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [required, setRequired] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const formData = new FormData(e.target);
//       formData.append('type', type);
//       formData.append('required', required.toString());

//       const result = await addQuestionToTemplate(templateId, formData);

//       if (result.error) {
//         toast({
//           variant: 'destructive',
//           title: 'Error',
//           description: result.error,
//         });
//         return;
//       }

//       toast({
//         title: 'Success',
//         description: 'Question added successfully',
//       });
//       onSuccess?.();
//     } catch (error) {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Failed to add question',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   function renderInputPreview() {
//     switch (type) {
//       case QUESTION_TYPES.SINGLE_LINE:
//         return <Input disabled placeholder="Single line answer" />;
//       case QUESTION_TYPES.MULTI_LINE:
//         return <Textarea disabled placeholder="Multi line answer" />;
//       case QUESTION_TYPES.INTEGER:
//         return <Input type="number" disabled placeholder="0" />;
//       case QUESTION_TYPES.CHECKBOX:
//         return <Switch disabled />;
//       default:
//         return null;
//     }
//   }

//   return (
//     <Card>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-4 pt-6">
//           <div className="space-y-2">
//             <Input
//               name="text"
//               placeholder="Enter your question"
//               required
//               minLength={3}
//               maxLength={500}
//               disabled={isLoading}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-muted-foreground">
//               Answer Preview:
//             </label>
//             {renderInputPreview()}
//           </div>

//           <div className="flex items-center gap-2">
//             <Switch
//               checked={required}
//               onCheckedChange={setRequired}
//               disabled={isLoading}
//             />
//             <span className="text-sm">Required question</span>
//           </div>
//         </CardContent>

//         <CardFooter className="flex justify-end gap-2">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={onCancel}
//             disabled={isLoading}
//           >
//             Cancel
//           </Button>
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? 'Adding...' : 'Add Question'}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   );
// }
