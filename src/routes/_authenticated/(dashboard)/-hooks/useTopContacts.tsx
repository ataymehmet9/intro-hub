import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '@/integrations/trpc/react'
import { useDashboardStore } from '../-store/dashboardStore'

/**
 * Hook to fetch top contacts by request count with caching
 */
export function useTopContacts(limit: number = 10) {
  const { dateRange, granularity } = useDashboardStore()
  const trpc = useTRPC()

  return useQuery({
    ...trpc.dashboard.getTopContacts.queryOptions({
      startDate: dateRange.start,
      endDate: dateRange.end,
      granularity: granularity ?? undefined,
      limit,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    placeholderData: (previousData: any) => previousData,
  })
}

// Made with Bob
