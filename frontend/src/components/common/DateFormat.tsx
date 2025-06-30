import React from "react";
import {
  Tooltip,
  Typography,
  TypographyProps,
  SxProps,
  Theme,
} from "@mui/material";
import { format, formatDistanceToNow, isValid } from "date-fns";

type DateFormatType =
  | "full"
  | "date"
  | "time"
  | "relative"
  | "fromNow"
  | string;

type DateFormatProps = {
  date: string | Date;
  formatType?: DateFormatType;
  variant?: TypographyProps["variant"];
  color?: TypographyProps["color"];
  sx?: SxProps<Theme>;
  [key: string]: any;
};

/**
 * DateFormat component for consistently formatting dates across the application
 */
const DateFormat = ({
  date,
  formatType = "full",
  variant = "body2",
  color = "text.secondary",
  sx,
  ...props
}: DateFormatProps) => {
  // Parse the date if it's a string
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Check if date is valid
  if (!dateObj || !isValid(dateObj)) {
    return null;
  }

  // Format based on the specified type
  let formattedDate: string;
  let tooltipDate: string;

  switch (formatType) {
    case "full":
      formattedDate = format(dateObj, "PPpp"); // e.g. "Apr 29, 2023, 1:30 PM"
      tooltipDate = format(dateObj, "PPPP"); // e.g. "Saturday, April 29th, 2023"
      break;
    case "date":
      formattedDate = format(dateObj, "PP"); // e.g. "Apr 29, 2023"
      tooltipDate = format(dateObj, "PPPP"); // e.g. "Saturday, April 29th, 2023"
      break;
    case "time":
      formattedDate = format(dateObj, "p"); // e.g. "1:30 PM"
      tooltipDate = format(dateObj, "PPp"); // e.g. "Apr 29, 2023, 1:30 PM"
      break;
    case "relative":
      formattedDate = formatDistanceToNow(dateObj, { addSuffix: true }); // e.g. "2 hours ago"
      tooltipDate = format(dateObj, "PPpp"); // e.g. "Apr 29, 2023, 1:30 PM"
      break;
    case "fromNow":
      formattedDate = formatDistanceToNow(dateObj); // e.g. "2 hours"
      tooltipDate = format(dateObj, "PPpp"); // e.g. "Apr 29, 2023, 1:30 PM"
      break;
    default:
      formattedDate = format(dateObj, formatType); // Custom format
      tooltipDate = format(dateObj, "PPpp");
  }

  return (
    <Tooltip title={tooltipDate} arrow>
      <Typography variant={variant} color={color} sx={sx} {...props}>
        {formattedDate}
      </Typography>
    </Tooltip>
  );
};

export default DateFormat;
