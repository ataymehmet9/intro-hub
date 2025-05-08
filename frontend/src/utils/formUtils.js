/**
 * Utility functions for handling form validation and errors
 */

/**
 * Format API errors for Formik
 * 
 * @param {Object} error - Axios error object
 * @returns {Object} Formatted errors for Formik
 */
export const formatApiErrors = (error) => {
  // Default error if we can't extract specific errors
  if (!error.response || !error.response.data) {
    return { submit: 'An error occurred. Please try again.' };
  }

  const errorData = error.response.data;
  
  // Handle non-field errors (often returned as 'detail' or 'non_field_errors')
  if (typeof errorData === 'string') {
    return { submit: errorData };
  }
  
  if (errorData.detail) {
    return { submit: errorData.detail };
  }
  
  if (errorData.non_field_errors) {
    return { 
      submit: Array.isArray(errorData.non_field_errors) 
        ? errorData.non_field_errors.join(' ') 
        : errorData.non_field_errors 
    };
  }
  
  // Format field-specific errors
  const formattedErrors = {};
  
  for (const [field, messages] of Object.entries(errorData)) {
    if (Array.isArray(messages)) {
      formattedErrors[field] = messages.join(' ');
    } else if (typeof messages === 'object') {
      // Handle nested errors
      for (const [nestedField, nestedMessages] of Object.entries(messages)) {
        formattedErrors[`${field}.${nestedField}`] = Array.isArray(nestedMessages) 
          ? nestedMessages.join(' ') 
          : nestedMessages;
      }
    } else {
      formattedErrors[field] = messages;
    }
  }
  
  return formattedErrors;
};

/**
 * Handle API errors for forms
 * 
 * @param {Object} error - Axios error object
 * @param {Function} setErrors - Formik setErrors function
 * @param {Function} setSubmitting - Formik setSubmitting function
 * @returns {Object} Formatted errors
 */
export const handleFormError = (error, setErrors, setSubmitting) => {
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
 * @param {Object} schema - Yup schema object
 * @param {Object} options - Options for schema validation
 * @returns {Object} Enhanced Yup schema
 */
export const createValidationSchema = (schema, options = {}) => {
  return schema.test(
    'api-errors',
    null,
    () => true // This is a placeholder test that always passes
  );
};

/**
 * Format a validation error message for display
 * 
 * @param {string} message - The error message
 * @param {Object} values - Field values
 * @returns {string} Formatted message
 */
export const formatErrorMessage = (message, values) => {
  if (!message) return '';
  
  // Replace placeholders like ${fieldName} with actual values
  return message.replace(/\${(\w+)}/g, (match, fieldName) => {
    return values[fieldName] || '';
  });
};
