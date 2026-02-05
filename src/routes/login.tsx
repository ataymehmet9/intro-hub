import { createFileRoute, useNavigate } from '@tanstack/react-router'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/template/Logo'
import { Alert } from '@/components/ui'
import ActionLink from '@/components/shared/ActionLink'
import SignInForm from '@/components/auth/SignInForm'
import appConfig from '@/configs/app.config'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useTimeOutMessage()

  const mode = useThemeStore((state) => state.mode)

  const onSignInSuccess = () => {
    navigate({ to: '/' })
  }

  return (
    <>
      <div className="mb-8">
          <Logo
              type="streamline"
              mode={mode}
              imgClass="mx-auto"
              logoWidth={60}
          />
      </div>
      <div className="mb-8">
          <h3 className="mb-1">Sign In</h3>
          <p className="font-semibold heading-text">
              Welcome back! Please enter your details
          </p>
      </div>
      {message && (
          <Alert showIcon className="mb-4" type="danger">
              <span className="break-all">{message}</span>
          </Alert>
      )}
      <SignInForm
          setMessage={setMessage}
          onSignInSuccess={onSignInSuccess}
      />
      <div className="mt-6 text-center">
          <span>Don't have an account? </span>
          <ActionLink
              to="/signup"
              className="heading-text font-bold"
              themeColor={false}
          >
              Sign up
          </ActionLink>
      </div>
    </>
  )
}
