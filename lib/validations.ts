import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  comment: z
    .string()
    .min(10, 'Review must be at least 10 characters')
    .max(500, 'Review must be less than 500 characters'),
})

export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  sort: z
    .enum(['popular', 'rating', 'newest', 'name'])
    .optional()
    .default('popular'),
  price: z.enum(['all', 'free', 'paid']).optional().default('all'),
  minRating: z.number().min(0).max(5).optional(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(50).optional().default(20),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type SearchInput = z.infer<typeof searchSchema>
