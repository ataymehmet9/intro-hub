import { z } from 'zod'

/**
 * Dashboard Schemas
 *
 * Validation schemas for dashboard analytics and statistics
 */

// Granularity options for time-series data
export const granularityEnum = z.enum(['daily', 'weekly', 'monthly'])
export type Granularity = z.infer<typeof granularityEnum>

// Date range query input
export const dashboardQuerySchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  granularity: granularityEnum.optional(),
})
export type DashboardQuery = z.infer<typeof dashboardQuerySchema>

// Response time metrics
export const responseTimeSchema = z.object({
  avgSeconds: z.number(),
  avgHours: z.number(),
  avgDays: z.number(),
  formatted: z.string(), // e.g., "2 days 5 hours" or "8 hours"
})
export type ResponseTime = z.infer<typeof responseTimeSchema>

// Core statistics for a period
export const periodStatsSchema = z.object({
  totalContacts: z.number(),
  requestsMade: z.number(),
  requestsReceived: z.number(),
  requestsApproved: z.number(),
  requestsDeclined: z.number(),
  requestsPending: z.number(),
  approvalRate: z.number(), // percentage
  rejectionRate: z.number(), // percentage
  avgResponseTimeReceived: responseTimeSchema.nullable(), // Your response time as approver
  avgResponseTimeMade: responseTimeSchema.nullable(), // Others' response time to your requests
})
export type PeriodStats = z.infer<typeof periodStatsSchema>

// Comparison between current and previous period
export const statsComparisonSchema = z.object({
  current: periodStatsSchema,
  previous: periodStatsSchema,
  changes: z.object({
    totalContacts: z.number(), // percentage change
    requestsMade: z.number(),
    requestsReceived: z.number(),
    approvalRate: z.number(),
    rejectionRate: z.number(),
    avgResponseTimeReceived: z.number().nullable(),
    avgResponseTimeMade: z.number().nullable(),
  }),
})
export type StatsComparison = z.infer<typeof statsComparisonSchema>

// Single data point in time series
export const trendDataPointSchema = z.object({
  date: z.string(), // ISO date string
  requestsMade: z.number(),
  requestsReceived: z.number(),
  requestsApproved: z.number(),
  requestsDeclined: z.number(),
  requestsPending: z.number(),
})
export type TrendDataPoint = z.infer<typeof trendDataPointSchema>

// Time series data response
export const trendDataSchema = z.object({
  granularity: granularityEnum,
  dataPoints: z.array(trendDataPointSchema),
})
export type TrendData = z.infer<typeof trendDataSchema>

// Status breakdown for donut chart
export const statusBreakdownSchema = z.object({
  pending: z.number(),
  approved: z.number(),
  declined: z.number(),
  total: z.number(),
  pendingPercentage: z.number(),
  approvedPercentage: z.number(),
  declinedPercentage: z.number(),
})
export type StatusBreakdown = z.infer<typeof statusBreakdownSchema>

// Top contact by request count
export const topContactSchema = z.object({
  contactId: z.number(),
  contactName: z.string(),
  contactEmail: z.string(),
  contactCompany: z.string().nullable(),
  requestCount: z.number(),
  approvedCount: z.number(),
  declinedCount: z.number(),
  pendingCount: z.number(),
})
export type TopContact = z.infer<typeof topContactSchema>

// Top contacts response
export const topContactsSchema = z.object({
  contacts: z.array(topContactSchema),
  limit: z.number(),
})
export type TopContacts = z.infer<typeof topContactsSchema>

// Complete dashboard response
export const dashboardStatsSchema = z.object({
  dateRange: z.object({
    start: z.date(),
    end: z.date(),
  }),
  stats: statsComparisonSchema,
  statusBreakdown: statusBreakdownSchema,
})
export type DashboardStats = z.infer<typeof dashboardStatsSchema>

// Export data schema
export const exportDataSchema = z.object({
  format: z.enum(['csv', 'json']),
  includeCharts: z.boolean().optional(),
})
export type ExportData = z.infer<typeof exportDataSchema>
