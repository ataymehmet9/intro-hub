/**
 * Utility functions for handling form validation and errors
 */

type ApiErrorResponse = {
  response?: {
    data?: any;
  };
};

type FormikErrors = {
  [field: string]: string;
};

type SetErrors = (errors: FormikErrors) => void;
type SetSubmitting = (isSubmitting: boolean) => void;

/**
 * Format API errors for Formik
 *
 * @param error - Axios error object
 * @returns Formatted errors for Formik
 */
const formatApiErrors = (error: ApiErrorResponse): FormikErrors => {
  if (!error.response || !error.response.data) {
    return { submit: "An error occurred. Please try again." };
  }

  const errorData = error.response.data;

  if (typeof errorData === "string") {
    return { submit: errorData };
  }

  if (errorData.detail) {
    return { submit: errorData.detail };
  }

  if (errorData.non_field_errors) {
    return {
      submit: Array.isArray(errorData.non_field_errors)
        ? errorData.non_field_errors.join(" ")
        : errorData.non_field_errors,
    };
  }

  const formattedErrors: FormikErrors = {};

  for (const [field, messages] of Object.entries(errorData)) {
    if (Array.isArray(messages)) {
      formattedErrors[field] = messages.join(" ");
    } else if (typeof messages === "object" && messages !== null) {
      for (const [nestedField, nestedMessages] of Object.entries(messages)) {
        formattedErrors[`${field}.${nestedField}`] = Array.isArray(
          nestedMessages
        )
          ? nestedMessages.join(" ")
          : String(nestedMessages);
      }
    } else {
      formattedErrors[field] = String(messages);
    }
  }

  return formattedErrors;
};

/**
 * Handle API errors for forms
 *
 * @param error - Axios error object
 * @param setErrors - Formik setErrors function
 * @param setSubmitting - Formik setSubmitting function
 * @returns Formatted errors
 */
const handleFormError = (
  error: ApiErrorResponse,
  setErrors?: SetErrors,
  setSubmitting?: SetSubmitting
): FormikErrors => {
  const formattedErrors = formatApiErrors(error);

  if (setErrors) {
    setErrors(formattedErrors);
  }

  if (setSubmitting) {
    setSubmitting(false);
  }

  return formattedErrors;
};

/**
 * Create a Yup validation schema for a form
 *
 * @param schema - Yup schema object
 * @param _options - Options for schema validation
 * @returns Enhanced Yup schema
 */
const createValidationSchema = (
  schema: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: Record<string, unknown> = {}
): any => {
  return schema.test(
    "api-errors",
    null,
    () => true // This is a placeholder test that always passes
  );
};

/**
 * Format a validation error message for display
 *
 * @param message - The error message
 * @param values - Field values
 * @returns Formatted message
 */
const formatErrorMessage = (
  message: string,
  values: Record<string, any>
): string => {
  if (!message) return "";

  return message.replace(/\${(\w+)}/g, (_match, fieldName) => {
    return values[fieldName] || "";
  });
};

export {
  formatApiErrors,
  handleFormError,
  createValidationSchema,
  formatErrorMessage,
};
