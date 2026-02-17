import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import Masonry from '@/components/shared/Masonry'
import { Spinner } from '@/components/ui'
import { DashboardHeader } from './(dashboard)/-components/DashboardHeader'
import { StatCard } from './(dashboard)/-components/StatCard'
import { TrendChart } from './(dashboard)/-components/TrendChart'
import { StatusDonutChart } from './(dashboard)/-components/StatusDonutChart'
import { TopContactsTable } from './(dashboard)/-components/TopContactsTable'
import { useDashboardStats } from './(dashboard)/-hooks/useDashboardStats'
import { useDashboardTrends } from './(dashboard)/-hooks/useDashboardTrends'
import { useTopContacts } from './(dashboard)/-hooks/useTopContacts'
import {
  HiUsers,
  HiPaperAirplane,
  HiInbox,
  HiCheckCircle,
  HiXCircle,
  HiClock,
} from 'react-icons/hi'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: statsData, isLoading: statsLoading } = useDashboardStats()
  const { data: trendsData, isLoading: trendsLoading } = useDashboardTrends()
  const { data: topContactsData, isLoading: topContactsLoading } =
    useTopContacts(10)

  const stats = statsData?.data?.stats
  const statusBreakdown = statsData?.data?.statusBreakdown

  const handleExportData = () => {
    // TODO: Implement export functionality
    console.log('Export data')
  }

  const handleExportTopContacts = () => {
    // TODO: Implement export top contacts
    console.log('Export top contacts')
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader onExport={handleExportData} />

      {/* Stat Cards - Masonry Layout */}
      <div className="mb-6">
        <Masonry columns={{ 640: 1, 768: 2, 1024: 3 }} gap={24}>
          <StatCard
            title="Total Contacts"
            value={stats?.current.totalContacts ?? 0}
            change={stats?.changes.totalContacts}
            icon={<HiUsers />}
            colorScheme="primary"
            loading={statsLoading}
          />
          <StatCard
            title="Requests Made"
            value={stats?.current.requestsMade ?? 0}
            change={stats?.changes.requestsMade}
            icon={<HiPaperAirplane />}
            colorScheme="info"
            loading={statsLoading}
          />
          <StatCard
            title="Requests Received"
            value={stats?.current.requestsReceived ?? 0}
            change={stats?.changes.requestsReceived}
            icon={<HiInbox />}
            colorScheme="success"
            loading={statsLoading}
          />
          <StatCard
            title="Approval Rate"
            value={`${stats?.current.approvalRate.toFixed(1) ?? 0}%`}
            change={stats?.changes.approvalRate}
            icon={<HiCheckCircle />}
            colorScheme="success"
            loading={statsLoading}
          />
          <StatCard
            title="Rejection Rate"
            value={`${stats?.current.rejectionRate.toFixed(1) ?? 0}%`}
            change={stats?.changes.rejectionRate}
            icon={<HiXCircle />}
            colorScheme="danger"
            loading={statsLoading}
          />
          <StatCard
            title="Avg Response Time"
            value={stats?.current.avgResponseTimeReceived?.formatted ?? 'N/A'}
            change={stats?.changes.avgResponseTimeReceived}
            icon={<HiClock />}
            colorScheme="warning"
            loading={statsLoading}
            description="Your response time to requests"
          />
        </Masonry>
      </div>

      {/* Trend Chart - Full Width */}
      <div className="mb-6">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Spinner size="40px" />
            </div>
          }
        >
          <TrendChart data={trendsData?.data} loading={trendsLoading} />
        </Suspense>
      </div>

      {/* Bottom Grid - Status Chart and Top Contacts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Spinner size="40px" />
            </div>
          }
        >
          <StatusDonutChart data={statusBreakdown} loading={statsLoading} />
        </Suspense>

        <Suspense
          fallback={
            <div className="flex h-96 items-center justify-center">
              <Spinner size="40px" />
            </div>
          }
        >
          <TopContactsTable
            data={topContactsData?.data}
            loading={topContactsLoading}
            onExport={handleExportTopContacts}
          />
        </Suspense>
      </div>
    </div>
  )
}

// Made with Bob
