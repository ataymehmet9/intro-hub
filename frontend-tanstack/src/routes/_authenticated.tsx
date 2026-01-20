import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { tokenUtils } from '~/services/api'
import { ContactProvider } from '~/contexts/ContactContext'
import { RequestProvider } from '~/contexts/RequestContext'
import IntroHubLayout from '~/components/intro-hub/layouts/IntroHubLayout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const token = tokenUtils.getToken()
    
    if (!token) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <ContactProvider>
      <RequestProvider>
        <IntroHubLayout>
          <Outlet />
        </IntroHubLayout>
      </RequestProvider>
    </ContactProvider>
  )
}

// Made with Bob
