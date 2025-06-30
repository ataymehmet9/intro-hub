import React from "react";
import {
  Box,
  CircularProgress,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";

type LoadingSpinnerProps = {
  message?: string;
  size?: number;
  sx?: SxProps<Theme>;
  [key: string]: any;
};

/**
 * Loading spinner component with optional message
 */
const LoadingSpinner = ({
  message,
  size = 40,
  sx,
  ...props
}: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
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

export default LoadingSpinner;
