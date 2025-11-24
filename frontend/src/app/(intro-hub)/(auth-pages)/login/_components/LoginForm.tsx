'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Button, Input, FormItem, FormContainer } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormSchema = z.infer<typeof loginSchema>

const LoginForm: React.FC = () => {
  const { login } = useAuth()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormSchema) => {
    try {
      await login(data.email, data.password)
    } catch (error) {
      // Error handling is done in the AuthContext
      console.error('Login error:', error)
    }
  }

  return (
    <>
      <div className="mb-10">
        <h2 className="mb-2">Welcome back!</h2>
        <p className="font-semibold heading-text">
          Please enter your credentials to sign in!
        </p>
      </div>

      <FormContainer>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              placeholder="Enter your password"
              disabled={isSubmitting}
              autoComplete="current-password"
            />
          </FormItem>

          <div className="mb-7 mt-2">
            <Link
              href="/forgot-password"
              className="font-semibold heading-text mt-2 underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="solid"
            block
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
        </form>
      </FormContainer>

      <div className="mt-6 text-center">
        <span>Don&apos;t have an account yet? </span>
        <Link
          href="/signup"
          className="heading-text font-bold hover:underline"
        >
          Sign up
        </Link>
      </div>
    </>
  )
}

export default LoginForm

// Made with Bob
