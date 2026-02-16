# SSE Architecture Diagram

## Current Polling Architecture

```mermaid
sequenceDiagram
    participant Client
    participant TanStackQuery
    participant TRPC
    participant Database

    loop Every 30 seconds
        Client->>TanStackQuery: Trigger refetch
        TanStackQuery->>TRPC: notifications.list()
        TRPC->>Database: SELECT notifications
        Database-->>TRPC: Notifications
        TRPC-->>TanStackQuery: Return data
        TanStackQuery-->>Client: Update UI

        TanStackQuery->>TRPC: notifications.getUnreadCount()
        TRPC->>Database: COUNT unread
        Database-->>TRPC: Count
        TRPC-->>TanStackQuery: Return count
        TanStackQuery-->>Client: Update badge
    end
```

## New SSE Architecture

```mermaid
sequenceDiagram
    participant Client
    participant SSEHook
    participant SSEEndpoint
    participant SSEManager
    participant EventEmitter
    participant TRPC
    participant Database

    Note over Client,Database: Initial Connection
    Client->>SSEHook: useNotificationSSE()
    SSEHook->>SSEEndpoint: GET /api/notifications/stream
    SSEEndpoint->>SSEEndpoint: Verify Better Auth session
    SSEEndpoint->>SSEManager: Register connection
    SSEManager-->>SSEEndpoint: Connection registered
    SSEEndpoint-->>SSEHook: SSE connection established

    Note over Client,Database: Heartbeat Loop
    loop Every 30 seconds
        SSEEndpoint->>SSEHook: event: heartbeat
        SSEHook->>SSEHook: Connection alive
    end

    Note over Client,Database: Real-time Notification Flow
    TRPC->>Database: INSERT notification
    Database-->>TRPC: New notification
    TRPC->>EventEmitter: emit('notification:created')
    EventEmitter->>SSEManager: Broadcast to user
    SSEManager->>SSEEndpoint: Send to user's connections
    SSEEndpoint->>SSEHook: event: notification
    SSEHook->>Client: Update TanStack Query cache
    Client->>Client: UI updates instantly
```

## Component Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[Notification.tsx] --> B[useNotifications Hook]
        B --> C[useNotificationSSE Hook]
        B --> D[TanStack Query]
        C --> E[EventSource API]
        E --> F[/api/notifications/stream]
    end

    subgraph "Server Side"
        F --> G[SSE Endpoint Handler]
        G --> H[Better Auth Session]
        G --> I[SSE Connection Manager]
        I --> J[Notification Event Emitter]

        K[TRPC Notification Router] --> L[Database]
        K --> J

        M[TRPC Introduction Router] --> L
        M --> J
    end

    J -.->|Real-time events| I
    I -.->|SSE messages| F
```

## Data Flow: Creating a Notification

```mermaid
sequenceDiagram
    participant User1 as User 1 (Requester)
    participant User2 as User 2 (Approver)
    participant TRPC
    participant DB as Database
    participant Emitter as Event Emitter
    participant Manager as SSE Manager
    participant SSE2 as User 2's SSE Connection

    User1->>TRPC: Create introduction request
    TRPC->>DB: INSERT introduction_request
    TRPC->>DB: INSERT notification (for User 2)
    DB-->>TRPC: New notification created
    TRPC->>Emitter: emit('notification:created', {userId: User2.id, notification})
    Emitter->>Manager: Broadcast to User 2
    Manager->>SSE2: Send SSE event
    SSE2->>User2: Display notification instantly
```

## Reconnection Flow

```mermaid
stateDiagram-v2
    [*] --> Connecting: Initial connection
    Connecting --> Connected: Success
    Connected --> Disconnected: Connection lost
    Disconnected --> Waiting: Start backoff timer
    Waiting --> Connecting: Retry (1s, 2s, 4s, 8s, max 30s)
    Connected --> [*]: Component unmount

    note right of Waiting
        Exponential backoff:
        - 1st retry: 1s
        - 2nd retry: 2s
        - 3rd retry: 4s
        - 4th retry: 8s
        - Max: 30s
    end note
```

## SSE Message Types

```mermaid
graph LR
    A[SSE Events] --> B[heartbeat]
    A --> C[notification]

    C --> D[type: created]
    C --> E[type: read]
    C --> F[type: deleted]

    D --> G[Full notification object]
    E --> H[notificationId]
    F --> I[notificationId]
```

## Connection Management

```mermaid
graph TB
    A[SSE Connection Manager] --> B[User 1 Connections]
    A --> C[User 2 Connections]
    A --> D[User N Connections]

    B --> E[Tab 1]
    B --> F[Tab 2]

    C --> G[Tab 1]

    D --> H[Tab 1]
    D --> I[Tab 2]
    D --> J[Tab 3]

    style A fill:#f9f,stroke:#333,stroke-width:4px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bbf,stroke:#333,stroke-width:2px
    style D fill:#bbf,stroke:#333,stroke-width:2px
```

## Benefits Comparison

| Aspect             | Polling (Current)               | SSE (New)                       |
| ------------------ | ------------------------------- | ------------------------------- |
| **Latency**        | Up to 30 seconds                | Instant (<100ms)                |
| **Server Load**    | High (constant requests)        | Low (persistent connections)    |
| **Bandwidth**      | High (repeated full responses)  | Low (only changes sent)         |
| **Scalability**    | Poor (N users × 2 requests/30s) | Good (N persistent connections) |
| **Battery Impact** | High (mobile devices)           | Low (single connection)         |
| **Real-time**      | No                              | Yes                             |
| **Complexity**     | Low                             | Medium                          |

## Key Implementation Details

### SSE Headers

```typescript
{
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive',
  'X-Accel-Buffering': 'no' // Disable nginx buffering
}
```

### SSE Message Format

```
event: notification
data: {"type":"created","notification":{...}}

event: heartbeat
data: {"timestamp":1234567890}
```

### EventSource Connection

```typescript
const eventSource = new EventSource('/api/notifications/stream', {
  withCredentials: true, // Include cookies for auth
})
```

### Exponential Backoff

```typescript
const delays = [1000, 2000, 4000, 8000, 16000, 30000]
const delay = delays[Math.min(retryCount, delays.length - 1)]
```
