// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Plus } from 'lucide-react';
// import { QuestionTypeSelector } from './question-type-selector';
// import { QuestionForm } from './question-form';

// export function QuestionCreator({ templateId, questionCounts }) {
//   const [selectedType, setSelectedType] = useState(null);

//   return (
//     <div className="space-y-4">
//       {!selectedType ? (
//         <>
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-medium">Add Question</h3>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setSelectedType(null)}
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Add Question
//             </Button>
//           </div>
//           <QuestionTypeSelector
//             onSelect={setSelectedType}
//             questionCounts={questionCounts}
//           />
//         </>
//       ) : (
//         <QuestionForm
//           templateId={templateId}
//           type={selectedType}
//           onCancel={() => setSelectedType(null)}
//           onSuccess={() => setSelectedType(null)}
//         />
//       )}
//     </div>
//   );
// }
