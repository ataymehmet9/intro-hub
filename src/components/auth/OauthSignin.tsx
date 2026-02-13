import Button from '@/components/ui/Button'
import appConfig from '@/configs/app.config'
import { signIn } from '@/lib/auth-client'

type OauthSignInProps = {
  setMessage?: (message: string) => void
  disableSubmit?: boolean
}

const OauthSignIn = (_props: OauthSignInProps) => {
  const handleSocialSignIn = async (provider: 'linkedin' | 'microsoft') => {
    await signIn.social({
      provider,
      callbackURL: appConfig.authenticatedEntryPath,
    })
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        className="flex-1"
        type="button"
        onClick={() => handleSocialSignIn('microsoft')}
      >
        <div className="flex items-center justify-center gap-2">
          <img
            className="h-[25px] w-[25px]"
            src="/img/others/microsoft.png"
            alt="Microsoft sign in"
          />
          <span>Microsoft</span>
        </div>
      </Button>
      <Button
        className="flex-1"
        type="button"
        onClick={() => handleSocialSignIn('linkedin')}
      >
        <div className="flex items-center justify-center gap-2">
          <img
            className="h-[25px] w-[25px]"
            src="/img/others/linkedin.png"
            alt="LinkedIn sign in"
          />
          <span>LinkedIn</span>
        </div>
      </Button>
    </div>
  )
}

export default OauthSignIn
