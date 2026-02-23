import dayjs from 'dayjs'
import parse from 'html-react-parser'
import { Button, Card, Timeline } from '@/components/ui'
import { NotificationWithMetadata } from '@/schemas'

type SettingsNotificationsProps = {
  notifications: NotificationWithMetadata[]
  isLoading: boolean
  loadable: boolean
  onLoadMore: () => void
}

const UnixDateTime = ({ value }: { value: string }) => {
  return <>{dayjs(value).format('hh:mm A')}</>
}

const SettingsNotifications = ({
  notifications,
  isLoading,
  loadable,
  onLoadMore,
}: SettingsNotificationsProps) => {
  return (
    <>
      <div className="mb-8">
        <Timeline>
          {!notifications.length ? (
            <Timeline.Item>No Notifications</Timeline.Item>
          ) : (
            notifications.map((notification, index) => (
              <Timeline.Item key={notification.id + index}>
                <div className="mt-1">
                  <Card>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
                      <h4>{notification.title}</h4>
                      <span className="ml-1 rtl:mr-1 md:ml-3 md:rtl:mr-3 font-semibold">
                        <UnixDateTime
                          value={notification.createdAt.toUTCString()}
                        />
                      </span>
                    </div>
                    <p className="py-4">{parse(notification.message)}</p>
                  </Card>
                </div>
              </Timeline.Item>
            ))
          )}
        </Timeline>
      </div>
      <div className="text-center">
        {loadable ? (
          <Button loading={isLoading} onClick={onLoadMore}>
            Load More
          </Button>
        ) : (
          'No more notifications to load'
        )}
      </div>
    </>
  )
}

export default SettingsNotifications
