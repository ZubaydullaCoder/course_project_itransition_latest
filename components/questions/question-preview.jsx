// 'use client';

// import { useState } from 'react';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Switch } from '@/components/ui/switch';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { QUESTION_TYPES } from '@/lib/constants/questions';
// import { usePreviewMode } from '@/contexts/preview-mode-context';

// export function QuestionPreview({ question }) {
//   const { isPreviewMode } = usePreviewMode();
//   const [value, setValue] = useState('');
//   const [checked, setChecked] = useState(false);

//   const renderInput = () => {
//     const commonProps = isPreviewMode
//       ? {}
//       : { disabled: true, className: 'bg-muted' };

//     switch (question.type) {
//       case QUESTION_TYPES.SINGLE_LINE:
//         return (
//           <Input
//             {...commonProps}
//             placeholder="Single line answer"
//             value={isPreviewMode ? value : ''}
//             onChange={(e) => setValue(e.target.value)}
//           />
//         );
//       case QUESTION_TYPES.MULTI_LINE:
//         return (
//           <Textarea
//             {...commonProps}
//             placeholder="Multi line answer"
//             value={isPreviewMode ? value : ''}
//             onChange={(e) => setValue(e.target.value)}
//           />
//         );
//       case QUESTION_TYPES.INTEGER:
//         return (
//           <Input
//             {...commonProps}
//             type="number"
//             placeholder="0"
//             value={isPreviewMode ? value : ''}
//             onChange={(e) => setValue(e.target.value)}
//           />
//         );
//       case QUESTION_TYPES.CHECKBOX:
//         return (
//           <Checkbox
//             {...commonProps}
//             checked={isPreviewMode ? checked : false}
//             onCheckedChange={setChecked}
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="space-y-2">
//       <div className="flex items-start justify-between gap-2">
//         <div className="space-y-1">
//           <p className="font-medium">
//             {question.text}
//             {question.required && (
//               <span className="text-destructive ml-1">*</span>
//             )}
//           </p>
//           {!isPreviewMode && (
//             <div className="flex gap-2">
//               <Badge variant="outline">
//                 {question.type.replace('_', ' ').toUpperCase()}
//               </Badge>
//               {question.required && <Badge variant="secondary">Required</Badge>}
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="pt-2">{renderInput()}</div>
//     </div>
//   );
// }
