'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, FormItem, FormContainer } from '@/components/ui'
import { ContactFormData } from '@/types/intro-hub'

// Zod validation schema
const contactSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  job_title: z.string().optional().or(z.literal('')),
  linkedin_profile: z.string().url('Invalid URL').optional().or(z.literal('')),
  relationship: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
})

type ContactFormSchema = z.infer<typeof contactSchema>

interface ContactFormProps {
  initialData?: Partial<ContactFormData>
  onSubmit: (data: ContactFormData) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
  submitText?: string
}

const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText = 'Save Contact',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      first_name: initialData?.first_name || '',
      last_name: initialData?.last_name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      company: initialData?.company || '',
      job_title: initialData?.job_title || '',
      linkedin_profile: initialData?.linkedin_profile || '',
      relationship: initialData?.relationship || '',
      notes: initialData?.notes || '',
    },
  })

  const handleFormSubmit = async (data: ContactFormSchema) => {
    try {
      await onSubmit(data as ContactFormData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const isFormLoading = isLoading || isSubmitting

  return (
    <FormContainer>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem
            label="First Name"
            invalid={!!errors.first_name}
            errorMessage={errors.first_name?.message}
          >
            <Input
              {...register('first_name')}
              placeholder="Enter first name"
              disabled={isFormLoading}
            />
          </FormItem>

          <FormItem
            label="Last Name"
            invalid={!!errors.last_name}
            errorMessage={errors.last_name?.message}
          >
            <Input
              {...register('last_name')}
              placeholder="Enter last name"
              disabled={isFormLoading}
            />
          </FormItem>
        </div>

        <FormItem
          label="Email"
          invalid={!!errors.email}
          errorMessage={errors.email?.message}
        >
          <Input
            {...register('email')}
            type="email"
            placeholder="Enter email address"
            disabled={isFormLoading}
          />
        </FormItem>

        <FormItem
          label="Phone"
          invalid={!!errors.phone}
          errorMessage={errors.phone?.message}
        >
          <Input
            {...register('phone')}
            type="tel"
            placeholder="Enter phone number (optional)"
            disabled={isFormLoading}
          />
        </FormItem>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormItem
            label="Company"
            invalid={!!errors.company}
            errorMessage={errors.company?.message}
          >
            <Input
              {...register('company')}
              placeholder="Enter company name (optional)"
              disabled={isFormLoading}
            />
          </FormItem>

          <FormItem
            label="Job Title"
            invalid={!!errors.job_title}
            errorMessage={errors.job_title?.message}
          >
            <Input
              {...register('job_title')}
              placeholder="Enter job title (optional)"
              disabled={isFormLoading}
            />
          </FormItem>
        </div>

        <FormItem
          label="LinkedIn Profile"
          invalid={!!errors.linkedin_profile}
          errorMessage={errors.linkedin_profile?.message}
        >
          <Input
            {...register('linkedin_profile')}
            type="url"
            placeholder="https://linkedin.com/in/username (optional)"
            disabled={isFormLoading}
          />
        </FormItem>

        <FormItem
          label="Relationship"
          invalid={!!errors.relationship}
          errorMessage={errors.relationship?.message}
        >
          <Input
            {...register('relationship')}
            placeholder="e.g., Colleague, Friend, Client (optional)"
            disabled={isFormLoading}
          />
        </FormItem>

        <FormItem
          label="Notes"
          invalid={!!errors.notes}
          errorMessage={errors.notes?.message}
        >
          <Input
            {...register('notes')}
            textArea
            rows={4}
            placeholder="Add any additional notes (optional)"
            disabled={isFormLoading}
          />
        </FormItem>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="default"
            onClick={onCancel}
            disabled={isFormLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            loading={isFormLoading}
            disabled={isFormLoading}
          >
            {submitText}
          </Button>
        </div>
      </form>
    </FormContainer>
  )
}

export default ContactForm


