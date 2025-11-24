'use client'

import React from 'react'
import { HiInbox } from 'react-icons/hi2'

interface NoDataProps {
  title?: string
  message?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

const NoData: React.FC<NoDataProps> = ({
  title = 'No Data',
  message = 'There is no data to display at the moment.',
  icon,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="text-gray-400 dark:text-gray-600 mb-4">
        {icon || <HiInbox className="w-20 h-20" />}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
        {message}
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}

export default NoData

// Made with Bob
