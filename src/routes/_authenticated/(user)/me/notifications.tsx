import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { AdaptiveCard } from '@/components/shared'
import { useNotifications } from '@/hooks/useNotifications'
import SettingsNotificationAction from './-components/notifications/SettingsNotificationAction'
import SettingsNotifications from './-components/notifications/SettingsNotifications'
import { notificationSearchSchema } from '@/schemas'

export const Route = createFileRoute('/_authenticated/(user)/me/notifications')(
  {
    validateSearch: notificationSearchSchema,
    loader: async ({ context, location }) => {
      const search = notificationSearchSchema.parse(location.search)
      await context.queryClient.prefetchQuery(
        context.trpc.notifications.list.queryOptions({
          page: search.p,
          pageSize: search.c,
          unreadOnly: search.unreadOnly,
        }),
      )
    },
    component: RouteComponent,
  },
)

function RouteComponent() {
  const searchParams = useSearch({
    from: '/_authenticated/(user)/me/notifications',
  })
  const navigate = useNavigate()

  const {
    notifications,
    isLoading,
    pagination,
    markAsRead,
    isPlaceholderData,
  } = useNotifications({
    page: searchParams.p,
    pageSize: searchParams.c,
    unreadOnly: searchParams.unreadOnly,
  })

  const handleFilterChange = (unreadOnly: boolean) => {
    navigate({
      to: '/me/notifications',
      search: { ...searchParams, unreadOnly },
      replace: true,
    })
  }

  const handleLoadMore = () => {
    if (pagination?.hasNextPage) {
      navigate({
        to: '/me/notifications',
        search: { ...searchParams, p: pagination.page + 1 },
        replace: true,
      })
    }
  }

  const handleMarkAsRead = async (id: number) => {
    await markAsRead(id)
  }

  return (
    <AdaptiveCard>
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h4>Notifications</h4>
          <SettingsNotificationAction
            showUnreadOnly={searchParams.unreadOnly}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
          <SettingsNotifications
            isLoading={isLoading}
            loadable={pagination?.hasNextPage ?? false}
            notifications={notifications}
            onLoadMore={handleLoadMore}
            onMarkAsRead={handleMarkAsRead}
          />
        </div>
      </div>
    </AdaptiveCard>
  )
}
