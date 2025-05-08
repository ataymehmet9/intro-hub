import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip, Typography } from '@mui/material';
import { format, formatDistanceToNow, isValid } from 'date-fns';

/**
 * DateFormat component for consistently formatting dates across the application
 * 
 * @param {Object} props - Component props
 * @param {string|Date} props.date - The date to format
 * @param {string} props.format - Format style: 'full', 'date', 'time', 'relative', 'fromNow'
 * @param {string} props.variant - Typography variant
 * @param {string} props.color - Typography color
 * @param {Object} props.sx - MUI sx prop for styling
 */
const DateFormat = ({ date, formatType = 'full', variant, color, sx, ...props }) => {
  // Parse the date if it's a string
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (!dateObj || !isValid(dateObj)) {
    return null;
  }
  
  // Format based on the specified type
  let formattedDate;
  let tooltipDate;
  
  switch (formatType) {
    case 'full':
      formattedDate = format(dateObj, 'PPpp'); // e.g. "Apr 29, 2023, 1:30 PM"
      tooltipDate = format(dateObj, 'PPPP'); // e.g. "Saturday, April 29th, 2023"
      break;
    case 'date':
      formattedDate = format(dateObj, 'PP'); // e.g. "Apr 29, 2023"
      tooltipDate = format(dateObj, 'PPPP'); // e.g. "Saturday, April 29th, 2023"
      break;
    case 'time':
      formattedDate = format(dateObj, 'p'); // e.g. "1:30 PM"
      tooltipDate = format(dateObj, 'PPp'); // e.g. "Apr 29, 2023, 1:30 PM"
      break;
    case 'relative':
      formattedDate = formatDistanceToNow(dateObj, { addSuffix: true }); // e.g. "2 hours ago"
      tooltipDate = format(dateObj, 'PPpp'); // e.g. "Apr 29, 2023, 1:30 PM"
      break;
    case 'fromNow':
      formattedDate = formatDistanceToNow(dateObj); // e.g. "2 hours"
      tooltipDate = format(dateObj, 'PPpp'); // e.g. "Apr 29, 2023, 1:30 PM"
      break;
    default:
      formattedDate = format(dateObj, formatType); // Custom format
      tooltipDate = format(dateObj, 'PPpp'); // e.g. "Apr 29, 2023, 1:30 PM"
  }
  
  return (
    <Tooltip title={tooltipDate} arrow>
      <Typography variant={variant} color={color} sx={sx} {...props}>
        {formattedDate}
      </Typography>
    </Tooltip>
  );
};

DateFormat.propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]).isRequired,
  formatType: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  sx: PropTypes.object,
};

DateFormat.defaultProps = {
  formatType: 'full',
  variant: 'body2',
  color: 'text.secondary',
};

export default DateFormat;
