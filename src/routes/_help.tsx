import { Container } from '@/components/shared'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useHelpContent } from './_help/-hooks/useHelpContent'
import TableOfContents from '@/routes/_help/-components/TableOfContents'

export const Route = createFileRoute('/_help')({
  component: RouteComponent,
})

function RouteComponent() {
  const { content } = useHelpContent()

  return (
    <Container>
      <div className="lg:flex gap-4">
        <div className="my-6 max-w-[800px] w-full mx-auto">
          <Outlet />
        </div>
        <TableOfContents content={content?.tableOfContents ?? []} />
      </div>
    </Container>
  )
}
