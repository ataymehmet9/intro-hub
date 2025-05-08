import React from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Divider, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

/**
 * Page layout wrapper component for consistent page layouts
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {React.ReactNode} props.actions - Action buttons to display in the header
 * @param {React.ReactNode} props.children - Page content
 * @param {Array} props.breadcrumbs - Breadcrumb items
 * @param {string} props.maxWidth - Maximum width of the container
 */
const PageLayout = ({
  title,
  description,
  actions,
  children,
  breadcrumbs,
  maxWidth,
  ...props
}) => {
  return (
    <Container maxWidth={maxWidth} {...props}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            
            return isLast ? (
              <Typography key={crumb.path || index} color="text.primary">
                {crumb.label}
              </Typography>
            ) : (
              <Link
                key={crumb.path || index}
                component={RouterLink}
                to={crumb.path}
                color="inherit"
              >
                {crumb.label}
              </Link>
            );
          })}
        </Breadcrumbs>
      )}

      {/* Header */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Box sx={{ mb: { xs: actions ? 2 : 0, md: 0 } }}>
          <Typography variant="h4" component="h1" gutterBottom={Boolean(description)}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        
        {actions && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexWrap: 'wrap',
              alignSelf: { xs: 'stretch', md: 'center' },
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
            }}
          >
            {actions}
          </Box>
        )}
      </Box>

      {/* Content */}
      {children}
    </Container>
  );
};

PageLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string,
    })
  ),
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
};

PageLayout.defaultProps = {
  maxWidth: 'lg',
};

export default PageLayout;
