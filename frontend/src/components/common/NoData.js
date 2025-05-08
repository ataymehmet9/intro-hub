import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography, Paper } from '@mui/material';

/**
 * Component to display when no data is available
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Main message to display
 * @param {string} props.description - Additional description text
 * @param {string} props.buttonText - Text for the action button
 * @param {Function} props.buttonAction - Function to call when button is clicked
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {boolean} props.elevated - Whether to show the component in an elevated paper
 */
const NoData = ({
  title,
  description,
  buttonText,
  buttonAction,
  icon,
  elevated,
  ...props
}) => {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 4,
      }}
      {...props}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary', fontSize: 48 }}>
          {icon}
        </Box>
      )}
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      
      {buttonText && buttonAction && (
        <Button variant="contained" onClick={buttonAction}>
          {buttonText}
        </Button>
      )}
    </Box>
  );

  if (elevated) {
    return <Paper elevation={1}>{content}</Paper>;
  }

  return content;
};

NoData.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonAction: PropTypes.func,
  icon: PropTypes.node,
  elevated: PropTypes.bool,
};

NoData.defaultProps = {
  elevated: true,
};

export default NoData;
