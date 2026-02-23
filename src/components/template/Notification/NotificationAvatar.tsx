import Avatar from '@/components/ui/Avatar'
import type { Notification } from '@/schemas'

const GeneratedAvatar = ({ target }: { target: string }) => {
  return <Avatar shape="circle">{target}</Avatar>
}

const NotificationAvatar = (props: { notification: Notification }) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'introduction_request':
        return '🤝'
      case 'introduction_approved':
        return '✅'
      case 'introduction_declined':
        return '❌'
      default:
        return '📬'
    }
  }

  return (
    <GeneratedAvatar target={getNotificationIcon(props.notification.type)} />
  )
}

export default NotificationAvatar
