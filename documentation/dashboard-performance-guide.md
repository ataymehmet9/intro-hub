# Dashboard Performance Guide

## Database Indexes

The following indexes have been created to optimize dashboard queries:

### Applied Indexes (drizzle/0003_add_dashboard_indexes.sql)

1. **introduction_requests_created_at_idx** - Speeds up date range filtering
2. **introduction_requests_updated_at_idx** - Optimizes response time calculations
3. **introduction_requests_requester_created_idx** - Composite index for requester queries
4. **introduction_requests_approver_created_idx** - Composite index for approver queries
5. **introduction_requests_status_created_idx** - Optimizes status filtering
6. **contacts_created_at_idx** - Speeds up contact date filtering
7. **contacts_user_created_idx** - Composite index for user's contacts

### To Apply Indexes

Run the SQL migration manually:

```bash
psql -d your_database < drizzle/0003_add_dashboard_indexes.sql
```

Or use your database client to execute the SQL file.

## Caching Strategy

### TanStack Query Configuration

All dashboard hooks use optimized caching:

```typescript
{
  staleTime: 5 * 60 * 1000,      // 5 minutes - data stays fresh
  gcTime: 10 * 60 * 1000,         // 10 minutes - cache retention
  refetchOnWindowFocus: false,    // Don't refetch on tab switch
  placeholderData: keepPreviousData // Smooth transitions
}
```

### Cache Keys

- `dashboard.getStats` - Keyed by date range and granularity
- `dashboard.getTrendData` - Keyed by date range and granularity
- `dashboard.getTopContacts` - Keyed by date range, granularity, and limit

## Performance Benchmarks

### Expected Query Times (with indexes)

- **getStats**: < 100ms for 1 year of data
- **getTrendData**: < 200ms for 90 days with daily granularity
- **getTopContacts**: < 150ms for top 10 contacts

### Optimization Tips

1. **Date Range Selection**
   - Shorter ranges = faster queries
   - Use presets for common ranges
   - Granularity auto-adjusts to prevent over-fetching

2. **Data Aggregation**
   - Daily: Best for < 30 days
   - Weekly: Best for 30-90 days
   - Monthly: Best for > 90 days

3. **Browser Caching**
   - Data cached for 5 minutes
   - Reduces server load
   - Instant navigation between tabs

## Monitoring Performance

### Check Query Performance

```sql
-- Check slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
WHERE query LIKE '%introduction_requests%'
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE tablename IN ('introduction_requests', 'contacts')
ORDER BY idx_scan DESC;
```

### Frontend Performance

Use React DevTools Profiler to measure:

- Component render times
- Re-render frequency
- Memory usage

## Load Testing

### Recommended Tools

1. **k6** - Load testing
2. **Artillery** - API testing
3. **Lighthouse** - Frontend performance

### Test Scenarios

1. **Concurrent Users**: 50 users loading dashboard simultaneously
2. **Date Range Variations**: Test with 7, 30, 90, 365 day ranges
3. **Data Volume**: Test with 1K, 10K, 100K records

## Optimization Checklist

- [x] Database indexes on date columns
- [x] Composite indexes for common query patterns
- [x] TanStack Query caching (5 min stale time)
- [x] Optimistic UI updates
- [x] Lazy loading for charts
- [x] Suspense boundaries for code splitting
- [x] Memoized calculations
- [x] Debounced date range changes
- [x] Responsive image loading
- [x] Efficient SQL aggregations

## Future Optimizations

1. **Server-Side Caching**: Add Redis for frequently accessed data
2. **Materialized Views**: Pre-aggregate common queries
3. **CDN**: Cache static chart images
4. **Web Workers**: Offload heavy calculations
5. **Virtual Scrolling**: For large contact lists
6. **Progressive Loading**: Load critical data first

## Troubleshooting

### Slow Queries

1. Check if indexes are applied: `\d+ introduction_requests`
2. Analyze query plan: `EXPLAIN ANALYZE SELECT ...`
3. Check for missing indexes on foreign keys
4. Verify date range is reasonable (< 1 year)

### High Memory Usage

1. Reduce date range
2. Decrease top contacts limit
3. Clear browser cache
4. Check for memory leaks in DevTools

### Stale Data

1. Verify cache configuration
2. Check network tab for failed requests
3. Manually invalidate cache: `queryClient.invalidateQueries()`
4. Reduce staleTime if data changes frequently
