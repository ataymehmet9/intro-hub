// import React, { useState, useEffect, forwardRef, ReactNode, Ref } from "react";
// import {
//   Box,
//   Collapse,
//   IconButton,
//   Alert as MuiAlert,
//   AlertTitle,
//   AlertProps as MuiAlertProps,
// } from "@mui/material";
// import { Close as CloseIcon } from "@mui/icons-material";

// type AlertSeverity = "error" | "warning" | "info" | "success";

// type AlertProps = {
//   severity?: AlertSeverity;
//   title?: string;
//   children?: ReactNode;
//   open?: boolean;
//   onClose?: () => void;
//   autoHideDuration?: number;
// } & Omit<MuiAlertProps, "severity">;

// /**
//  * Custom alert component with auto-dismiss functionality
//  */
// const Alert = forwardRef(function Alert(
//   {
//     severity = "info",
//     title,
//     children,
//     open = true,
//     onClose,
//     autoHideDuration = 0,
//     ...props
//   }: AlertProps,
//   ref: Ref<HTMLDivElement>
// ) {
//   const [isVisible, setIsVisible] = useState(open);

//   useEffect(() => {
//     setIsVisible(open);
//   }, [open]);

//   useEffect(() => {
//     if (autoHideDuration > 0 && isVisible) {
//       const timer = setTimeout(() => {
//         setIsVisible(false);
//         if (onClose) {
//           onClose();
//         }
//       }, autoHideDuration);

//       return () => {
//         clearTimeout(timer);
//       };
//     }
//   }, [autoHideDuration, isVisible, onClose]);

//   const handleClose = () => {
//     setIsVisible(false);
//     if (onClose) {
//       onClose();
//     }
//   };

//   return (
//     <Collapse in={isVisible}>
//       <Box sx={{ mb: 2 }}>
//         <MuiAlert
//           ref={ref}
//           severity={severity}
//           action={
//             <IconButton
//               aria-label="close"
//               color="inherit"
//               size="small"
//               onClick={handleClose}
//             >
//               <CloseIcon fontSize="inherit" />
//             </IconButton>
//           }
//           {...props}
//         >
//           {title && <AlertTitle>{title}</AlertTitle>}
//           {children}
//         </MuiAlert>
//       </Box>
//     </Collapse>
//   );
// });

// export default Alert;
