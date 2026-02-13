import { createFileRoute } from '@tanstack/react-router'
import SettingsProfile from './-components/SettingsProfile'

export const Route = createFileRoute('/_authenticated/(user)/me/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsProfile />
}
