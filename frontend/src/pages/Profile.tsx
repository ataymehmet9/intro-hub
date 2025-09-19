// import React, { useState, SyntheticEvent } from "react";
// import { Formik, Form, Field, FormikHelpers } from "formik";
// import * as Yup from "yup";
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   Divider,
//   Grid,
//   IconButton,
//   Paper,
//   Tab,
//   Tabs,
//   TextField,
//   Typography,
// } from "@mui/material";
// import {
//   AccountCircle as AccountCircleIcon,
//   Edit as EditIcon,
//   Lock as LockIcon,
//   PhotoCamera as PhotoCameraIcon,
// } from "@mui/icons-material";
// import { useAuth } from "@hooks/useAuth";
// import { updateProfile, changePassword } from "@services/auth";
// import Alert from "@components/common/Alert";

// // Validation schemas
// const ProfileSchema = Yup.object().shape({
//   first_name: Yup.string().required("First name is required"),
//   last_name: Yup.string().required("Last name is required"),
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   job_title: Yup.string(),
//   company: Yup.string(),
//   bio: Yup.string().max(500, "Bio must be at most 500 characters"),
//   linkedin_profile: Yup.string().url("Invalid URL"),
// });

// const PasswordSchema = Yup.object().shape({
//   old_password: Yup.string().required("Current password is required"),
//   new_password: Yup.string()
//     .required("New password is required")
//     .min(6, "Password must be at least 6 characters")
//     .matches(/[a-z]/, "Password must contain at least one lowercase letter")
//     .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
//     .matches(/[0-9]/, "Password must contain at least one number"),
//   new_password_confirm: Yup.string()
//     .oneOf([Yup.ref("new_password"), undefined], "Passwords must match")
//     .required("Password confirmation is required"),
// });

// type ProfileFormValues = {
//   first_name: string;
//   last_name: string;
//   email: string;
//   job_title?: string;
//   company?: string;
//   bio?: string;
//   linkedin_profile?: string;
// };

// type PasswordFormValues = {
//   old_password: string;
//   new_password: string;
//   new_password_confirm: string;
// };

// const Profile = () => {
//   const { user, updateUserProfile } = useAuth();
//   const [activeTab, setActiveTab] = useState<number>(0);
//   const [successMessage, setSuccessMessage] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   const handleTabChange = (_event: SyntheticEvent, newValue: number) => {
//     setActiveTab(newValue);
//     setSuccessMessage("");
//     setErrorMessage("");
//   };

//   const handleProfileUpdate = async (
//     values: ProfileFormValues,
//     { setSubmitting }: FormikHelpers<ProfileFormValues>
//   ) => {
//     try {
//       const updatedUser = await updateProfile(values);
//       updateUserProfile(updatedUser);
//       setSuccessMessage("Profile updated successfully");
//       setErrorMessage("");
//       // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     } catch (_) {
//       setErrorMessage("Error updating profile. Please try again.");
//       setSuccessMessage("");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handlePasswordChange = async (
//     values: PasswordFormValues,
//     { setSubmitting, resetForm }: FormikHelpers<PasswordFormValues>
//   ) => {
//     try {
//       await changePassword(values);
//       resetForm();
//       setSuccessMessage("Password changed successfully");
//       setErrorMessage("");
//     } catch (error: any) {
//       const errorMsg = error?.response?.data?.old_password
//         ? "Current password is incorrect"
//         : "Error changing password. Please try again.";
//       setErrorMessage(errorMsg);
//       setSuccessMessage("");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (!user) {
//     return (
//       <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Create initials for avatar
//   const getInitials = (): string => {
//     if (user.first_name && user.last_name) {
//       return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
//     } else if (user.first_name) {
//       return user.first_name.charAt(0);
//     } else if (user.email) {
//       return user.email.charAt(0).toUpperCase();
//     }
//     return "";
//   };

//   // Generate random color for avatar
//   const stringToColor = (string: string): string => {
//     let hash = 0;
//     for (let i = 0; i < string.length; i++) {
//       hash = string.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     let color = "#";
//     for (let i = 0; i < 3; i++) {
//       const value = (hash >> (i * 8)) & 0xff;
//       color += `00${value.toString(16)}`.slice(-2);
//     }
//     return color;
//   };

//   return (
//     <Container maxWidth="lg">
//       {/* Header */}
//       <Typography variant="h4" sx={{ mb: 4 }}>
//         My Profile
//       </Typography>

//       <Grid container spacing={4}>
//         {/* Left Column - Profile Summary */}
//         <Grid item xs={12} md={4}>
//           <Card sx={{ mb: 4 }}>
//             <CardContent sx={{ textAlign: "center" }}>
//               <Box sx={{ position: "relative", display: "inline-block" }}>
//                 {user.profile_image ? (
//                   <Avatar
//                     src={user.profile_image}
//                     alt={`${user.first_name} ${user.last_name}`}
//                     sx={{ width: 96, height: 96, mb: 2, mx: "auto" }}
//                   />
//                 ) : (
//                   <Avatar
//                     sx={{
//                       width: 96,
//                       height: 96,
//                       mb: 2,
//                       mx: "auto",
//                       bgcolor: stringToColor(user.email),
//                       fontSize: 36,
//                     }}
//                   >
//                     {getInitials()}
//                   </Avatar>
//                 )}
//                 <IconButton
//                   color="primary"
//                   aria-label="upload picture"
//                   component="label"
//                   sx={{
//                     position: "absolute",
//                     right: -8,
//                     bottom: 8,
//                     backgroundColor: "background.paper",
//                     "&:hover": {
//                       backgroundColor: "background.default",
//                     },
//                   }}
//                 >
//                   <input hidden accept="image/*" type="file" />
//                   <PhotoCameraIcon />
//                 </IconButton>
//               </Box>

//               <Typography variant="h6" gutterBottom>
//                 {user.first_name} {user.last_name}
//               </Typography>

//               {user.job_title && (
//                 <Typography variant="body2" color="text.secondary" gutterBottom>
//                   {user.job_title}
//                 </Typography>
//               )}

//               {user.company && (
//                 <Typography variant="body2" color="text.secondary">
//                   {user.company}
//                 </Typography>
//               )}

//               <Divider sx={{ my: 2 }} />

//               <Box sx={{ textAlign: "left" }}>
//                 <Typography variant="body2" gutterBottom>
//                   <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
//                     Email:
//                   </Box>
//                   {user.email}
//                 </Typography>

//                 {user.linkedin_profile && (
//                   <Typography variant="body2" gutterBottom>
//                     <Box component="span" sx={{ fontWeight: "bold", mr: 1 }}>
//                       LinkedIn:
//                     </Box>
//                     <a
//                       href={user.linkedin_profile}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       Profile
//                     </a>
//                   </Typography>
//                 )}
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Right Column - Edit Forms */}
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ mb: 4 }}>
//             <Tabs
//               value={activeTab}
//               onChange={handleTabChange}
//               variant="fullWidth"
//               indicatorColor="primary"
//               textColor="primary"
//             >
//               <Tab
//                 icon={<AccountCircleIcon />}
//                 label="Profile Information"
//                 id="profile-tab"
//                 aria-controls="profile-panel"
//               />
//               <Tab
//                 icon={<LockIcon />}
//                 label="Change Password"
//                 id="password-tab"
//                 aria-controls="password-panel"
//               />
//             </Tabs>

//             <Box p={3}>
//               {/* Success/Error Messages */}
//               {successMessage && (
//                 <Box sx={{ mb: 3 }}>
//                   <Alert severity="success">{successMessage}</Alert>
//                 </Box>
//               )}

//               {errorMessage && (
//                 <Box sx={{ mb: 3 }}>
//                   <Alert severity="error">{errorMessage}</Alert>
//                 </Box>
//               )}

//               {/* Profile Information Tab */}
//               {activeTab === 0 && (
//                 <Formik<ProfileFormValues>
//                   initialValues={{
//                     first_name: user.first_name || "",
//                     last_name: user.last_name || "",
//                     email: user.email || "",
//                     job_title: user.job_title || "",
//                     company: user.company || "",
//                     bio: user.bio || "",
//                     linkedin_profile: user.linkedin_profile || "",
//                   }}
//                   validationSchema={ProfileSchema}
//                   onSubmit={handleProfileUpdate}
//                   enableReinitialize
//                 >
//                   {({ errors, touched, isSubmitting, values }) => (
//                     <Form>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="First Name"
//                             name="first_name"
//                             error={
//                               touched.first_name && Boolean(errors.first_name)
//                             }
//                             helperText={touched.first_name && errors.first_name}
//                           />
//                         </Grid>

//                         <Grid item xs={12} sm={6}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="Last Name"
//                             name="last_name"
//                             error={
//                               touched.last_name && Boolean(errors.last_name)
//                             }
//                             helperText={touched.last_name && errors.last_name}
//                           />
//                         </Grid>

//                         <Grid item xs={12}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="Email"
//                             name="email"
//                             disabled
//                             error={touched.email && Boolean(errors.email)}
//                             helperText={
//                               (touched.email && errors.email) ||
//                               "Email cannot be changed"
//                             }
//                           />
//                         </Grid>

//                         <Grid item xs={12} sm={6}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="Job Title"
//                             name="job_title"
//                             error={
//                               touched.job_title && Boolean(errors.job_title)
//                             }
//                             helperText={touched.job_title && errors.job_title}
//                           />
//                         </Grid>

//                         <Grid item xs={12} sm={6}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="Company"
//                             name="company"
//                             error={touched.company && Boolean(errors.company)}
//                             helperText={touched.company && errors.company}
//                           />
//                         </Grid>

//                         <Grid item xs={12}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="LinkedIn Profile URL"
//                             name="linkedin_profile"
//                             placeholder="https://linkedin.com/in/username"
//                             error={
//                               touched.linkedin_profile &&
//                               Boolean(errors.linkedin_profile)
//                             }
//                             helperText={
//                               touched.linkedin_profile &&
//                               errors.linkedin_profile
//                             }
//                           />
//                         </Grid>

//                         <Grid item xs={12}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="Bio"
//                             name="bio"
//                             multiline
//                             rows={4}
//                             error={touched.bio && Boolean(errors.bio)}
//                             helperText={
//                               (touched.bio && errors.bio) ||
//                               `${
//                                 500 - (values.bio?.length || 0)
//                               } characters remaining`
//                             }
//                           />
//                         </Grid>

//                         <Grid item xs={12}>
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             startIcon={<EditIcon />}
//                             disabled={isSubmitting}
//                           >
//                             {isSubmitting ? (
//                               <CircularProgress size={24} />
//                             ) : (
//                               "Update Profile"
//                             )}
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     </Form>
//                   )}
//                 </Formik>
//               )}

//               {/* Change Password Tab */}
//               {activeTab === 1 && (
//                 <Formik<PasswordFormValues>
//                   initialValues={{
//                     old_password: "",
//                     new_password: "",
//                     new_password_confirm: "",
//                   }}
//                   validationSchema={PasswordSchema}
//                   onSubmit={handlePasswordChange}
//                 >
//                   {({ errors, touched, isSubmitting }) => (
//                     <Form>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="Current Password"
//                             name="old_password"
//                             type="password"
//                             error={
//                               touched.old_password &&
//                               Boolean(errors.old_password)
//                             }
//                             helperText={
//                               touched.old_password && errors.old_password
//                             }
//                           />
//                         </Grid>

//                         <Grid item xs={12}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="New Password"
//                             name="new_password"
//                             type="password"
//                             error={
//                               touched.new_password &&
//                               Boolean(errors.new_password)
//                             }
//                             helperText={
//                               touched.new_password && errors.new_password
//                             }
//                           />
//                         </Grid>

//                         <Grid item xs={12}>
//                           <Field
//                             as={TextField}
//                             fullWidth
//                             label="Confirm New Password"
//                             name="new_password_confirm"
//                             type="password"
//                             error={
//                               touched.new_password_confirm &&
//                               Boolean(errors.new_password_confirm)
//                             }
//                             helperText={
//                               touched.new_password_confirm &&
//                               errors.new_password_confirm
//                             }
//                           />
//                         </Grid>

//                         <Grid item xs={12}>
//                           <Button
//                             type="submit"
//                             variant="contained"
//                             color="primary"
//                             disabled={isSubmitting}
//                             startIcon={<LockIcon />}
//                           >
//                             {isSubmitting ? (
//                               <CircularProgress size={24} />
//                             ) : (
//                               "Change Password"
//                             )}
//                           </Button>
//                         </Grid>
//                       </Grid>
//                     </Form>
//                   )}
//                 </Formik>
//               )}
//             </Box>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default Profile;

export default function () {
  return <></>;
}
