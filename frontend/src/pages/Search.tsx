import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Work as WorkIcon,
} from "@mui/icons-material";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";

import { useRequests } from "@hooks/useRequests";
import Alert from "@components/common/Alert";

// Validation schema for search
const SearchSchema = Yup.object().shape({
  query: Yup.string().required("Please enter a search term"),
});

// Validation schema for request
const RequestSchema = Yup.object().shape({
  purpose: Yup.string()
    .required("Please explain the purpose of your introduction request")
    .min(10, "Please provide more details about your request")
    .max(500, "Purpose is too long (maximum 500 characters)"),
  message: Yup.string().max(
    1000,
    "Message is too long (maximum 1000 characters)"
  ),
});

type SearchFormValues = {
  query: string;
};

type RequestFormValues = {
  purpose: string;
  message: string;
};

type SearchContact = {
  id: number;
  full_name: string;
  company?: string;
  job_title?: string;
  owner_name?: string;
  user_id?: number;
  [key: string]: any;
};

const Search = () => {
  const { searchContacts, addRequest, isLoading } = useRequests();

  const [searchResults, setSearchResults] = useState<SearchContact[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<SearchContact | null>(
    null
  );
  const [requestDialogOpen, setRequestDialogOpen] = useState<boolean>(false);

  const handleSearch = async (
    values: SearchFormValues,
    { setSubmitting }: FormikHelpers<SearchFormValues>
  ) => {
    try {
      const results = await searchContacts(values.query);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestOpen = (contact: SearchContact) => {
    setSelectedContact(contact);
    setRequestDialogOpen(true);
  };

  const handleRequestClose = () => {
    setRequestDialogOpen(false);
    setSelectedContact(null);
  };

  const handleRequestSubmit = async (
    values: RequestFormValues,
    { setSubmitting, resetForm }: FormikHelpers<RequestFormValues>
  ) => {
    try {
      if (!selectedContact) return;
      await addRequest({
        target_contact_id: selectedContact.id,
        purpose: values.purpose,
        message: values.message,
        approver_id: selectedContact.user_id,
      });
      resetForm();
      handleRequestClose();
      // Show success notification handled by the context
    } catch (error) {
      console.error("Request error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* Header */}
      <Typography variant="h4" sx={{ mb: 4 }}>
        Search for Contacts
      </Typography>

      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Formik<SearchFormValues>
          initialValues={{ query: "" }}
          validationSchema={SearchSchema}
          onSubmit={handleSearch}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                id="query"
                name="query"
                placeholder="Search by name, company, or job title..."
                variant="outlined"
                error={touched.query && Boolean(errors.query)}
                helperText={touched.query && errors.query}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting || !values.query.trim()}
                        sx={{ minWidth: 100 }}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} />
                        ) : (
                          "Search"
                        )}
                      </Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Search for potential contacts in your extended network. You can
            search by name, company, job title, or other relevant information.
          </Typography>
        </Box>
      </Paper>

      {/* Search Results */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        hasSearched && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Search Results{" "}
              {searchResults.length > 0 && `(${searchResults.length})`}
            </Typography>

            {searchResults.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="subtitle1" gutterBottom>
                  No contacts found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search term or search for someone else
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {searchResults.map((contact) => (
                  <Grid item xs={12} sm={6} md={4} key={contact.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" gutterBottom>
                          {contact.full_name}
                        </Typography>

                        {contact.company && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <BusinessIcon
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {contact.company}
                            </Typography>
                          </Box>
                        )}

                        {contact.job_title && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <WorkIcon
                              fontSize="small"
                              sx={{ mr: 1, color: "text.secondary" }}
                            />
                            <Typography variant="body2">
                              {contact.job_title}
                            </Typography>
                          </Box>
                        )}

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <PersonIcon
                            fontSize="small"
                            sx={{ mr: 1, color: "text.secondary" }}
                          />
                          <Typography variant="body2">
                            Connected to {contact.owner_name}
                          </Typography>
                        </Box>
                      </CardContent>

                      <Divider />

                      <CardActions>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => handleRequestOpen(contact)}
                        >
                          Request Introduction
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )
      )}

      {/* Introduction Request Dialog */}
      <Dialog
        open={requestDialogOpen}
        onClose={handleRequestClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Request Introduction to {selectedContact?.full_name}
        </DialogTitle>

        {selectedContact && (
          <Formik<RequestFormValues>
            initialValues={{ purpose: "", message: "" }}
            validationSchema={RequestSchema}
            onSubmit={handleRequestSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                <DialogContent>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    You are requesting an introduction to{" "}
                    {selectedContact.full_name} from{" "}
                    {selectedContact.owner_name}.
                  </Alert>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Purpose of Introduction*
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        multiline
                        rows={4}
                        name="purpose"
                        placeholder="Explain why you want to connect with this person and how it could be mutually beneficial..."
                        error={touched.purpose && Boolean(errors.purpose)}
                        helperText={touched.purpose && errors.purpose}
                      />
                      <Typography variant="caption" color="text.secondary">
                        This will be shared with both the contact owner and the
                        person you want to meet.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle1" gutterBottom>
                        Additional Message (Optional)
                      </Typography>
                      <Field
                        as={TextField}
                        fullWidth
                        multiline
                        rows={3}
                        name="message"
                        placeholder="Add any additional information for the contact owner..."
                        error={touched.message && Boolean(errors.message)}
                        helperText={touched.message && errors.message}
                      />
                      <Typography variant="caption" color="text.secondary">
                        This message will only be seen by the contact owner, not
                        the person you want to meet.
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        The contact owner will review your request and decide
                        whether to make the introduction.
                      </Typography>
                    </Grid>
                  </Grid>
                </DialogContent>

                <DialogActions>
                  <Button onClick={handleRequestClose}>Cancel</Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : (
                      "Send Request"
                    )}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        )}
      </Dialog>
    </Container>
  );
};

export default Search;
