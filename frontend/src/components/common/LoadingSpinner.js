import React from 'react';
import PropTypes from 'prop-types';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loading spinner component with optional message
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Message to display below the spinner
 * @param {number} props.size - Size of the spinner in pixels
 * @param {Object} props.sx - MUI sx prop for styling
 */
const LoadingSpinner = ({ message, size, sx, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
        ...sx,
      }}
      {...props}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.number,
  sx: PropTypes.object,
};

LoadingSpinner.defaultProps = {
  size: 40,
};

export default LoadingSpinner;
