import { useLocation } from '@tanstack/react-router'
import HorizontalMenuContent from './HorizontalMenuContent'
import { useSessionUser } from '@/store/authStore'
import appConfig from '@/configs/app.config'
import navigationConfig from '@/configs/navigation.config'
import getLastPath from '@/utils/getLastPath'

const HorizontalNav = ({
  translationSetup = appConfig.activeNavTranslation,
}: {
  translationSetup?: boolean
}) => {
  const location = useLocation()

  const currentRouteKey = getLastPath(location.pathname)

  const { user } = useSessionUser()

  return (
    <HorizontalMenuContent
      navigationTree={navigationConfig}
      routeKey={currentRouteKey}
      userAuthority={user?.userAuthority ?? []}
      translationSetup={translationSetup}
    />
  )
}

export default HorizontalNav
