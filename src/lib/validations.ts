import { z } from 'zod'

// Blog post validation schema
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  slug: z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/, 'Slug must start and end with alphanumeric characters, with optional hyphens between'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional().default(''),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  published: z.boolean(),
  seoTitle: z.string().max(60, 'SEO title must be less than 60 characters').optional().default(''),
  seoDescription: z.string().max(160, 'SEO description must be less than 160 characters').optional().default(''),
  seoKeywords: z.array(z.string()).default([])
})

// Blog post update schema (allows partial updates)
export const blogPostUpdateSchema = blogPostSchema.partial()

// Type inference from Zod schema
export type BlogPostValidation = z.infer<typeof blogPostSchema>
export type BlogPostUpdateValidation = z.infer<typeof blogPostUpdateSchema>

// Validation helper function
export function validateBlogPost(data: unknown) {
  return blogPostSchema.safeParse(data)
}

export function validateBlogPostUpdate(data: unknown) {
  return blogPostUpdateSchema.safeParse(data)
}
