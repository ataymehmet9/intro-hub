import {
  createFileRoute,
  useLocation,
  useNavigate,
} from '@tanstack/react-router'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import Logo from '@/components/template/Logo'
import { Alert } from '@/components/ui'
import ActionLink from '@/components/shared/ActionLink'
import SignInForm from '@/components/auth/SignInForm'
import OauthSignIn from '@/components/auth/OauthSignin'
import appConfig from '@/configs/app.config'

export const Route = createFileRoute('/_public/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [message, setMessage] = useTimeOutMessage()
  const location = useLocation()

  const mode = useThemeStore((state) => state.mode)

  const onSignInSuccess = () => {
    const query = new URLSearchParams(location.search as string)
    const redirectUrl = query.get('redirect')

    navigate({ to: redirectUrl ?? '/dashboard' })
  }

  return (
    <>
      <div className="mb-8">
        <Logo
          link="/"
          type="streamline"
          mode={mode}
          imgClass="mx-auto"
          logoWidth={60}
        />
      </div>
      <div className="mb-10">
        <h2 className="mb-2">Welcome back!</h2>
        <p className="font-semibold heading-text">
          Please enter your credentials to sign in!
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
        passwordHint={
          <div className="mb-7 mt-2">
            <ActionLink
              to={appConfig.authPaths.forgotPassword}
              className="font-semibold heading-text mt-2 underline"
              themeColor={false}
            >
              Forgot password
            </ActionLink>
          </div>
        }
      />
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
          <p className="font-semibold heading-text">or countinue with</p>
          <div className="border-t border-gray-200 dark:border-gray-800 flex-1 mt-[1px]" />
        </div>
        <OauthSignIn setMessage={setMessage} />
      </div>
      <div>
        <div className="mt-6 text-center">
          <span>{`Don't have an account yet?`} </span>
          <ActionLink
            to={appConfig.authPaths.signUp}
            className="heading-text font-bold"
            themeColor={false}
          >
            Sign up
          </ActionLink>
        </div>
      </div>
    </>
  )
}
