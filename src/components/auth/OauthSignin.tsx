import Button from '@/components/ui/Button'

type OauthSignInProps = {
  setMessage?: (message: string) => void
  disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
  const handleGoogleSignIn = () => {}

  const handleGithubSignIn = () => {}

  return (
    <div className="flex items-center gap-2">
      <Button className="flex-1" type="button" onClick={handleGoogleSignIn}>
        <div className="flex items-center justify-center gap-2">
          <img
            className="h-[25px] w-[25px]"
            src="/img/others/google.png"
            alt="Google sign in"
          />
          <span>Google</span>
        </div>
      </Button>
      <Button className="flex-1" type="button" onClick={handleGithubSignIn}>
        <div className="flex items-center justify-center gap-2">
          <img
            className="h-[25px] w-[25px]"
            src="/img/others/github.png"
            alt="Google sign in"
          />
          <span>Github</span>
        </div>
      </Button>
    </div>
  )
}

export default OauthSignIn
