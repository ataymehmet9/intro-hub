# SSE Implementation Notes & Considerations

## Key Technical Decisions

### 1. Authentication Strategy

**Decision**: Use Better Auth session cookies for SSE authentication

**Rationale**:

- Consistent with existing auth pattern
- No need for separate token generation
- Secure (httpOnly cookies)
- Works with `withCredentials: true` in EventSource

**Implementation**:

```typescript
// In SSE endpoint
const session = await auth.api.getSession({ headers: request.headers })
if (!session?.user) {
  return new Response('Unauthorized', { status: 401 })
}
```

### 2. Connection Management

**Decision**: Singleton SSE Connection Manager with Map<userId, Set<Response>>

**Rationale**:

- Support multiple tabs per user
- Efficient user-specific broadcasting
- Easy cleanup on disconnect
- Memory efficient

**Considerations**:

- Must handle connection cleanup properly to avoid memory leaks
- Need to remove connections when clients disconnect
- Track connection count for monitoring

### 3. Event Emitter Pattern

**Decision**: Use Node.js EventEmitter for notification events

**Rationale**:

- Decouples notification creation from SSE delivery
- Allows multiple listeners (future extensibility)
- Standard Node.js pattern
- Type-safe with TypeScript

**Events**:

- `notification:created` - New notification
- `notification:read` - Notification marked as read
- `notification:deleted` - Notification deleted

### 4. Heartbeat Mechanism

**Decision**: 30-second heartbeat interval

**Rationale**:

- Keeps connection alive through proxies/load balancers
- Detects dead connections
- Matches previous polling interval
- Industry standard

**Implementation**:

```typescript
const heartbeatInterval = setInterval(() => {
  controller.enqueue(
    `event: heartbeat\ndata: ${JSON.stringify({ timestamp: Date.now() })}\n\n`,
  )
}, 30000)
```

### 5. Reconnection Strategy

**Decision**: Exponential backoff with max 30s delay

**Rationale**:

- Prevents thundering herd on server restart
- Gives server time to recover
- Standard retry pattern
- User-friendly (quick initial retries)

**Backoff Sequence**: 1s → 2s → 4s → 8s → 16s → 30s (max)

## Potential Issues & Solutions

### Issue 1: Memory Leaks

**Problem**: Connections not cleaned up properly

**Solutions**:

- Use `AbortController` for cleanup
- Remove connections on `close` event
- Clear heartbeat intervals
- Implement connection timeout (5 minutes idle)

**Code Pattern**:

```typescript
request.signal.addEventListener('abort', () => {
  clearInterval(heartbeatInterval)
  sseManager.removeConnection(userId, controller)
})
```

### Issue 2: Proxy/Load Balancer Buffering

**Problem**: Some proxies buffer SSE responses

**Solutions**:

- Set `X-Accel-Buffering: no` header (nginx)
- Send initial comment to flush buffers
- Regular heartbeats
- Document proxy configuration requirements

**Headers**:

```typescript
{
  'X-Accel-Buffering': 'no',
  'Cache-Control': 'no-cache, no-transform',
}
```

### Issue 3: Browser Tab Limits

**Problem**: Browsers limit concurrent connections per domain (typically 6)

**Solutions**:

- SSE uses HTTP/1.1 persistent connections (counts as 1)
- Use HTTP/2 if available (multiplexing)
- Document browser limitations
- Consider SharedWorker for multiple tabs (future enhancement)

### Issue 4: Mobile Battery Drain

**Problem**: Persistent connections can drain battery

**Solutions**:

- Heartbeat interval is reasonable (30s)
- Browser handles connection efficiently
- Consider reducing heartbeat on mobile (future)
- Document battery impact

### Issue 5: Server Restart

**Problem**: All connections drop on server restart

**Solutions**:

- Automatic reconnection with exponential backoff
- Show connection status to user
- Cache last known state
- Graceful degradation (manual refresh button)

### Issue 6: Database Connection Pool

**Problem**: Each SSE connection might hold a DB connection

**Solutions**:

- Use connection pooling (already configured)
- SSE endpoint doesn't hold DB connections
- Only TRPC mutations access DB
- Event emitter pattern decouples DB from SSE

### Issue 7: Horizontal Scaling

**Problem**: SSE connections are server-specific

**Solutions**:

- **Current**: Single server (not an issue)
- **Future**: Use Redis pub/sub for multi-server
- **Future**: Sticky sessions on load balancer
- Document scaling considerations

## Performance Considerations

### Memory Usage

- Each connection: ~1-2KB overhead
- 1000 users: ~1-2MB
- Acceptable for most deployments

### CPU Usage

- Heartbeat: Minimal (simple string write)
- Event broadcasting: O(n) where n = user's connections
- Acceptable for typical notification volume

### Network Bandwidth

- Heartbeat: ~50 bytes every 30s = ~1.7 bytes/s per connection
- Notification: ~500 bytes per event
- Much lower than polling (2 requests × 1KB every 30s)

## Testing Strategy

### Unit Tests

- SSE Connection Manager
  - Add/remove connections
  - Send to specific user
  - Broadcast to all
  - Cleanup on disconnect

- Notification Event Emitter
  - Event emission
  - Multiple listeners
  - Type safety

### Integration Tests

- SSE endpoint authentication
- Event delivery to correct users
- Heartbeat mechanism
- Reconnection logic
- Multiple tabs per user

### Manual Testing Checklist

- [ ] Open notification dropdown
- [ ] Create notification (different user)
- [ ] Verify real-time appearance
- [ ] Mark as read
- [ ] Verify badge update
- [ ] Delete notification
- [ ] Verify removal
- [ ] Open multiple tabs
- [ ] Verify all tabs receive notifications
- [ ] Disconnect network
- [ ] Verify reconnection
- [ ] Close tab
- [ ] Verify connection cleanup
- [ ] Server restart
- [ ] Verify automatic reconnection

## Monitoring & Debugging

### Metrics to Track

- Active SSE connections count
- Connection duration
- Reconnection rate
- Event delivery latency
- Failed authentication attempts

### Debug Logging

```typescript
// Server-side
console.log(`[SSE] User ${userId} connected`)
console.log(`[SSE] Broadcasting to ${connectionCount} connections`)
console.log(`[SSE] User ${userId} disconnected`)

// Client-side
console.log('[SSE] Connection opened')
console.log('[SSE] Received event:', event.type)
console.log('[SSE] Connection error, retrying in', delay, 'ms')
```

### Browser DevTools

- Network tab: Monitor SSE connection (EventStream)
- Console: Log SSE events
- Application tab: Check cookies for auth

## Migration Checklist

### Pre-Migration

- [ ] Review current polling implementation
- [ ] Identify all notification creation points
- [ ] Document current behavior
- [ ] Set up monitoring

### Migration

- [ ] Implement SSE infrastructure (manager, emitter)
- [ ] Create SSE endpoint
- [ ] Update notification router
- [ ] Create SSE hook
- [ ] Update useNotifications hook
- [ ] Test thoroughly

### Post-Migration

- [ ] Monitor error rates
- [ ] Check connection counts
- [ ] Verify notification delivery
- [ ] Monitor server resources
- [ ] Gather user feedback

### Rollback Plan

If issues arise:

1. Revert client-side changes (restore polling)
2. Keep SSE endpoint (no harm if unused)
3. Investigate issues
4. Fix and re-deploy

## Future Enhancements

### Phase 2 (Optional)

- [ ] Connection status indicator in UI
- [ ] Notification sound/desktop notifications
- [ ] Read receipts
- [ ] Typing indicators (if chat added)

### Phase 3 (Optional)

- [ ] Redis pub/sub for horizontal scaling
- [ ] SharedWorker for tab coordination
- [ ] Service Worker for offline support
- [ ] Push notifications (mobile)

## Security Considerations

### Authentication

- ✅ Session-based auth (secure)
- ✅ httpOnly cookies
- ✅ CSRF protection (Better Auth)
- ✅ User isolation (only see own notifications)

### Authorization

- ✅ Verify user owns notification before sending
- ✅ No cross-user data leakage
- ✅ Validate all inputs

### Rate Limiting

- Consider rate limiting SSE connections per user
- Prevent connection spam
- Monitor for abuse

## Documentation Updates Needed

### Developer Documentation

- SSE architecture overview
- How to emit notification events
- Testing SSE locally
- Debugging SSE connections

### User Documentation

- Real-time notifications feature
- Browser compatibility
- Troubleshooting connection issues

## Dependencies

### New Dependencies

None! Using native browser EventSource API and Node.js EventEmitter

### Existing Dependencies

- Better Auth (authentication)
- TanStack Query (cache management)
- TanStack Router (routing)
- Drizzle ORM (database)

## Browser Compatibility

### EventSource Support

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support
- ❌ IE11: Not supported (but project likely doesn't support IE11)

### Fallback Strategy

If EventSource not supported:

1. Detect in useNotificationSSE hook
2. Fall back to polling
3. Log warning to console

```typescript
if (!window.EventSource) {
  console.warn('EventSource not supported, falling back to polling')
  // Use polling logic
}
```

## Configuration

### Environment Variables

None required for basic implementation

### Optional Configuration

```typescript
// config/sse.config.ts
export const SSE_CONFIG = {
  heartbeatInterval: 30000, // 30 seconds
  maxReconnectDelay: 30000, // 30 seconds
  initialReconnectDelay: 1000, // 1 second
  reconnectBackoffMultiplier: 2,
}
```

## Success Criteria

### Functional Requirements

- ✅ Notifications appear in real-time (<1s latency)
- ✅ Multiple tabs receive notifications
- ✅ Automatic reconnection works
- ✅ Authentication is secure
- ✅ No polling requests

### Non-Functional Requirements

- ✅ Memory usage acceptable (<5MB for 1000 users)
- ✅ CPU usage minimal (<5% increase)
- ✅ Network bandwidth reduced (vs polling)
- ✅ No memory leaks
- ✅ Graceful degradation

### User Experience

- ✅ Instant notification delivery
- ✅ No noticeable delay
- ✅ Reliable connection
- ✅ Works across tabs
- ✅ No breaking changes to UI
