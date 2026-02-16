import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/(search)/search')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/(search)/search"!</div>
}
