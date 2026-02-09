import { useState } from 'react'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { CommonProps } from '@/@types/common'
import { userResetPasswordSchema, UserResetPassword } from '@/schemas'
import { authClient } from '@/lib/auth-client'
import { PasswordInput } from '../shared'

interface ResetPasswordFormProps extends CommonProps {
  token: string
  resetComplete: boolean
  setResetComplete?: (compplete: boolean) => void
  setMessage?: (message: string) => void
}

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const {
    className,
    setMessage,
    setResetComplete,
    resetComplete,
    children,
    token,
  } = props

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<UserResetPassword>({
    resolver: zodResolver(userResetPasswordSchema),
  })

  const onResetPassword = async (values: UserResetPassword) => {
    const { password } = values

    try {
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token: token ?? '',
      })

      if (!error) {
        setSubmitting(false)
        setResetComplete?.(true)
      }
    } catch (errors) {
      setMessage?.(
        typeof errors === 'string' ? errors : 'Failed to reset password',
      )
      setSubmitting(false)
    }

    setSubmitting(false)
  }

  return (
    <div className={className}>
      {!resetComplete ? (
        <Form onSubmit={handleSubmit(onResetPassword)}>
          <FormItem
            label="Password"
            invalid={Boolean(errors.password)}
            errorMessage={errors.password?.message}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  autoComplete="off"
                  placeholder="••••••••••••"
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem
            label="Confirm Password"
            invalid={Boolean(errors.confirmPassword)}
            errorMessage={errors.confirmPassword?.message}
          >
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  autoComplete="off"
                  placeholder="Confirm Password"
                  {...field}
                />
              )}
            />
          </FormItem>
          <Button block loading={isSubmitting} variant="solid" type="submit">
            {isSubmitting ? 'Submiting...' : 'Submit'}
          </Button>
        </Form>
      ) : (
        <>{children}</>
      )}
    </div>
  )
}

export default ResetPasswordForm
