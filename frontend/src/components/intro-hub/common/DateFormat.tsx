'use client'

import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedFormat from 'dayjs/plugin/localizedFormat'

// Extend dayjs with plugins
dayjs.extend(relativeTime)
dayjs.extend(localizedFormat)

interface DateFormatProps {
  date: string | Date
  format?: 'short' | 'long' | 'relative' | 'datetime' | 'time' | 'custom'
  customFormat?: string
  className?: string
}

const DateFormat: React.FC<DateFormatProps> = ({
  date,
  format = 'short',
  customFormat,
  className = '',
}) => {
  const formatDate = () => {
    const dateObj = dayjs(date)

    if (!dateObj.isValid()) {
      return 'Invalid date'
    }

    switch (format) {
      case 'short':
        return dateObj.format('MMM D, YYYY')
      case 'long':
        return dateObj.format('MMMM D, YYYY')
      case 'relative':
        return dateObj.fromNow()
      case 'datetime':
        return dateObj.format('MMM D, YYYY h:mm A')
      case 'time':
        return dateObj.format('h:mm A')
      case 'custom':
        return customFormat ? dateObj.format(customFormat) : dateObj.format('L')
      default:
        return dateObj.format('MMM D, YYYY')
    }
  }

  return (
    <span className={className} title={dayjs(date).format('LLLL')}>
      {formatDate()}
    </span>
  )
}

export default DateFormat

// Made with Bob
