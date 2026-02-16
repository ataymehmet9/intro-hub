# SSE Troubleshooting Guide

## Common Issues and Solutions

### Issue: Constant Connect/Disconnect Loop

**Symptoms**:

- Console shows repeated connection/disconnection messages
- SSE connection never stays stable
- Logs show: `[SSE] Connecting...` → `[SSE] Connection opened` → `[SSE] Disconnecting...` in rapid succession

**Root Cause**:
React useEffect dependency array causing re-renders

**Solution**:
✅ **Fixed** - The `useNotificationSSE` hook now uses an empty dependency array `[]` to ensure the effect only runs on mount/unmount.

**Technical Details**:

```typescript
// ❌ WRONG - Causes infinite loop
useEffect(() => {
  connect()
  return () => disconnect()
}, [connect, disconnect]) // These change on every render

// ✅ CORRECT - Runs once
useEffect(() => {
  connect()
  return () => disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []) // Empty deps - only mount/unmount
```

### Issue: Connection Not Establishing

**Symptoms**:

- No SSE connection in Network tab
- Console shows no `[SSE]` logs
- Notifications don't appear

**Possible Causes**:

1. User not authenticated
2. Server not running
3. EventSource not supported (old browser)

**Solutions**:

1. Verify user is logged in with valid session
2. Check server is running: `pnpm dev`
3. Check browser compatibility (IE11 not supported)
4. Check console for error messages

### Issue: Notifications Not Appearing

**Symptoms**:

- SSE connection active
- No notifications received
- Server logs show events being emitted

**Possible Causes**:

1. UserId mismatch
2. Event not being emitted
3. Cache not updating

**Solutions**:

1. Verify userId in SSE connection matches notification userId
2. Check server logs for event emission
3. Check browser console for SSE event logs
4. Verify TanStack Query cache is updating

### Issue: Multiple Connections Per User

**Symptoms**:

- Server logs show multiple connections for same user
- Duplicate notifications

**Expected Behavior**:
This is **normal** if user has multiple tabs open. Each tab maintains its own SSE connection.

**Verify**:

```typescript
// Check connection count
import { sseManager } from '@/lib/sse-manager'
console.log(sseManager.getStats())
```

### Issue: Memory Leaks

**Symptoms**:

- Memory usage increases over time
- Browser becomes slow
- Connections not cleaned up

**Solutions**:

1. Verify cleanup function runs on unmount
2. Check EventSource is closed properly
3. Check event listeners are removed
4. Use browser DevTools Memory profiler

**Verification**:

```typescript
// Should see this on tab close
[SSE] Disconnecting...
[SSE] Connection aborted for user abc123
[SSE] User abc123 disconnected. Remaining connections: 0
```

### Issue: Heartbeat Not Working

**Symptoms**:

- No heartbeat logs in console
- Connection drops after ~1 minute

**Solutions**:

1. Check server heartbeat interval is set (30s)
2. Verify heartbeat event listener is registered
3. Check proxy/load balancer isn't buffering

**Expected Logs**:

```
[SSE] Heartbeat received: Mon Feb 16 2026 16:30:00
[SSE] Heartbeat received: Mon Feb 16 2026 16:30:30
[SSE] Heartbeat received: Mon Feb 16 2026 16:31:00
```

### Issue: Reconnection Not Working

**Symptoms**:

- Connection drops and doesn't reconnect
- Error state persists

**Solutions**:

1. Check exponential backoff is working
2. Verify reconnection logic in error handler
3. Check network connectivity
4. Review browser console for errors

**Expected Behavior**:

```
[SSE] Connection error
[SSE] Reconnecting in 1000ms (attempt 1)
[SSE] Connecting to notification stream...
[SSE] Connection opened
```

## Debug Mode

To enable verbose logging, the implementation already includes console logs. Ensure your browser console shows all log levels.

### Server-Side Debugging

Add additional logging in the SSE endpoint:

```typescript
// In src/routes/api/notifications/stream.ts
console.log('[SSE DEBUG] Session:', session)
console.log('[SSE DEBUG] User ID:', userId)
console.log('[SSE DEBUG] Connection registered')
```

### Client-Side Debugging

Add additional logging in the SSE hook:

```typescript
// In src/hooks/useNotificationSSE.tsx
console.log('[SSE DEBUG] EventSource created')
console.log('[SSE DEBUG] Event received:', event)
console.log('[SSE DEBUG] Cache updated')
```

## Performance Issues

### High Memory Usage

**Normal**: ~1-2KB per connection
**High**: >10KB per connection

**Solutions**:

1. Check for memory leaks
2. Verify connections are cleaned up
3. Limit maximum connections per user

### High CPU Usage

**Normal**: <1% CPU for SSE
**High**: >5% CPU

**Solutions**:

1. Check heartbeat interval (should be 30s)
2. Verify event handlers are efficient
3. Check for infinite loops

### High Network Usage

**Normal**: ~50 bytes per 30s (heartbeat)
**High**: >1KB per 30s

**Solutions**:

1. Check heartbeat payload size
2. Verify no duplicate connections
3. Check event payload sizes

## Browser-Specific Issues

### Safari

**Issue**: Connection drops on tab background
**Solution**: This is expected Safari behavior. Connection will reconnect when tab becomes active.

### Firefox

**Issue**: EventSource not working in private mode
**Solution**: Firefox blocks EventSource in private browsing. This is a browser limitation.

### Chrome

**Issue**: Too many connections warning
**Solution**: Chrome limits 6 connections per domain. SSE uses 1 connection per tab, which is acceptable.

## Production Issues

### Load Balancer Configuration

If using a load balancer, ensure it's configured for SSE:

**Nginx**:

```nginx
location /api/notifications/stream {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;
    proxy_cache off;
    chunked_transfer_encoding off;
}
```

**Apache**:

```apache
ProxyPass /api/notifications/stream http://backend/api/notifications/stream
ProxyPassReverse /api/notifications/stream http://backend/api/notifications/stream
SetEnv proxy-nokeepalive 1
SetEnv proxy-initial-not-pooled 1
```

### Cloudflare

Cloudflare buffers responses by default. Add this header:

```typescript
'X-Accel-Buffering': 'no'
```

Or disable buffering in Cloudflare dashboard.

## Getting Help

1. Check browser console for errors
2. Check server logs for SSE events
3. Review this troubleshooting guide
4. Check the implementation documentation
5. Test with the testing guide

## Quick Fixes

### Reset Everything

```bash
# Clear browser cache
# Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

# Restart server
pnpm dev

# Check for errors in console
```

### Verify SSE is Working

```typescript
// In browser console
const es = new EventSource('/api/notifications/stream', {
  withCredentials: true,
})
es.onopen = () => console.log('Connected')
es.onerror = (e) => console.error('Error', e)
es.addEventListener('heartbeat', (e) => console.log('Heartbeat', e.data))
```

### Check Connection Status

```typescript
// In React component
const { connectionStatus, isConnected } = useNotificationSSE()
console.log('Status:', connectionStatus, 'Connected:', isConnected)
```

---

**Last Updated**: February 16, 2026  
**Status**: Active Troubleshooting Guide
