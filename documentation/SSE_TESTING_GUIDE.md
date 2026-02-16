# SSE Testing Guide

## Quick Start Testing

### 1. Start the Development Server

```bash
pnpm dev
```

### 2. Open Browser DevTools

1. Open your application in the browser
2. Open DevTools (F12 or Cmd+Option+I)
3. Go to the **Network** tab
4. Filter by "EventStream" or search for "stream"
5. You should see a connection to `/api/notifications/stream`

### 3. Verify SSE Connection

**In the Console tab**, you should see:

```
[SSE] Connecting to notification stream...
[SSE] Connection opened
[SSE] Connected: Connected to notification stream
```

**In the Network tab**, the stream connection should show:

- Status: `200 OK`
- Type: `eventsource`
- Size: (pending)
- Time: (ongoing)

### 4. Test Real-Time Notifications

#### Option A: Multiple Browser Tabs

1. Open your app in **two browser tabs**
2. In Tab 1: Navigate to the search page
3. In Tab 1: Request an introduction to someone
4. In Tab 2: Check the notification dropdown
5. **Expected**: Notification appears instantly in Tab 2 (no refresh needed)

#### Option B: Multiple Browser Windows

1. Open your app in **two different browsers** (Chrome + Firefox)
2. Log in as different users in each browser
3. User A requests introduction to User B's contact
4. **Expected**: User B sees notification instantly

### 5. Test Notification Actions

#### Mark as Read

1. Click on an unread notification
2. **Expected**:
   - Notification background changes (no longer highlighted)
   - Badge count decreases
   - All open tabs update instantly

#### Mark All as Read

1. Click the "Mark all as read" button
2. **Expected**:
   - All notifications marked as read
   - Badge count becomes 0
   - All open tabs update instantly

#### Delete Notification

1. Delete a notification (if delete UI exists)
2. **Expected**:
   - Notification removed from list
   - Badge count updates if it was unread
   - All open tabs update instantly

### 6. Test Reconnection

#### Network Disconnect Test

1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Wait 5 seconds
4. Set throttling back to "No throttling"
5. **Expected**:
   - Console shows reconnection attempts
   - Connection re-establishes automatically
   - Notifications sync after reconnection

#### Server Restart Test

1. Stop the development server (Ctrl+C)
2. Wait 5 seconds
3. Restart the server (`pnpm dev`)
4. **Expected**:
   - Client automatically reconnects
   - Console shows reconnection with exponential backoff
   - Connection re-establishes within 30 seconds

### 7. Test Heartbeat

1. Keep the app open for 1 minute
2. Check the Console tab
3. **Expected**: You should see heartbeat logs every 30 seconds:
   ```
   [SSE] Heartbeat received: Mon Feb 16 2026 16:30:00
   [SSE] Heartbeat received: Mon Feb 16 2026 16:30:30
   [SSE] Heartbeat received: Mon Feb 16 2026 16:31:00
   ```

### 8. Test Multiple Tabs

1. Open your app in **3 browser tabs**
2. Create a notification (request introduction)
3. **Expected**:
   - All 3 tabs receive the notification instantly
   - Badge count updates in all tabs
   - No duplicate notifications

### 9. Test Connection Cleanup

1. Open the app
2. Verify SSE connection in Network tab
3. Close the tab
4. Check server logs
5. **Expected**: Server logs show connection cleanup:
   ```
   [SSE] Connection aborted for user abc123
   [SSE] User abc123 disconnected. Remaining connections: 0
   ```

## Advanced Testing

### Test Authentication

1. Open the app without logging in
2. Try to access `/api/notifications/stream` directly
3. **Expected**: 401 Unauthorized response

### Test Connection Limits

1. Open the app in 10+ tabs
2. Verify all tabs receive notifications
3. Check server logs for connection count
4. **Expected**: All connections tracked, no errors

### Test Event Types

Create different types of notifications and verify they all work:

1. **Introduction Request**
   - Request introduction
   - Verify notification appears with correct icon (🤝)

2. **Introduction Approved**
   - Approve an introduction request
   - Verify notification appears with correct icon (✅)

3. **Introduction Declined**
   - Decline an introduction request
   - Verify notification appears with correct icon (❌)

### Test Error Handling

1. **Invalid Session**
   - Clear cookies
   - Refresh page
   - **Expected**: Redirected to login, no SSE connection

2. **Network Error**
   - Simulate network error (DevTools → Network → Offline)
   - **Expected**: Automatic reconnection attempts

3. **Server Error**
   - Stop server while connected
   - **Expected**: Error logged, reconnection attempts

## Performance Testing

### Memory Leak Test

1. Open the app
2. Open DevTools → Memory tab
3. Take a heap snapshot
4. Open/close notification dropdown 50 times
5. Take another heap snapshot
6. Compare snapshots
7. **Expected**: No significant memory increase

### Connection Stability Test

1. Keep the app open for 1 hour
2. Monitor console for errors
3. Check Network tab for connection status
4. **Expected**:
   - Connection stays active
   - Heartbeats continue every 30s
   - No reconnections (unless network issues)

### Load Test

1. Open the app in 20 tabs
2. Create 10 notifications rapidly
3. Monitor all tabs
4. **Expected**:
   - All tabs receive all notifications
   - No lag or delays
   - No errors in console

## Debugging

### Enable Verbose Logging

The SSE implementation already includes console logs. To see all logs:

1. Open DevTools Console
2. Ensure "Verbose" level is enabled
3. Look for logs prefixed with `[SSE]`

### Check Server Logs

Server logs show:

- Connection establishment
- Event broadcasting
- Connection cleanup
- Error messages

### Inspect SSE Messages

In DevTools Network tab:

1. Click on the `/api/notifications/stream` request
2. Go to the "EventStream" tab
3. See all SSE messages in real-time

### Common Issues

#### Connection Not Establishing

**Symptoms**: No SSE connection in Network tab

**Check**:

- Is user logged in?
- Is server running?
- Check console for errors
- Verify `/api/notifications/stream` endpoint exists

**Solution**:

```bash
# Restart server
pnpm dev

# Clear browser cache
# Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
```

#### Notifications Not Appearing

**Symptoms**: Connection active but no notifications

**Check**:

- Are notifications being created in database?
- Check server logs for event emission
- Verify userId matches
- Check browser console for SSE events

**Solution**:

```typescript
// Add debug logging in notification router
console.log('Emitting notification:created', { userId, notification })
```

#### Frequent Reconnections

**Symptoms**: Connection drops repeatedly

**Check**:

- Network stability
- Server resource usage
- Proxy/load balancer configuration

**Solution**:

- Check network connection
- Increase server resources
- Configure proxy to not buffer SSE

## Success Criteria

✅ **All tests should pass:**

- [ ] SSE connection establishes on page load
- [ ] Authentication works correctly
- [ ] New notifications appear in real-time (<1s latency)
- [ ] Marking as read updates immediately
- [ ] Deleting notifications works
- [ ] Heartbeat keeps connection alive (30s interval)
- [ ] Reconnection works after disconnect
- [ ] Multiple tabs receive notifications
- [ ] Connection cleanup on unmount
- [ ] No memory leaks
- [ ] No console errors
- [ ] Server logs show proper connection management

## Automated Testing (Future)

Consider adding these automated tests:

```typescript
// Example test structure
describe('SSE Notifications', () => {
  it('should establish SSE connection', async () => {
    // Test connection establishment
  })

  it('should receive notifications in real-time', async () => {
    // Test notification delivery
  })

  it('should reconnect after disconnect', async () => {
    // Test reconnection logic
  })

  it('should update all tabs', async () => {
    // Test multi-tab sync
  })
})
```

## Monitoring in Production

### Metrics to Track

1. **Connection Count**
   - Active SSE connections
   - Connections per user
   - Peak concurrent connections

2. **Event Delivery**
   - Events sent per minute
   - Delivery latency
   - Failed deliveries

3. **Reconnections**
   - Reconnection rate
   - Reconnection reasons
   - Average reconnection time

4. **Errors**
   - Authentication failures
   - Connection errors
   - Event emission errors

### Health Check

Create a health check endpoint:

```typescript
// GET /api/notifications/health
{
  "status": "healthy",
  "connections": {
    "total": 150,
    "activeUsers": 75
  },
  "uptime": 3600000
}
```

## Rollback Plan

If issues arise in production:

1. **Immediate**: Revert client-side changes
   - Restore polling in `useNotifications.tsx`
   - Remove SSE hook usage

2. **Keep**: Server-side SSE infrastructure
   - No harm if unused
   - Can debug without affecting users

3. **Fix**: Address issues offline
   - Test thoroughly
   - Re-deploy when ready

## Next Steps

After successful testing:

1. ✅ Verify all tests pass
2. ✅ Document any issues found
3. ✅ Deploy to staging environment
4. ✅ Test in staging
5. ✅ Deploy to production
6. ✅ Monitor production metrics
7. ✅ Gather user feedback

---

**Last Updated**: February 16, 2026  
**Status**: Ready for Testing  
**Estimated Testing Time**: 30 minutes
