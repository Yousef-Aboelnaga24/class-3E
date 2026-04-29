import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Passwords do not match',
  path: ['password_confirmation'],
})

export const postSchema = z.object({
  content: z.string().min(1, 'Write something to share!').max(2000, 'Too long (max 2000 chars)'),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Write a comment').max(500, 'Comment too long'),
})

export const confessionSchema = z.object({
  content: z.string().min(10, 'Tell us a bit more...').max(500, 'Keep it under 500 characters'),
  is_anonymous: z.boolean().default(true),
  recipient_id: z.number().optional().nullable(),
})

export const timelineSchema = z.object({
  title: z.string().min(2, 'Add a title'),
  date: z.string().min(1, 'Pick a date'),
  description: z.string().min(10, 'Describe this memory'),
  emoji: z.string().optional(),
})
