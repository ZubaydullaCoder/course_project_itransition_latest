import { z } from 'zod';
import { TEMPLATE_TOPICS } from '../constants/templates';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

export const TemplateSchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z
    .string()
    .max(500, { message: 'Description must be less than 500 characters' })
    .optional()
    .nullable(),
  topic: z.string().refine((value) => TEMPLATE_TOPICS.includes(value), {
    message: 'Please select a valid topic',
  }),
  tags: z
    .string()
    .optional() // Make tags optional
    .transform((str) => {
      // If string is empty or undefined, return empty array
      if (!str) return [];
      // Otherwise process tags
      const tags = str
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      return [...new Set(tags)];
    })
    .refine((tags) => tags.length <= 5, {
      message: 'Maximum 5 tags allowed',
    })
    .refine(
      (tags) => tags.every((tag) => tag.length >= 2 && tag.length <= 20),
      {
        message: 'Each tag must be between 2 and 20 characters',
      }
    )
    .refine((tags) => tags.every((tag) => /^[a-zA-Z0-9-]+$/.test(tag)), {
      message: 'Tags can only contain letters, numbers, and hyphens',
    }),
  isPublic: z.boolean().default(false),
});
