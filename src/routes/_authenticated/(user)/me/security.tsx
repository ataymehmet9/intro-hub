import { createFileRoute } from '@tanstack/react-router'
import SettingsSecurity from './-components/SettingsSecurity'

export const Route = createFileRoute('/_authenticated/(user)/me/security')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsSecurity />
}
