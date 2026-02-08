import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Alert, Button } from '@/components/ui'
import { ActionLink } from '@/components/shared'
import appConfig from '@/configs/app.config'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export const Route = createFileRoute('/forgot-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const [emailSent, setEmailSent] = useState(false)
  const [message, setMessage] = useTimeOutMessage()

  const navigate = useNavigate()

  const handleContinue = () => {
    navigate(appConfig.authPaths.login as any)
  }

  return (
    <div>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-2">Check your email</h3>
            <p className="font-semibold heading-text">
              We have sent a password recovery to your email
            </p>
          </>
        ) : (
          <>
            <h3 className="mb-2">Forgot Password</h3>
            <p className="font-semibold heading-text">
              Please enter your email to receive a verification code
            </p>
          </>
        )}
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <span className="break-all">{message}</span>
        </Alert>
      )}
      <ForgotPasswordForm
        emailSent={emailSent}
        setMessage={setMessage}
        setEmailSent={setEmailSent}
      >
        <Button block variant="solid" type="button" onClick={handleContinue}>
          Continue
        </Button>
      </ForgotPasswordForm>
      <div className="mt-4 text-center">
        <span>Back to </span>
        <ActionLink
          to={appConfig.authPaths.login}
          className="heading-text font-bold"
          themeColor={false}
        >
          Sign in
        </ActionLink>
      </div>
    </div>
  )
}
