# SSE Migration Plan for Notifications

## Overview

Migrate from polling-based notifications to Server-Sent Events (SSE) for real-time notification delivery, following the guide at https://ollioddi.dev/blog/tanstack-sse-guide

## Current Architecture

### Polling Implementation

- **Hook**: [`useNotifications.tsx`](src/hooks/useNotifications.tsx:12) uses TanStack Query with `refetchInterval: 30000` (30s)
- **Queries**: Two separate queries polling every 30 seconds:
  - `notifications.list` - fetches notification list
  - `notifications.getUnreadCount` - fetches unread count
- **Store**: [`notificationStore.ts`](src/store/notificationStore.ts:29) manages local state
- **Component**: [`Notification.tsx`](src/components/template/Notification/Notification.tsx:20) displays notifications

### Issues with Current Approach

- Unnecessary server load from constant polling
- 30-second delay before users see new notifications
- Wasted bandwidth when no new notifications exist
- Multiple concurrent requests (list + count)

## New SSE Architecture

### Server-Side Components

#### 1. SSE Connection Manager (`src/lib/sse-manager.ts`)

```typescript
// Manages active SSE connections per user
class SSEConnectionManager {
  - connections: Map<userId, Set<Response>>
  - addConnection(userId, response)
  - removeConnection(userId, response)
  - sendToUser(userId, event)
  - sendToAll(event)
  - getConnectionCount(userId)
}
```

#### 2. Notification Event Emitter (`src/lib/notification-emitter.ts`)

```typescript
// EventEmitter for broadcasting notification events
class NotificationEmitter extends EventEmitter {
  - emit('notification:created', { userId, notification })
  - emit('notification:read', { userId, notificationId })
  - emit('notification:deleted', { userId, notificationId })
}
```

#### 3. SSE Endpoint (`src/routes/api/notifications/stream.ts`)

```typescript
// GET /api/notifications/stream
- Authenticate using Better Auth session
- Set SSE headers (Content-Type: text/event-stream, etc.)
- Register connection with SSEConnectionManager
- Send initial connection event
- Set up heartbeat interval (30s)
- Listen for notification events
- Handle connection cleanup on close
```

#### 4. Updated Notification Router (`src/integrations/trpc/routes/notification.ts`)

```typescript
// Emit SSE events when notifications are created/updated
- create: emit 'notification:created' event
- markAsRead: emit 'notification:read' event
- markAllAsRead: emit 'notification:read' for all
- delete: emit 'notification:deleted' event
```

### Client-Side Components

#### 1. SSE Hook (`src/hooks/useNotificationSSE.tsx`)

```typescript
// Custom hook to manage SSE connection
useNotificationSSE() {
  - Establish EventSource connection to /api/notifications/stream
  - Handle connection events (open, message, error)
  - Implement exponential backoff reconnection (1s, 2s, 4s, 8s, max 30s)
  - Parse SSE events and update TanStack Query cache
  - Clean up connection on unmount
  - Return connection status
}
```

#### 2. Updated Notifications Hook (`src/hooks/useNotifications.tsx`)

```typescript
// Remove polling, integrate SSE
useNotifications() {
  - Remove refetchInterval from queries
  - Call useNotificationSSE() to establish SSE connection
  - Keep existing mutation logic (markAsRead, delete, etc.)
  - Update cache when SSE events received
  - Return same interface for backward compatibility
}
```

## Implementation Steps

### Phase 1: Server Infrastructure

1. **Create SSE Connection Manager** (`src/lib/sse-manager.ts`)
   - Singleton pattern to manage all active connections
   - Track connections by userId
   - Methods to send events to specific users or broadcast

2. **Create Notification Event Emitter** (`src/lib/notification-emitter.ts`)
   - Singleton EventEmitter instance
   - Define event types (created, read, deleted)
   - Export typed event emitter

3. **Create SSE Endpoint** (`src/routes/api/notifications/stream.ts`)
   - Authenticate using Better Auth session
   - Set proper SSE headers
   - Register connection with manager
   - Implement heartbeat (30s interval)
   - Listen for notification events
   - Format and send SSE messages
   - Handle cleanup on disconnect

### Phase 2: Integrate with Existing Code

4. **Update Notification Router** (`src/integrations/trpc/routes/notification.ts`)
   - Import notification emitter
   - Emit events in `create` mutation
   - Emit events in `markAsRead` mutation
   - Emit events in `markAllAsRead` mutation
   - Emit events in `delete` mutation

5. **Update Introduction Request Router** (`src/integrations/trpc/routes/introduction-request.ts`)
   - Emit notification events when creating notifications
   - Ensure real-time delivery of introduction requests

### Phase 3: Client Implementation

6. **Create SSE Hook** (`src/hooks/useNotificationSSE.tsx`)
   - Establish EventSource connection
   - Handle connection lifecycle
   - Implement reconnection with exponential backoff
   - Parse SSE events
   - Update TanStack Query cache directly
   - Return connection status

7. **Update Notifications Hook** (`src/hooks/useNotifications.tsx`)
   - Remove `refetchInterval` from queries
   - Integrate `useNotificationSSE()`
   - Keep existing mutation logic
   - Maintain backward compatibility

8. **Update Notification Component** (`src/components/template/Notification/Notification.tsx`)
   - No changes needed (uses same hook interface)
   - Optionally add connection status indicator

### Phase 4: Testing & Cleanup

9. **Remove Polling Code**
   - Remove `refetchInterval` from all notification queries
   - Remove `refetchOnWindowFocus` if no longer needed
   - Clean up any polling-related comments

10. **Add Error Handling**
    - Connection status indicators
    - Fallback to manual refresh if SSE fails
    - User-friendly error messages

11. **Testing**
    - Test SSE connection establishment
    - Test authentication
    - Test real-time notification delivery
    - Test reconnection on disconnect
    - Test multiple browser tabs
    - Test notification mutations (read, delete)

## SSE Message Format

Following the guide, SSE messages will use this format:

```
event: notification
data: {"type":"created","notification":{...}}

event: heartbeat
data: {"timestamp":1234567890}

event: notification
data: {"type":"read","notificationId":123}
```

## Authentication Flow

1. Client requests `/api/notifications/stream`
2. Server extracts Better Auth session from cookies
3. If no session, return 401 Unauthorized
4. If session valid, establish SSE connection
5. Register connection with user's ID
6. Send events only to authenticated user's connections

## Reconnection Strategy

Following exponential backoff pattern:

- Initial retry: 1 second
- Second retry: 2 seconds
- Third retry: 4 seconds
- Fourth retry: 8 seconds
- Max retry: 30 seconds
- Reset on successful connection

## Benefits of SSE Approach

1. **Real-time Updates**: Instant notification delivery (no 30s delay)
2. **Reduced Server Load**: No constant polling requests
3. **Better UX**: Users see notifications immediately
4. **Efficient**: Single connection vs multiple polling requests
5. **Automatic Reconnection**: Built-in resilience
6. **Browser Support**: Native EventSource API

## Backward Compatibility

The updated [`useNotifications`](src/hooks/useNotifications.tsx:12) hook maintains the same interface:

```typescript
{
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

Components using this hook require no changes.

## Files to Create

1. `src/lib/sse-manager.ts` - SSE connection manager
2. `src/lib/notification-emitter.ts` - Event emitter singleton
3. `src/routes/api/notifications/stream.ts` - SSE endpoint
4. `src/hooks/useNotificationSSE.tsx` - SSE client hook

## Files to Modify

1. `src/integrations/trpc/routes/notification.ts` - Add event emissions
2. `src/integrations/trpc/routes/introduction-request.ts` - Add event emissions
3. `src/hooks/useNotifications.tsx` - Remove polling, add SSE
4. `src/components/template/Notification/Notification.tsx` - Optional status indicator

## Testing Checklist

- [ ] SSE connection establishes successfully
- [ ] Authentication works correctly
- [ ] New notifications appear in real-time
- [ ] Marking as read updates immediately
- [ ] Deleting notifications works
- [ ] Heartbeat keeps connection alive
- [ ] Reconnection works after disconnect
- [ ] Multiple tabs receive notifications
- [ ] No memory leaks on unmount
- [ ] Graceful degradation if SSE fails

## Next Steps

Once you approve this plan, I'll switch to Code mode to implement the solution following these steps exactly.
