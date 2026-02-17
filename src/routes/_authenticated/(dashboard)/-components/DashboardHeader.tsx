import { Button } from '@/components/ui'
import { HiDownload } from 'react-icons/hi'
import { DateRangeSelector } from './DateRangeSelector'

export interface DashboardHeaderProps {
  onExport?: () => void
}

export function DashboardHeader({ onExport }: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track your introduction requests and contact metrics
          </p>
        </div>
        {onExport && (
          <Button
            variant="solid"
            icon={<HiDownload />}
            onClick={onExport}
            className="w-full sm:w-auto"
          >
            Export Data
          </Button>
        )}
      </div>
      <DateRangeSelector />
    </div>
  )
}

// Made with Bob
