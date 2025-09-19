import React from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useContacts, type Contact } from "@hooks/useContacts";

import { ComponentCard } from "@components/common";
import Form from "@components/form/Form";
import Label from "@components/form/Label";
import { Input, TextArea } from "@components/form/input";

type ContactFormValues = Omit<Contact, "id">;

type ContactFormProps = {
  open: boolean;
  onClose: () => void;
  contact?: Contact | null;
};

// Validation schema
const ContactSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string(),
  company: Yup.string(),
  position: Yup.string(),
  linkedin_url: Yup.string().url("Invalid URL"),
  relationship: Yup.string(),
  notes: Yup.string(),
});

const ContactForm = ({ open, onClose, contact }: ContactFormProps) => {
  const { addContact, editContact } = useContacts();

  const isEditMode = Boolean(contact);
  const initialValues: ContactFormValues = contact
    ? { ...contact }
    : {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        linkedin_url: "",
        relationship: "",
        notes: "",
      };

  const handleSubmit = async (
    values: ContactFormValues,
    { setSubmitting, setErrors }: FormikHelpers<ContactFormValues>
  ) => {
    try {
      if (isEditMode && contact) {
        await editContact(contact.id, values);
      } else {
        await addContact(values);
      }
      onClose();
    } catch (error: any) {
      const errorData = error.response?.data || {};
      const formattedErrors: Record<string, string> = {};
      Object.keys(errorData).forEach((key) => {
        if (Array.isArray(errorData[key])) {
          formattedErrors[key] = errorData[key].join(" ");
        } else {
          formattedErrors[key] = errorData[key];
        }
      });
      if (Object.keys(formattedErrors).length === 0) {
        formattedErrors.submit = "An error occurred. Please try again.";
      }
      setErrors(formattedErrors);
    } finally {
      setSubmitting(false);
    }
  };

  const formik = useFormik<ContactFormValues>({
    initialValues,
    validationSchema: ContactSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <ComponentCard
      title={isEditMode ? "Edit contact" : "Create contact - Manual entry"}
    >
      <Form onSubmit={formik.handleSubmit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="col-span-full">
            <h4 className="pb-4 text-base font-medium text-gray-800 border-b border-gray-200 dark:border-gray-800 dark:text-white/90">
              Basic Information
            </h4>
          </div>
          <div className="">
            <Label htmlFor="first_name" isRequired>
              First Name
            </Label>
            <Input
              type="text"
              placeholder="Enter first name"
              id="first_name"
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
                  ? (formik.errors.first_name as string)
                  : undefined
              }
            />
          </div>
          <div className="">
            <Label htmlFor="last_name" isRequired>
              Last Name
            </Label>
            <Input
              type="text"
              placeholder="Enter last name"
              id="last_name"
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
                  ? (formik.errors.last_name as string)
                  : undefined
              }
            />
          </div>
          <div className="">
            <Label htmlFor="email" isRequired>
              Email
            </Label>
            <Input
              type="email"
              placeholder="Enter email address"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={
                formik.touched.email && formik.errors.email
                  ? !!formik.errors.email
                  : undefined
              }
              hint={
                formik.touched.email && formik.errors.email
                  ? (formik.errors.email as string)
                  : undefined
              }
            />
          </div>
          <div className="">
            <Label htmlFor="phone">Phone number</Label>
            <Input
              type="text"
              placeholder="Enter phone number"
              id="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
              error={
                formik.touched.phone && formik.errors.phone
                  ? !!formik.errors.phone
                  : undefined
              }
              hint={
                formik.touched.phone && formik.errors.phone
                  ? (formik.errors.phone as string)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <h4 className="pb-4 text-base font-medium text-gray-800 border-b border-gray-200 dark:border-gray-800 dark:text-white/90">
              Professional Information
            </h4>
          </div>
          <div className="">
            <Label htmlFor="company">Company</Label>
            <Input
              type="text"
              placeholder="Enter company"
              id="company"
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
                  ? (formik.errors.company as string)
                  : undefined
              }
            />
          </div>
          <div className="">
            <Label htmlFor="position">Position</Label>
            <Input
              type="text"
              placeholder="Enter position"
              id="position"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.position}
              error={
                formik.touched.position && formik.errors.position
                  ? !!formik.errors.position
                  : undefined
              }
              hint={
                formik.touched.position && formik.errors.position
                  ? (formik.errors.position as string)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
            <Input
              type="url"
              placeholder="Enter LinkedIn Profile"
              id="linkedin_url"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.linkedin_url}
              error={
                formik.touched.linkedin_url && formik.errors.linkedin_url
                  ? !!formik.errors.linkedin_url
                  : undefined
              }
              hint={
                formik.touched.linkedin_url && formik.errors.linkedin_url
                  ? (formik.errors.linkedin_url as string)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <h4 className="pb-4 text-base font-medium text-gray-800 border-b border-gray-200 dark:border-gray-800 dark:text-white/90">
              Relationship Information
            </h4>
          </div>
          <div className="col-span-2">
            <Label htmlFor="relationship">Relationship</Label>
            <Input
              type="url"
              placeholder="e.g. Former colleague, College friend, Industry peer"
              id="relationship"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.relationship}
              error={
                formik.touched.relationship && formik.errors.relationship
                  ? !!formik.errors.relationship
                  : undefined
              }
              hint={
                formik.touched.relationship && formik.errors.relationship
                  ? (formik.errors.relationship as string)
                  : undefined
              }
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <TextArea
              placeholder="Type your notes here..."
              rows={6}
              className=" bg-gray-50 dark:bg-gray-800"
              onChange={formik.handleChange}
              value={formik.values.notes}
              error={
                formik.touched.notes && formik.errors.notes
                  ? !!formik.errors.notes
                  : undefined
              }
              hint={
                formik.touched.notes && formik.errors.notes
                  ? (formik.errors.notes as string)
                  : undefined
              }
            />
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
};

export default ContactForm;
