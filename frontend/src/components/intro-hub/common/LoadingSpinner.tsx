'use client'

import React from 'react'
import { Spinner } from '@/components/ui'

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  message?: string
  fullScreen?: boolean
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={40} className="text-primary" />
          {message && (
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {message}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Spinner className={`${sizeClasses[size]} text-primary`} />
      {message && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {message}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner

// Made with Bob
