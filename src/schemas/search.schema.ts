import { z } from 'zod'

/**
 * Search Schema - Validation for global contact search
 */

/**
 * Search Fields Enum - Fields that can be searched
 */
export const searchFieldEnum = z.enum(['name', 'company', 'position'], {
  message: 'Search field must be one of: name, company, or position',
})

/**
 * Global Search Input Schema - For searching contacts globally
 */
export const globalSearchInputSchema = z.object({
  query: z
    .string({ message: 'Search query must be a string' })
    .min(2, { message: 'Search query must be at least 2 characters' })
    .max(100, { message: 'Search query must be less than 100 characters' })
    .trim(),
  fields: z
    .array(searchFieldEnum)
    .min(1, { message: 'At least one search field is required' })
    .default(['name', 'company', 'position']),
  page: z
    .number({ message: 'Page must be a number' })
    .int({ message: 'Page must be an integer' })
    .min(1, { message: 'Page must be at least 1' })
    .default(1),
  pageSize: z
    .number({ message: 'Page size must be a number' })
    .int({ message: 'Page size must be an integer' })
    .min(1, { message: 'Page size must be at least 1' })
    .max(100, { message: 'Page size must be at most 100' })
    .default(25),
})

/**
 * Search Result Schema - Contact with owner information and request status
 */
export const searchResultSchema = z.object({
  // Contact information
  id: z.number(),
  name: z.string(),
  email: z.string(),
  company: z.string().nullable(),
  position: z.string().nullable(),
  phone: z.string().nullable(),
  linkedinUrl: z.string().nullable(),
  createdAt: z.date(),

  // Owner information
  ownerId: z.string(),
  ownerName: z.string(),
  ownerEmail: z.string(),
  ownerCompany: z.string().nullable(),
  ownerPosition: z.string().nullable(),

  // Request status
  hasPendingRequest: z.boolean(),
  pendingRequestId: z.number().nullable(),
})

/**
 * Global Search Response Schema
 */
export const globalSearchResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(searchResultSchema),
  total: z.number(),
})

// Type exports
export type SearchField = z.infer<typeof searchFieldEnum>
export type GlobalSearchInput = z.infer<typeof globalSearchInputSchema>
export type SearchResult = z.infer<typeof searchResultSchema>
export type GlobalSearchResponse = z.infer<typeof globalSearchResponseSchema>
