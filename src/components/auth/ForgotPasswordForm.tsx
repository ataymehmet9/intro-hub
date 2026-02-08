import { useState } from 'react'
import { z } from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { authClient } from '@/lib/auth-client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { CommonProps } from '@/@types/common'
import appConfig from '@/configs/app.config'
import { requestPasswordReset } from '@/services/auth.functions'

const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
})

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordFormProps extends CommonProps {
  emailSent: boolean
  setEmailSent?: (compplete: boolean) => void
  setMessage?: (message: string) => void
}

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { className, setMessage, setEmailSent, emailSent, children } = props

  const [isSubmitting, setSubmitting] = useState<boolean>(false)

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onForgotPassword = async (values: ForgotPasswordData) => {
    const { email } = values

    try {
      const { error } = await requestPasswordReset({ data: { email } })

      if (!error) {
        setSubmitting(false)
        setEmailSent?.(true)
      }
    } catch (errors) {
      setMessage?.(typeof errors === 'string' ? errors : 'Some error occured!')
      setSubmitting(false)
    }

    setSubmitting(false)
  }

  return (
    <div className={className}>
      {!emailSent ? (
        <Form onSubmit={handleSubmit(onForgotPassword)}>
          <FormItem
            label="Email"
            invalid={Boolean(errors.email)}
            errorMessage={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
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

export default ForgotPasswordForm
