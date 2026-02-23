# Requests Page Server-Side Pagination Implementation

## Overview

Implemented server-side pagination and filtering for the requests page, ensuring URL search params are the source of truth for all pagination state. This provides better performance and scalability compared to client-side pagination.

## Changes Made

### 1. Route Schema Updates (`src/routes/_authenticated/(requests)/requests.tsx`)

- Added `page` and `pageSize` to the search schema with defaults (page: 1, pageSize: 10)
- URL search params now control pagination state
- Added `loaderDeps` to pass pagination params to the loader
- Loader prefetches data with pagination parameters

### 2. Pagination State Management

- Implemented `handlePaginationChange` to update URL when page changes
- Implemented `handlePageSizeChange` to update URL when page size changes and reset to page 1
- Modified `handleTabChange` to reset to page 1 when switching tabs
- All state changes update URL parameters, triggering data refetch

### 3. Backend Updates (`src/integrations/trpc/routes/introduction-request.ts`)

- Updated `listByUser` procedure to accept pagination input:
  - `page`: number (min: 1, default: 1)
  - `pageSize`: number (min: 1, max: 100, default: 10)
- Implemented server-side pagination with SQL LIMIT and OFFSET
- Added total count query for accurate pagination
- Returns paginated response with metadata:
  ```typescript
  {
    success: boolean
    data: IntroductionRequestWithDetails[]
    pagination: {
      total: number
      page: number
      pageSize: number
      totalPages: number
    }
  }
  ```

### 4. Hook Updates (`src/routes/_authenticated/(requests)/-hooks/useRequests.tsx`)

- Updated to pass `page` and `pageSize` to tRPC query
- Query key now includes pagination parameters for proper caching
- Removed client-side pagination logic (now handled by server)
- Client-side filtering still applied for tab switching (sent/received)
- Updated optimistic updates to work with new response structure

### 5. Component Updates (`src/routes/_authenticated/(requests)/-components/RequestsTable.tsx`)

- No changes needed - component already receives paginated data as props
- Passes pagination callbacks to DataTable component

## Data Flow

1. **URL Search Params** → Source of truth for pagination state (page, pageSize, tab)
2. **Route Loader** → Prefetches data with pagination params from URL
3. **tRPC Endpoint** → Queries database with LIMIT/OFFSET, returns paginated results + total count
4. **useRequests Hook** → Fetches paginated data, applies client-side tab filtering
5. **RequestsTable** → Receives paginated data and renders with DataTable
6. **User Interaction** → Updates URL search params, triggering server refetch with new params

## Key Features

- ✅ **Server-Side Pagination**: Database queries only fetch required page of data
- ✅ **URL as Source of Truth**: All pagination state in URL (shareable/bookmarkable)
- ✅ **Proper Caching**: Query keys include pagination params for correct cache invalidation
- ✅ **Performance**: Only fetches data needed for current page
- ✅ **Scalability**: Works efficiently with large datasets
- ✅ **Page Numbers Display Correctly**: Pagination component shows accurate page count
- ✅ **Page Size Selector**: Updates URL and refetches with new page size
- ✅ **Tab Switching**: Resets to page 1 and refetches
- ✅ **Browser Navigation**: Back/forward buttons work correctly

## API Request/Response

### Request

```json
{
  "page": 1,
  "pageSize": 10
}
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "message": "...",
      "status": "pending",
      "requesterName": "John Doe"
      // ... other fields
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pageSize": 10,
    "totalPages": 5
  }
}
```

## Benefits of Server-Side Pagination

1. **Performance**: Only transfers data needed for current page
2. **Scalability**: Handles large datasets efficiently
3. **Database Efficiency**: Uses SQL LIMIT/OFFSET for optimal queries
4. **Memory Usage**: Reduces client-side memory footprint
5. **Network Bandwidth**: Minimizes data transfer
6. **User Experience**: Faster page loads and interactions

## Testing Checklist

- [x] Navigate to requests page - defaults to page 1, 10 items per page
- [x] Click page numbers - URL updates, server fetches new page
- [x] Change page size - URL updates, resets to page 1, server refetches
- [x] Switch between tabs - resets to page 1, server refetches filtered data
- [x] Refresh page - maintains current page and page size from URL
- [x] Share URL with specific page/pageSize - loads that exact state
- [x] Network requests show proper pagination parameters
- [x] Total count and page count display correctly
