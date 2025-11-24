'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button, Input, FormItem, FormContainer } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

// Zod validation schema
const signupSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name is too long'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupFormSchema = z.infer<typeof signupSchema>

const SignupForm: React.FC = () => {
  const { signup } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: SignupFormSchema) => {
    try {
      await signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirm: data.confirmPassword
      })
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error('Signup error:', error)
    }
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-1">Sign Up</h3>
        <p className="font-semibold heading-text">
          And let&apos;s get started with your free account
        </p>
      </div>

      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormItem
              label="First Name"
              invalid={!!errors.first_name}
              errorMessage={errors.first_name?.message}
            >
              <Input
                {...register('first_name')}
                placeholder="Enter first name"
                disabled={isSubmitting}
                autoComplete="given-name"
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
                disabled={isSubmitting}
                autoComplete="family-name"
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
              placeholder="Enter your email"
              disabled={isSubmitting}
              autoComplete="email"
            />
          </FormItem>

          <FormItem
            label="Password"
            invalid={!!errors.password}
            errorMessage={errors.password?.message}
          >
            <Input
              {...register('password')}
              type="password"
              placeholder="Create a password (min. 8 characters)"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </FormItem>

          <FormItem
            label="Confirm Password"
            invalid={!!errors.confirmPassword}
            errorMessage={errors.confirmPassword?.message}
          >
            <Input
              {...register('confirmPassword')}
              type="password"
              placeholder="Confirm your password"
              disabled={isSubmitting}
              autoComplete="new-password"
            />
          </FormItem>

          <Button
            type="submit"
            variant="solid"
            block
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create Account
          </Button>
        </form>
      </FormContainer>

      <div className="mt-6 text-center">
        <span>Already have an account? </span>
        <Link
          href="/login"
          className="heading-text font-bold hover:underline"
        >
          Sign in
        </Link>
      </div>
    </>
  )
}

export default SignupForm

// Made with Bob
