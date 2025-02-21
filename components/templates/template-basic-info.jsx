// 'use client';

// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Switch } from '@/components/ui/switch';
// import { TEMPLATE_TOPICS } from '@/lib/constants/templates';
// import { TemplateSchema } from '@/lib/utils/validators';

// export function TemplateBasicInfo({ onSubmit, isLoading }) {
//   const form = useForm({
//     resolver: zodResolver(TemplateSchema),
//     defaultValues: {
//       title: '',
//       description: '',
//       topic: '',
//       tags: '',
//       isPublic: false,
//     },
//   });

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="title"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Title</FormLabel>
//               <FormControl>
//                 <Input {...field} disabled={isLoading} />
//               </FormControl>
//               <FormDescription>
//                 Give your template a clear and descriptive title
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Textarea {...field} disabled={isLoading} />
//               </FormControl>
//               <FormDescription>
//                 Describe what this template is for
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="topic"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Topic</FormLabel>
//               <Select
//                 onValueChange={field.onChange}
//                 defaultValue={field.value}
//                 disabled={isLoading}
//               >
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a topic" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   {TEMPLATE_TOPICS.map((topic) => (
//                     <SelectItem key={topic} value={topic}>
//                       {topic}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="tags"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Tags</FormLabel>
//               <FormControl>
//                 <Input {...field} disabled={isLoading} />
//               </FormControl>
//               <FormDescription>
//                 Add up to 5 tags (separated by commas)
//               </FormDescription>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="isPublic"
//           render={({ field }) => (
//             <FormItem className="flex items-center gap-2">
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                   disabled={isLoading}
//                 />
//               </FormControl>
//               <FormLabel className="!mt-0">Make this template public</FormLabel>
//             </FormItem>
//           )}
//         />
//       </form>
//     </Form>
//   );
// }
