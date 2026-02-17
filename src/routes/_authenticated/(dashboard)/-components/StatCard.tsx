import { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { HiTrendingUp, HiTrendingDown } from 'react-icons/hi'
import classNames from 'classnames'

export interface StatCardProps {
  title: string
  value: string | number
  change?: number | null
  icon?: ReactNode
  description?: string
  loading?: boolean
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

export function StatCard({
  title,
  value,
  change,
  icon,
  description,
  loading = false,
  colorScheme = 'primary',
}: StatCardProps) {
  const isPositive = change !== null && change !== undefined && change > 0
  const isNegative = change !== null && change !== undefined && change < 0
  const hasChange = change !== null && change !== undefined

  const iconColorClass = {
    primary:
      'bg-primary-100 text-primary-600 dark:bg-primary-500/20 dark:text-primary-400',
    success:
      'bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400',
    warning:
      'bg-warning-100 text-warning-600 dark:bg-warning-500/20 dark:text-warning-400',
    danger:
      'bg-danger-100 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400',
    info: 'bg-info-100 text-info-600 dark:bg-info-500/20 dark:text-info-400',
  }[colorScheme]

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="mb-2 h-8 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 transition-shadow hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mb-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </h3>
          {hasChange && (
            <div className="flex items-center gap-1">
              {isPositive && (
                <HiTrendingUp className="text-lg text-success-600 dark:text-success-400" />
              )}
              {isNegative && (
                <HiTrendingDown className="text-lg text-danger-600 dark:text-danger-400" />
              )}
              <span
                className={classNames(
                  'text-sm font-medium',
                  isPositive && 'text-success-600 dark:text-success-400',
                  isNegative && 'text-danger-600 dark:text-danger-400',
                  !isPositive &&
                    !isNegative &&
                    'text-gray-600 dark:text-gray-400',
                )}
              >
                {isPositive && '+'}
                {change.toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                vs last period
              </span>
            </div>
          )}
          {description && !hasChange && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={classNames(
              'flex h-12 w-12 items-center justify-center rounded-lg text-2xl',
              iconColorClass,
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
