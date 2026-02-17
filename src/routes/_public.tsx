import { createFileRoute, Outlet } from '@tanstack/react-router'
import { publicMiddleware } from '@/lib/auth-middleware'

export const Route = createFileRoute('/_public')({
  component: RouteComponent,
  server: {
    middleware: [publicMiddleware],
  },
})

function RouteComponent() {
  return <Outlet />
}
