import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import Masonry from '@/components/shared/Masonry'
import { Spinner, Notification, toast } from '@/components/ui'
import { DashboardHeader } from './-components/DashboardHeader'
import { StatCard } from './-components/StatCard'
import { TrendChart } from './-components/TrendChart'
import { StatusDonutChart } from './-components/StatusDonutChart'
import { TopContactsTable } from './-components/TopContactsTable'
import { useDashboardStats } from './-hooks/useDashboardStats'
import { useDashboardTrends } from './-hooks/useDashboardTrends'
import { useTopContacts } from './-hooks/useTopContacts'
import {
  exportDashboardToCSV,
  exportTopContactsToCSV,
  downloadCSV,
  generateExportFilename,
} from './-utils/exportData'
import {
  HiUsers,
  HiPaperAirplane,
  HiInbox,
  HiCheckCircle,
  HiXCircle,
  HiClock,
} from 'react-icons/hi'
import { Container } from '@/components/shared'

export const Route = createFileRoute('/_authenticated/(dashboard)/dashboard')({
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
    try {
      const csvContent = exportDashboardToCSV(
        statsData?.data,
        trendsData?.data,
        topContactsData?.data,
      )

      if (!csvContent) {
        toast.push(
          <Notification type="warning" title="No data to export">
            Please wait for data to load before exporting
          </Notification>,
        )
        return
      }

      const filename = generateExportFilename('introhub_dashboard')
      downloadCSV(csvContent, filename)

      toast.push(
        <Notification type="success" title="Export successful">
          Dashboard data has been exported to {filename}
        </Notification>,
      )
    } catch (error) {
      toast.push(
        <Notification type="danger" title="Export failed">
          {error instanceof Error ? error.message : 'Failed to export data'}
        </Notification>,
      )
    }
  }

  const handleExportTopContacts = () => {
    try {
      const csvContent = exportTopContactsToCSV(topContactsData?.data)

      if (!csvContent || csvContent === 'No data to export') {
        toast.push(
          <Notification type="warning" title="No data to export">
            No contacts available for the selected period
          </Notification>,
        )
        return
      }

      const filename = generateExportFilename('introhub_top_contacts')
      downloadCSV(csvContent, filename)

      toast.push(
        <Notification type="success" title="Export successful">
          Top contacts have been exported to {filename}
        </Notification>,
      )
    } catch (error) {
      toast.push(
        <Notification type="danger" title="Export failed">
          {error instanceof Error ? error.message : 'Failed to export contacts'}
        </Notification>,
      )
    }
  }

  return (
    <Container>
      <DashboardHeader onExport={handleExportData} />

      {/* Stat Cards - Responsive Masonry Layout */}
      <div className="mb-4 sm:mb-6">
        <Masonry columns={{ 640: 1, 768: 2, 1024: 3 }} gap={16}>
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
      <div className="mb-4 sm:mb-6">
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

      {/* Bottom Grid - Status Chart and Top Contacts - Responsive */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
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
    </Container>
  )
}

// Made with Bob
