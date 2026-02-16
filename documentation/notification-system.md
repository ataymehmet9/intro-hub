# Real-Time Notification System Documentation

## Overview

The IntroHub notification system provides real-time in-app notifications for introduction requests. Users receive instant notifications when:

- Someone requests an introduction to their contact
- Their introduction request is approved
- Their introduction request is declined

The system uses **polling** (every 30 seconds) to check for new notifications and displays them in a dropdown accessible from the header.

---

## Architecture

### Components

1. **Database Layer** (`src/db/schema.ts`)
   - `notifications` table with enum types
   - Foreign key relationships to users and introduction requests
   - Indexes for performance

2. **API Layer** (`src/integrations/trpc/routes/notification.ts`)
   - tRPC router with CRUD operations
   - Query endpoints for listing and counting
   - Mutation endpoints for marking as read/deleting

3. **State Management** (`src/store/notificationStore.ts`)
   - Zustand store for client-side state
   - Actions for updating notification status

4. **Hooks** (`src/hooks/useNotifications.tsx`)
   - React Query integration with tRPC
   - Automatic polling every 30 seconds
   - Optimistic updates

5. **UI Components** (`src/components/template/Notification/`)
   - Notification bell with unread badge
   - Dropdown list with notifications
   - Mark as read functionality

---

## Database Schema

### Notifications Table

```sql
CREATE TABLE "notifications" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "type" notification_type NOT NULL,
  "title" varchar(255) NOT NULL,
  "message" text NOT NULL,
  "read" boolean DEFAULT false NOT NULL,
  "related_request_id" integer,
  "metadata" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);
```

### Notification Types

```typescript
type NotificationType =
  | 'introduction_request' // Someone wants intro to your contact
  | 'introduction_approved' // Your request was approved
  | 'introduction_declined' // Your request was declined
```

### Indexes

- `notifications_userId_idx` - Fast lookup by user
- `notifications_read_idx` - Fast filtering of unread notifications

---

## API Endpoints

### Query Endpoints

#### `notifications.list`

Get paginated list of notifications for current user.

```typescript
const { data } = trpc.notifications.list.useQuery({
  limit: 50,
  offset: 0,
  unreadOnly: false,
})
```

**Parameters:**

- `limit` (number, 1-100): Max notifications to return
- `offset` (number): Pagination offset
- `unreadOnly` (boolean): Filter to only unread notifications

**Returns:**

```typescript
Array<{
  id: number
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  relatedRequestId: number | null
  metadata: string | null
  createdAt: Date
  parsedMetadata: NotificationMetadata | null
}>
```

#### `notifications.getUnreadCount`

Get count of unread notifications.

```typescript
const { data } = trpc.notifications.getUnreadCount.useQuery()
```

**Returns:**

```typescript
{
  count: number
  hasUnread: boolean
}
```

### Mutation Endpoints

#### `notifications.markAsRead`

Mark a single notification as read.

```typescript
markAsReadMutation.mutate({ id: notificationId })
```

#### `notifications.markAllAsRead`

Mark all user's notifications as read.

```typescript
markAllAsReadMutation.mutate()
```

#### `notifications.delete`

Delete a single notification.

```typescript
deleteNotificationMutation.mutate({ id: notificationId })
```

#### `notifications.deleteAllRead`

Delete all read notifications for current user.

```typescript
deleteAllReadMutation.mutate()
```

---

## Usage

### Basic Usage

The notification system is automatically active in the header. No setup required.

```tsx
import { useNotifications } from '@/hooks/useNotifications'

function MyComponent() {
  const {
    notifications,
    unreadCount,
    hasUnread,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch,
  } = useNotifications(30000) // Poll every 30 seconds

  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map((notification) => (
        <div key={notification.id} onClick={() => markAsRead(notification.id)}>
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  )
}
```

### Custom Polling Interval

```tsx
// Poll every 10 seconds (10000ms)
const notifications = useNotifications(10000)

// Poll every minute (60000ms)
const notifications = useNotifications(60000)
```

### Access Store Directly

```tsx
import { useNotificationState } from '@/hooks/useNotifications'

function MyComponent() {
  const { notifications, unreadCount, isOpen, setIsOpen } =
    useNotificationState()

  // Direct store access without fetching
}
```

---

## Notification Creation

Notifications are automatically created when:

### 1. Introduction Request Created

When a user requests an introduction, the contact owner receives:

```typescript
{
  type: 'introduction_request',
  title: 'New Introduction Request',
  message: '{requesterName} wants to be introduced to {contactName}',
  metadata: {
    requesterName: string,
    requesterEmail: string,
    contactName: string,
    contactEmail: string,
    requestId: number
  }
}
```

### 2. Request Approved

When a contact owner approves a request, the requester receives:

```typescript
{
  type: 'introduction_approved',
  title: 'Introduction Request Approved',
  message: '{approverName} approved your request to be introduced to {contactName}',
  metadata: {
    approverName: string,
    contactName: string,
    contactEmail: string,
    requestId: number
  }
}
```

### 3. Request Declined

When a contact owner declines a request, the requester receives:

```typescript
{
  type: 'introduction_declined',
  title: 'Introduction Request Declined',
  message: '{approverName} declined your request to be introduced to {contactName}',
  metadata: {
    approverName: string,
    contactName: string,
    requestId: number
  }
}
```

---

## UI Components

### Notification Bell

Located in the header, shows:

- Bell icon
- Red dot badge when unread notifications exist
- Unread count in dropdown header

### Notification Dropdown

Features:

- Scrollable list (max height 280px)
- Visual distinction for unread (blue background)
- Emoji icons per notification type:
  - 🤝 Introduction Request
  - ✅ Request Approved
  - ❌ Request Declined
- Relative timestamps ("2 minutes ago")
- Click to mark as read
- "Mark all as read" button
- "View All Activity" button (future feature)

### Empty State

When no notifications:

- Friendly illustration
- "No notifications!" message
- "You're all caught up" subtitle

---

## Performance Considerations

### Polling Strategy

- **Default interval**: 30 seconds
- **Refetch on window focus**: Enabled
- **Automatic retry**: Handled by React Query

### Optimization Tips

1. **Adjust polling interval** based on user activity:

   ```tsx
   const isActive = useUserActivity()
   const interval = isActive ? 30000 : 60000
   useNotifications(interval)
   ```

2. **Disable polling when not needed**:

   ```tsx
   const { refetch } = useNotifications(0) // No auto-polling
   // Manually refetch when needed
   refetch()
   ```

3. **Use unreadOnly filter** for performance:
   ```tsx
   trpc.notifications.list.useQuery({
     limit: 20,
     unreadOnly: true, // Faster query
   })
   ```

### Database Indexes

Existing indexes ensure fast queries:

- User ID index for filtering by user
- Read status index for unread filtering

---

## Error Handling

### Graceful Degradation

Notification creation failures **DO NOT** block core operations:

```typescript
try {
  await db.insert(notifications).values(...)
} catch (error) {
  // Log error but continue
  console.error('Failed to create notification:', error)
}
// Introduction request still succeeds
```

### User-Facing Errors

Toast notifications appear for:

- Failed to mark as read
- Failed to delete notification
- Network errors

---

## Testing

### Manual Testing Checklist

- [ ] Create introduction request → Approver receives notification
- [ ] Approve request → Requester receives notification
- [ ] Decline request → Requester receives notification
- [ ] Click notification → Marks as read
- [ ] Click "Mark all as read" → All marked as read
- [ ] Unread badge shows correct count
- [ ] Polling updates notifications automatically
- [ ] Timestamps display correctly
- [ ] Empty state shows when no notifications

### Database Testing

```sql
-- Check notifications were created
SELECT * FROM notifications WHERE user_id = 'user_id_here';

-- Check unread count
SELECT COUNT(*) FROM notifications
WHERE user_id = 'user_id_here' AND read = false;

-- Check notification types
SELECT type, COUNT(*) FROM notifications
GROUP BY type;
```

---

## Migration

### Running the Migration

```bash
# Generate migration (already done)
pnpm drizzle-kit generate

# Push to database
pnpm drizzle-kit push

# Or run migration manually
psql -d your_database -f drizzle/0001_reflective_retro_girl.sql
```

### Migration Contents

The migration creates:

1. `notification_type` enum
2. `notifications` table
3. Foreign key constraints
4. Indexes for performance
5. Adds `company` and `position` to `user` table (if not exists)

---

## Future Enhancements

### Planned Features

1. **WebSocket Support**
   - Real-time push notifications
   - Eliminate polling delay
   - Reduce server load

2. **Notification Preferences**
   - User settings for notification types
   - Email vs in-app preferences
   - Frequency controls

3. **Rich Notifications**
   - User avatars
   - Action buttons (Approve/Decline inline)
   - Preview cards

4. **Notification Center Page**
   - Full-page view of all notifications
   - Advanced filtering and search
   - Bulk actions

5. **Push Notifications**
   - Browser push notifications
   - Mobile app notifications (future)

6. **Analytics**
   - Track notification open rates
   - Measure engagement
   - Optimize notification content

---

## Troubleshooting

### Notifications Not Appearing

1. **Check database**:

   ```sql
   SELECT * FROM notifications WHERE user_id = 'your_user_id';
   ```

2. **Check browser console** for errors

3. **Verify polling is active**:
   - Open Network tab
   - Look for `notifications.list` requests every 30s

4. **Clear cache and reload**

### Unread Count Incorrect

1. **Refetch manually**:

   ```tsx
   const { refetch } = useNotifications()
   refetch()
   ```

2. **Check database consistency**:
   ```sql
   SELECT read, COUNT(*) FROM notifications
   WHERE user_id = 'your_user_id'
   GROUP BY read;
   ```

### Performance Issues

1. **Reduce polling frequency**:

   ```tsx
   useNotifications(60000) // 1 minute
   ```

2. **Limit notification count**:

   ```tsx
   trpc.notifications.list.useQuery({ limit: 20 })
   ```

3. **Use unreadOnly filter**:
   ```tsx
   trpc.notifications.list.useQuery({ unreadOnly: true })
   ```

---

## API Reference

### useNotifications Hook

```typescript
function useNotifications(pollingInterval?: number): {
  notifications: NotificationWithMetadata[]
  unreadCount: number
  hasUnread: boolean
  isLoading: boolean
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  deleteNotification: (id: number) => void
  deleteAllRead: () => void
  refetch: () => void
}
```

### useNotificationState Hook

```typescript
function useNotificationState(): {
  notifications: NotificationWithMetadata[]
  unreadCount: number
  isOpen: boolean
  isLoading: boolean
  setNotifications: (notifications: NotificationWithMetadata[]) => void
  addNotification: (notification: NotificationWithMetadata) => void
  markAsRead: (id: number) => void
  markAllAsRead: () => void
  removeNotification: (id: number) => void
  setUnreadCount: (count: number) => void
  setIsOpen: (isOpen: boolean) => void
  setIsLoading: (isLoading: boolean) => void
  reset: () => void
}
```

---

## Related Documentation

- [Search Feature](./search-feature.md)
- [Email Notifications](./email-notifications.md)
- [Introduction Requests](./introduction-requests.md) (future)

---

**Last Updated**: 2026-02-16  
**Version**: 1.0.0  
**Author**: Bob (AI Assistant)
