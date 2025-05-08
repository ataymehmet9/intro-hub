import React, { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, 
  Collapse, 
  IconButton, 
  Alert as MuiAlert,
  AlertTitle 
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

/**
 * Custom alert component with auto-dismiss functionality
 * 
 * @param {Object} props - Component props
 * @param {string} props.severity - Alert severity (error, warning, info, success)
 * @param {string} props.title - Alert title
 * @param {React.ReactNode} props.children - Alert content
 * @param {boolean} props.open - Whether the alert is visible
 * @param {Function} props.onClose - Function to call when closing the alert
 * @param {number} props.autoHideDuration - Duration in milliseconds before auto-dismissing (0 to disable)
 */
const Alert = forwardRef(function Alert({
  severity = 'info',
  title,
  children,
  open = true,
  onClose,
  autoHideDuration = 0,
  ...props
}, ref) {
  const [isVisible, setIsVisible] = useState(open);

  useEffect(() => {
    setIsVisible(open);
  }, [open]);

  useEffect(() => {
    if (autoHideDuration > 0 && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          onClose();
        }
      }, autoHideDuration);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoHideDuration, isVisible, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Collapse in={isVisible}>
      <Box sx={{ mb: 2 }}>
        <MuiAlert
          ref={ref}
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          {...props}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {children}
        </MuiAlert>
      </Box>
    </Collapse>
  );
});

Alert.propTypes = {
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  title: PropTypes.string,
  children: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  autoHideDuration: PropTypes.number,
};

export default Alert;
