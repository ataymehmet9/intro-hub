# Search Feature Documentation

## Overview

The Search feature allows users to globally search for contacts across the entire IntroHub network (not just their own contacts) and request introductions to contacts they don't own. The introduction request is sent to the contact's owner, who can then approve or decline the request.

## Architecture

### Backend Layer

#### 1. **Schemas** (`src/schemas/search.schema.ts`)

- `globalSearchInputSchema`: Validates search queries (min 2 chars, max 100 chars)
- `searchResultSchema`: Defines the structure of search results including contact info, owner info, and pending request status
- `globalSearchResponseSchema`: Response wrapper for search results

#### 2. **tRPC Routers**

**Search Router** (`src/integrations/trpc/routes/search.ts`)

- `globalSearch`: Searches contacts globally by name, company, or position
  - Excludes current user's own contacts
  - Joins with user table to get owner information
  - Left joins with introductionRequests to check for pending requests
  - Returns contacts with `hasPendingRequest` flag

**Introduction Request Router** (`src/integrations/trpc/routes/introduction-request.ts`)

- `create`: Creates a new introduction request
  - Validates requester is not the contact owner
  - Checks for existing pending requests
  - Creates request record with 'pending' status
  - TODO: Send email notification to contact owner
- `listByUser`: Gets all requests where user is requester or approver
- `updateStatus`: Allows approver to approve/decline requests

### State Management

#### Search Store (`src/routes/_authenticated/(search)/-store/searchStore.ts`)

- Manages search query and selected search fields
- Tracks search results and selected contact
- Handles table pagination and sorting state
- Provides reset functionality

### Custom Hooks

#### useSearch (`src/routes/_authenticated/(search)/-hooks/useSearch.tsx`)

- Wraps tRPC `search.globalSearch` query
- Handles loading states and error handling
- Only fetches when query is at least 2 characters
- Returns results, loading state, and table utilities

#### useIntroductionRequest (`src/routes/_authenticated/(search)/-hooks/useIntroductionRequest.tsx`)

- Wraps tRPC `introductionRequests.create` mutation
- Handles success/error notifications
- Invalidates search queries on success to update pending status
- Provides loading state for UI feedback

### UI Components

#### 1. **SearchBar** (`-components/SearchBar.tsx`)

- Debounced search input (300ms delay)
- Clear button to reset search
- Validation message for queries < 2 characters
- Uses Ecme Input component with search icon

#### 2. **SearchResultsTable** (`-components/SearchResultsTable.tsx`)

- Displays search results in a DataTable
- Columns: Name (with avatar), Email, Company, Owner, Added date, Actions
- Action button shows "Request Introduction" or "Pending" badge
- Pending badge appears for contacts with existing pending requests
- Uses stringToColor for consistent avatar colors

#### 3. **IntroductionRequestModal** (`-components/IntroductionRequestModal.tsx`)

- Modal dialog for requesting introductions
- Displays contact information card with avatar
- Shows owner information
- Email template editor with:
  - Pre-filled message template including requester details
  - Character counter (max 1000 chars)
  - Validation (min 10 chars)
- Submit button with loading state

#### 4. **NoSearchResults** (`-components/NoSearchResults.tsx`)

- Empty state component for no results
- Displays search query
- Provides helpful search tips
- Uses consistent styling with other empty states

#### 5. **Main Route** (`search.tsx`)

- File-based route at `/search`
- Manages modal state for introduction requests
- Handles search and request submission
- Shows different states:
  - Initial state: "Start searching" message
  - Loading state: Skeleton loaders
  - Results state: Data table with results
  - No results state: NoSearchResults component

## User Flow

### Search Flow

1. User navigates to Search page via navigation menu
2. User enters search query (min 2 characters)
3. Search is debounced (300ms) and sent to backend
4. Backend searches across all contacts (excluding user's own)
5. Results are displayed in a table with owner information
6. Contacts with pending requests show "Pending" badge

### Introduction Request Flow

1. User clicks "Request Introduction" button on a search result
2. IntroductionRequestModal opens with contact details
3. User edits the pre-filled email template message
4. User clicks "Send Request"
5. Request is created in database with 'pending' status
6. Success notification is shown
7. Button changes to "Pending" badge
8. TODO: Email is sent to contact owner

### Email Template Structure

**Subject**: `Introduction Request: [Contact Name]`

**Body**:

```
Hi [Owner Name],

You have received an introduction request from:

Name: [Requester Name]
Company: [Requester Company]
Position: [Requester Position]

They would like to be introduced to your contact:
[Contact Name] ([Contact Email])

Message from [Requester Name]:
---
[Custom Message]
---

You can approve or decline this request in your IntroHub dashboard.

Best regards,
The IntroHub Team
```

## Database Schema

### Existing Tables Used

**contacts**

- Stores all contact information
- Has userId foreign key to identify owner

**introductionRequests**

- Stores introduction request records
- Fields:
  - `requesterId`: User requesting the introduction
  - `approverId`: Contact owner who can approve/decline
  - `targetContactId`: The contact being requested
  - `message`: Custom message from requester
  - `status`: 'pending' | 'approved' | 'declined'
  - `responseMessage`: Optional message from approver

## API Endpoints

### Search

- **Endpoint**: `trpc.search.globalSearch`
- **Input**: `{ query: string, fields: SearchField[] }`
- **Output**: `{ success: boolean, data: SearchResult[], total: number }`

### Introduction Requests

- **Create**: `trpc.introductionRequests.create`
  - Input: `{ targetContactId: number, message: string }`
  - Output: `{ success: boolean, data: IntroductionRequest }`

- **List**: `trpc.introductionRequests.listByUser`
  - Input: None (uses authenticated user)
  - Output: `{ success: boolean, data: IntroductionRequest[] }`

- **Update Status**: `trpc.introductionRequests.updateStatus`
  - Input: `{ id: number, data: { status, responseMessage } }`
  - Output: `{ success: boolean, data: IntroductionRequest }`

## Security Considerations

1. **Authorization**: All endpoints require authentication
2. **Ownership Validation**: Users cannot request introductions to their own contacts
3. **Duplicate Prevention**: System checks for existing pending requests
4. **Data Isolation**: Search results exclude user's own contacts
5. **Input Validation**: All inputs validated with Zod schemas

## Performance Optimizations

1. **Debounced Search**: 300ms delay prevents excessive API calls
2. **Query Caching**: TanStack Query caches results for 30 seconds
3. **Optimistic Updates**: Button state updates immediately on request
4. **Lazy Loading**: Modal content only loads when opened
5. **Efficient Queries**: Database queries use proper indexes and joins

## Future Enhancements

1. **Email Integration**: Implement actual email sending using Resend
2. **Advanced Filters**: Add filters for location, industry, etc.
3. **Search History**: Track and display recent searches
4. **Saved Searches**: Allow users to save frequent searches
5. **Request Dashboard**: Dedicated page for managing requests
6. **Notifications**: Real-time notifications for request updates
7. **Analytics**: Track search patterns and request success rates
8. **Bulk Requests**: Request introductions to multiple contacts at once

## Testing Checklist

### Search Functionality

- [ ] Search with valid query (>= 2 chars) returns results
- [ ] Search with query < 2 chars shows validation message
- [ ] Search excludes user's own contacts
- [ ] Search results show correct owner information
- [ ] Debouncing works correctly (no excessive API calls)
- [ ] Clear button resets search
- [ ] Loading states display correctly
- [ ] No results state displays with helpful tips

### Introduction Request Flow

- [ ] Request button opens modal with correct contact info
- [ ] Pre-filled template includes requester details
- [ ] Character counter works correctly
- [ ] Validation prevents submission with < 10 chars
- [ ] Success notification appears on successful request
- [ ] Button changes to "Pending" badge after request
- [ ] Cannot request introduction to own contacts
- [ ] Cannot create duplicate pending requests
- [ ] Modal closes on successful submission

### UI/UX

- [ ] Navigation menu shows Search option
- [ ] Page is responsive on mobile devices
- [ ] Dark mode works correctly
- [ ] Avatars use consistent colors
- [ ] Table sorting works
- [ ] Tooltips display correctly
- [ ] Loading skeletons match table structure

## Troubleshooting

### Common Issues

**Search returns no results**

- Verify database has contacts from other users
- Check that search query matches contact data
- Ensure user is authenticated

**Request button disabled**

- Check if there's already a pending request
- Verify contact doesn't belong to current user
- Check browser console for errors

**Modal doesn't open**

- Check for JavaScript errors in console
- Verify contact data is properly loaded
- Ensure modal state management is working

## Code Examples

### Using the Search Hook

```typescript
const { results, isLoading } = useSearch({
  query: searchQuery,
  enabled: searchQuery.length >= 2,
})
```

### Creating an Introduction Request

```typescript
const { createRequest } = useIntroductionRequest({
  onSuccess: () => {
    // Handle success
  },
})

await createRequest({
  targetContactId: contact.id,
  message: 'Your custom message here',
})
```

### Accessing Search Store

```typescript
const { searchQuery, setSearchQuery } = useSearchStore((state) => state)
```

## Related Documentation

- [Contacts Feature](./batch-upload-contacts.md)
- [Authentication](./security-analysis-auth-secret.md)
- [Docker Setup](./docker-setup.md)

---

**Last Updated**: 2026-02-16  
**Version**: 1.0.0  
**Author**: Bob (AI Assistant)
