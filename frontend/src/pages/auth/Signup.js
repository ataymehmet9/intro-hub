import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";

// Validation schemas
const AccountSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  password_confirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
});

const ProfileSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  company: Yup.string(),
  job_title: Yup.string(),
});

const Signup = () => {
  const { signup } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    company: "",
    job_title: "",
  });

  const steps = ["Account Information", "Personal Information"];

  const handleNext = (values) => {
    setFormData({ ...formData, ...values });
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    const signupData = { ...formData, ...values };

    debugger;

    try {
      await signup(signupData);
      // Note: Redirect is handled by the useAuth hook
    } catch (error) {
      // Handle API errors
      const errorData = error.response?.data || {};

      // Create friendly error messages
      const errorMessages = {};
      for (const [key, value] of Object.entries(errorData)) {
        errorMessages[key] = Array.isArray(value) ? value.join(" ") : value;
      }

      if (Object.keys(errorMessages).length === 0) {
        errorMessages.submit = "Registration failed. Please try again.";
      }

      setErrors(errorMessages);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Initial values for each step
  const getInitialValues = (step) => {
    switch (step) {
      case 0:
        return {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          password_confirm: formData.password_confirm,
        };
      case 1:
        return {
          first_name: formData.first_name,
          last_name: formData.last_name,
          company: formData.company,
          job_title: formData.job_title,
        };
      default:
        return {};
    }
  };

  // Validation schema for each step
  const getValidationSchema = (step) => {
    switch (step) {
      case 0:
        return AccountSchema;
      case 1:
        return ProfileSchema;
      default:
        return Yup.object().shape({});
    }
  };

  // Step content
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Formik
            initialValues={getInitialValues(step)}
            validationSchema={getValidationSchema(step)}
            onSubmit={handleNext}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="email"
                  name="email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  error={Boolean(touched.email && errors.email)}
                  helperText={touched.email && errors.email}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="username"
                  name="username"
                  label="Username"
                  autoComplete="username"
                  error={Boolean(touched.username && errors.username)}
                  helperText={touched.username && errors.username}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="password_confirm"
                  name="password_confirm"
                  label="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  error={Boolean(
                    touched.password_confirm && errors.password_confirm
                  )}
                  helperText={
                    touched.password_confirm && errors.password_confirm
                  }
                />

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    {/* {isSubmitting ? <CircularProgress size={24} /> : "Next"} */}
                    Next
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        );
      case 1:
        return (
          <Formik
            initialValues={getInitialValues(step)}
            validationSchema={getValidationSchema(step)}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="first_name"
                  name="first_name"
                  label="First Name"
                  autoComplete="given-name"
                  error={Boolean(touched.first_name && errors.first_name)}
                  helperText={touched.first_name && errors.first_name}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="last_name"
                  name="last_name"
                  label="Last Name"
                  autoComplete="family-name"
                  error={Boolean(touched.last_name && errors.last_name)}
                  helperText={touched.last_name && errors.last_name}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="company"
                  name="company"
                  label="Company"
                  autoComplete="organization"
                  error={Boolean(touched.company && errors.company)}
                  helperText={touched.company && errors.company}
                />

                <Field
                  as={TextField}
                  fullWidth
                  margin="normal"
                  id="job_title"
                  name="job_title"
                  label="Job Title"
                  autoComplete="organization-title"
                  error={Boolean(touched.job_title && errors.job_title)}
                  helperText={touched.job_title && errors.job_title}
                />

                {errors.submit && (
                  <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    {errors.submit}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 3,
                  }}
                >
                  <Button onClick={handleBack} variant="outlined">
                    Back
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    {/* {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Create Account"
                    )} */}
                    Create Account
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ maxWidth: 500, width: "100%" }}>
      <Typography component="h1" variant="h5" align="center" sx={{ mb: 3 }}>
        Create an Account
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3 }}>{getStepContent(activeStep)}</Paper>

      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" variant="body2">
            Sign in here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Signup;
