import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { tokenUtils } from '~/services/api'
import { ContactProvider } from '~/contexts/ContactContext'
import { RequestProvider } from '~/contexts/RequestContext'

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </div>
      </RequestProvider>
    </ContactProvider>
  )
}

// Made with Bob
