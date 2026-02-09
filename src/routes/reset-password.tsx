import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import appConfig from '@/configs/app.config'
import { Alert, Button } from '@/components/ui'
import { ActionLink } from '@/components/shared'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'
import useQuery from '@/utils/hooks/useQuery'

export const Route = createFileRoute('/reset-password')({
  component: RouteComponent,
})

function RouteComponent() {
  const [resetComplete, setResetComplete] = useState(false)
  const token = useQuery()

  const [message, setMessage] = useTimeOutMessage()

  const navigate = useNavigate()

  const handleContinue = () => {
    navigate({ to: appConfig.authPaths.login })
  }

  return (
    <div>
      <div className="mb-6">
        {resetComplete ? (
          <>
            <h3 className="mb-1">Reset done</h3>
            <p className="font-semibold heading-text">
              Your password has been successfully reset
            </p>
          </>
        ) : (
          <>
            <h3 className="mb-1">Set new password</h3>
            <p className="font-semibold heading-text">
              Your new password must different to previous password
            </p>
          </>
        )}
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <span className="break-all">{message}</span>
        </Alert>
      )}
      <ResetPasswordForm
        resetComplete={resetComplete}
        setMessage={setMessage}
        setResetComplete={setResetComplete}
        token={token.get('token') ?? ''}
      >
        <Button block variant="solid" type="button" onClick={handleContinue}>
          Continue
        </Button>
      </ResetPasswordForm>
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
