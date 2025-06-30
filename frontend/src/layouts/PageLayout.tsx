import React, { ReactNode, HTMLAttributes } from "react";
import { Box, Container, Typography, Breadcrumbs, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { NavigateNext as NavigateNextIcon } from "@mui/icons-material";

type BreadcrumbItem = {
  label: string;
  path?: string;
};

type PageLayoutProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
} & HTMLAttributes<HTMLDivElement>;

const PageLayout = ({
  title,
  description,
  actions,
  children,
  breadcrumbs,
  maxWidth = "lg",
  ...props
}: PageLayoutProps) => {
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
                to={crumb.path || "/"}
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
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
        }}
      >
        <Box sx={{ mb: { xs: actions ? 2 : 0, md: 0 } }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom={Boolean(description)}
          >
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
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              alignSelf: { xs: "stretch", md: "center" },
              justifyContent: { xs: "flex-start", md: "flex-end" },
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

export default PageLayout;
