import React, { useState } from "react";
import { Link } from "react-router";
import { FormikHelpers, useFormik } from "formik";
import * as Yup from "yup";
import {
  ChevronLeftIcon,
  EyeSlashIcon as EyeCloseIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";

import { useAuth } from "@hooks/useAuth";
import Form from "@components/form/Form";
import Label from "@components/form/Label";
import { Input } from "@components/form/input";

// Validation schemas
const SignupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .required("Password is required"),
  password_confirm: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Password confirmation is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  company: Yup.string(),
  job_title: Yup.string(),
});

type AccountFormValues = {
  email: string;
  password: string;
  password_confirm: string;
};

type ProfileFormValues = {
  first_name: string;
  last_name: string;
  company?: string;
  job_title?: string;
};

type SignupFormValues = AccountFormValues & ProfileFormValues;

const Signup = () => {
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleSubmit = async (
    values: SignupFormValues,
    { setSubmitting, setErrors }: FormikHelpers<SignupFormValues>
  ) => {
    const signupData: SignupFormValues = { ...values };

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

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    company: '',
    job_title: '',
    },
    validationSchema: SignupSchema,
    onSubmit: handleSubmit,
  });

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to IntroHub
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            <Form onSubmit={formik.handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- First Name --> */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="first_name" isRequired>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="Enter your first name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.first_name}
                      error={
                        formik.touched.first_name && formik.errors.first_name
                          ? !!formik.errors.first_name
                          : undefined
                      }
                      hint={
                        formik.touched.first_name && formik.errors.first_name
                          ? formik.errors.first_name
                          : undefined
                      }
                    />
                  </div>
                  {/* <!-- Last Name --> */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="last_name" isRequired>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="last_name"
                      name="last_name"
                      placeholder="Enter your last name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.last_name}
                      error={
                        formik.touched.last_name && formik.errors.last_name
                          ? !!formik.errors.last_name
                          : undefined
                      }
                      hint={
                        formik.touched.last_name && formik.errors.last_name
                          ? formik.errors.last_name
                          : undefined
                      }
                    />
                  </div>
                </div>
                {/* <!-- Email --> */}
                <div>
                  <Label htmlFor="email" isRequired>
                    Email<span className="text-error-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    error={
                      formik.touched.email && formik.errors.email
                        ? !!formik.errors.email
                        : undefined
                    }
                  />
                </div>
                {/* <!-- Password --> */}
                <div>
                  <Label htmlFor="password" isRequired>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password}
                      error={
                        formik.touched.password && formik.errors.password
                          ? !!formik.errors.password
                          : undefined
                      }
                      hint={
                        formik.touched.password && formik.errors.password
                          ? formik.errors.password
                          : undefined
                      }
                    />
                    <span
                      onClick={handleClickShowPassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                {/* <!-- Confirm Password --> */}
                <div>
                  <Label htmlFor="password_confirm" isRequired>
                    Confirm Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password_confirm"
                      name="password_confirm"
                      placeholder="Enter your password"
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.password_confirm}
                      error={
                        formik.touched.password_confirm && formik.errors.password_confirm
                          ? !!formik.errors.password_confirm
                          : undefined
                      }
                      hint={
                        formik.touched.password_confirm && formik.errors.password_confirm
                          ? formik.errors.password_confirm
                          : undefined
                      }
                    />
                    <span
                      onClick={handleClickShowConfirmPassword}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* <!-- Company --> */}
                  <div className="sm:col-span-1">
                    <Label htmlFor="company">
                      Company
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Enter your company"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company}
                      error={
                        formik.touched.company && formik.errors.company
                          ? !!formik.errors.company
                          : undefined
                      }
                      hint={
                        formik.touched.company && formik.errors.company
                          ? formik.errors.company
                          : undefined
                      }
                    />
                  </div>
                  {/* <!-- Job Title --> */}
                  <div className="sm:col-span-1">
                    <Label>
                      Job title
                    </Label>
                    <Input
                      type="text"
                      id="job_title"
                      name="job_title"
                      placeholder="Enter your job title"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.job_title}
                      error={
                        formik.touched.job_title && formik.errors.job_title
                          ? !!formik.errors.job_title
                          : undefined
                      }
                      hint={
                        formik.touched.job_title && formik.errors.job_title
                          ? formik.errors.job_title
                          : undefined
                      }
                    />
                  </div>
                </div>
                {/* <!-- Button --> */}
                <div>
                  <button className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                    Sign Up
                  </button>
                </div>
              </div>
            </Form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account? {""}
                <Link
                  to="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
