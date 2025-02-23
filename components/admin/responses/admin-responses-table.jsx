// // components/admin/responses/admin-responses-table.jsx
// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Eye, Pencil, Trash2 } from 'lucide-react';
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
// import { useToast } from '@/hooks/use-toast';
// import { formatDate } from '@/lib/utils';
// import { deleteResponse } from '@/lib/actions/admin-actions';

// export function AdminResponsesTable({ responses }) {
//   const router = useRouter();
//   const { toast } = useToast();
//   const [deletingId, setDeletingId] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   async function onDelete() {
//     if (!deletingId) return;

//     setIsDeleting(true);
//     try {
//       const result = await deleteResponse(deletingId);
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
//         description: 'Response deleted successfully',
//       });
//       router.refresh();
//     } catch (error) {
//       toast({
//         variant: 'destructive',
//         title: 'Error',
//         description: 'Something went wrong',
//       });
//     } finally {
//       setIsDeleting(false);
//       setDeletingId(null);
//     }
//   }

//   return (
//     <>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Template</TableHead>
//               <TableHead>Respondent</TableHead>
//               <TableHead>Submitted</TableHead>
//               <TableHead>Updated</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {responses?.map((response) => (
//               <TableRow key={response.id}>
//                 <TableCell>{response.template.title}</TableCell>
//                 <TableCell>{response.user.name}</TableCell>
//                 <TableCell>{formatDate(response.createdAt)}</TableCell>
//                 <TableCell>{formatDate(response.updatedAt)}</TableCell>
//                 <TableCell className="text-right">
//                   <div className="flex justify-end gap-2">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() =>
//                         router.push(
//                           `/forms/${response.templateId}/responses/${response.id}`
//                         )
//                       }
//                     >
//                       <Eye className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() =>
//                         router.push(
//                           `/forms/${response.templateId}/responses/${response.id}/edit`
//                         )
//                       }
//                     >
//                       <Pencil className="h-4 w-4" />
//                     </Button>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => setDeletingId(response.id)}
//                     >
//                       <Trash2 className="h-4 w-4 text-destructive" />
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>

//       <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete this response.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={onDelete}
//               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               disabled={isDeleting}
//             >
//               {isDeleting ? 'Deleting...' : 'Delete'}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
