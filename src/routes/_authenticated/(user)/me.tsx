import { createFileRoute, Outlet } from '@tanstack/react-router'
import useResponsive from '@/utils/hooks/useResponsive'
import { AdaptiveCard } from '@/components/shared'
import SettingsMenu from './me/-components/SettingsMenu'
import SettingMobileMenu from './me/-components/SettingsMobileMenu'

export const Route = createFileRoute('/_authenticated/(user)/me')({
  component: RouteComponent,
})

function RouteComponent() {
  const { smaller, larger } = useResponsive()

  return (
    <AdaptiveCard className="h-full">
      <div className="flex flex-auto h-full">
        {larger.lg && (
          <div className="'w-[200px] xl:w-[280px]">
            <SettingsMenu />
          </div>
        )}
        <div className="xl:ltr:pl-6 xl:rtl:pr-6 flex-1 py-2">
          {smaller.lg && (
            <div className="mb-6">
              <SettingMobileMenu />
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </AdaptiveCard>
  )
}
