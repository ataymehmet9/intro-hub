import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import { useContacts } from '../../hooks/useContacts';

// Validation schema
const ContactSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string(),
  company: Yup.string(),
  job_title: Yup.string(),
  linkedin_profile: Yup.string().url('Invalid URL'),
  relationship: Yup.string(),
  notes: Yup.string(),
});

const ContactForm = ({ open, onClose, contact }) => {
  const { addContact, editContact } = useContacts();
  
  const isEditMode = Boolean(contact);
  const initialValues = contact ? { ...contact } : {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company: '',
    job_title: '',
    linkedin_profile: '',
    relationship: '',
    notes: '',
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      if (isEditMode) {
        await editContact(contact.id, values);
      } else {
        await addContact(values);
      }
      onClose();
    } catch (error) {
      // Handle API errors
      const errorData = error.response?.data || {};
      const formattedErrors = {};
      
      // Convert API error format to form error format
      Object.keys(errorData).forEach(key => {
        if (Array.isArray(errorData[key])) {
          formattedErrors[key] = errorData[key].join(' ');
        } else {
          formattedErrors[key] = errorData[key];
        }
      });
      
      if (Object.keys(formattedErrors).length === 0) {
        formattedErrors.submit = 'An error occurred. Please try again.';
      }
      
      setErrors(formattedErrors);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Edit Contact' : 'Add New Contact'}
      </DialogTitle>
      
      <Formik
        initialValues={initialValues}
        validationSchema={ContactSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogContent>
              <Grid container spacing={2}>
                {/* Basic Information */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Basic Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="First Name"
                    name="first_name"
                    error={touched.first_name && Boolean(errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    error={touched.last_name && Boolean(errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Phone"
                    name="phone"
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={touched.phone && errors.phone}
                  />
                </Grid>
                
                {/* Professional Information */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Professional Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Company"
                    name="company"
                    error={touched.company && Boolean(errors.company)}
                    helperText={touched.company && errors.company}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Job Title"
                    name="job_title"
                    error={touched.job_title && Boolean(errors.job_title)}
                    helperText={touched.job_title && errors.job_title}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="LinkedIn Profile"
                    name="linkedin_profile"
                    placeholder="https://linkedin.com/in/username"
                    error={touched.linkedin_profile && Boolean(errors.linkedin_profile)}
                    helperText={touched.linkedin_profile && errors.linkedin_profile}
                  />
                </Grid>
                
                {/* Relationship Information */}
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Relationship Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Relationship"
                    name="relationship"
                    placeholder="e.g. Former colleague, College friend, Industry peer"
                    error={touched.relationship && Boolean(errors.relationship)}
                    helperText={touched.relationship && errors.relationship}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Field
                    as={TextField}
                    fullWidth
                    label="Notes"
                    name="notes"
                    multiline
                    rows={4}
                    error={touched.notes && Boolean(errors.notes)}
                    helperText={touched.notes && errors.notes}
                  />
                </Grid>
                
                {/* Form-level errors */}
                {errors.submit && (
                  <Grid item xs={12}>
                    <Typography color="error">
                      {errors.submit}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  'Save Changes'
                ) : (
                  'Add Contact'
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default ContactForm;
