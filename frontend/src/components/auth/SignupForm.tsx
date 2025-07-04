import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers } from "formik";
import get from "lodash/get";
import * as Yup from "yup";

import { useAuth } from "@hooks/useAuth";

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
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Password confirmation is required"),
});

const ProfileSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  company: Yup.string(),
  job_title: Yup.string(),
});

type AccountFormValues = {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
};

type ProfileFormValues = {
  first_name: string;
  last_name: string;
  company: string;
  job_title: string;
};

type SignupFormValues = AccountFormValues & ProfileFormValues;

const Signup = () => {
  const { signup } = useAuth();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formData, setFormData] = useState<SignupFormValues>({
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

  const handleNext = (
    values: Partial<AccountFormValues | ProfileFormValues>,
    helpers: FormikHelpers<any>
  ) => {
    setFormData({ ...formData, ...values });
    setActiveStep(activeStep + 1);
    helpers.setSubmitting(false);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async (
    values: ProfileFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ProfileFormValues>
  ) => {
    const signupData: SignupFormValues = { ...formData, ...values };

    try {
      await signup(signupData);
      // Note: Redirect is handled by the useAuth hook
    } catch (error: any) {
      // Handle API errors
      const errorData = error.response?.data || {};

      // Create friendly error messages
      const errorMessages: Record<string, string> = {};
      for (const [key, value] of Object.entries(errorData)) {
        errorMessages[key] = Array.isArray(value)
          ? value.join(" ")
          : String(value);
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
  const getInitialValues = (step: number): Partial<SignupFormValues> => {
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
  const getValidationSchema = (step: number) => {
    switch (step) {
      case 0:
        return AccountSchema;
      case 1:
        return ProfileSchema;
      default:
        return Yup.object().shape({});
    }
  };

  return <></>;
};

export default Signup;
