import React from "react";
import { Box, Button, Typography, Paper } from "@mui/material";

type NoDataProps = {
  title: string;
  description?: string;
  buttonText?: string;
  buttonAction?: () => void;
  icon?: React.ReactNode;
  elevated?: boolean;
  [key: string]: any;
};

/**
 * Component to display when no data is available
 */
const NoData = ({
  title,
  description,
  buttonText,
  buttonAction,
  icon,
  elevated = true,
  ...props
}: NoDataProps) => {
  const content = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 4,
      }}
      {...props}
    >
      {icon && (
        <Box sx={{ mb: 2, color: "text.secondary", fontSize: 48 }}>{icon}</Box>
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

export default NoData;
