# Testing Guide - TanStack Start Migration

This guide provides step-by-step instructions for testing the migrated IntroHub application.

## Prerequisites

Ensure both servers are running:

```bash
# Terminal 1: Frontend (TanStack Start)
cd frontend-tanstack
npm run dev
# Running on http://localhost:3000

# Terminal 2: Backend (Go API)
cd backend
go run cmd/api/main.go
# Running on http://localhost:8000
```

---

## Test Checklist

### ✅ Phase 1: Basic Functionality

#### 1.1 Landing Page

- [ ] Visit http://localhost:3000
- [ ] Verify "IntroHub" title displays
- [ ] Verify "Sign In" and "Sign Up" buttons are visible
- [ ] Click "Sign In" - should navigate to `/login`
- [ ] Click "Sign Up" - should navigate to `/signup`

#### 1.2 Authentication Flow

- [ ] **Sign Up**:
  - Navigate to `/signup`
  - Fill in: First Name, Last Name, Email, Password
  - Submit form
  - Should redirect to `/dashboard` on success
  - Should show error message on failure

- [ ] **Log Out**:
  - Click logout button (if available in header)
  - Should redirect to `/login`
  - Should clear authentication token

- [ ] **Log In**:
  - Navigate to `/login`
  - Enter credentials from signup
  - Submit form
  - Should redirect to `/dashboard` on success
  - Should show error message for invalid credentials

#### 1.3 Route Protection

- [ ] Try accessing `/dashboard` without logging in
- [ ] Should redirect to `/login`
- [ ] After login, should be able to access `/dashboard`

---

### ✅ Phase 2: Dashboard Features

#### 2.1 Dashboard Overview

- [ ] Navigate to `/dashboard` (while logged in)
- [ ] Verify welcome message shows user's first name
- [ ] Verify 4 KPI cards display:
  - Total Contacts
  - Total Introductions
  - Pending Requests
  - Approved
- [ ] Verify 3 quick action cards:
  - Manage Contacts
  - Find Contacts
  - Manage Requests
- [ ] Click each quick action card - should navigate correctly

#### 2.2 Recent Activity

- [ ] Verify "Recent Introduction Requests" section
- [ ] If no requests: should show empty state with "Find Contacts" button
- [ ] If requests exist: should show table with request details

---

### ✅ Phase 3: Contact Management

#### 3.1 Contacts Page

- [ ] Navigate to `/contacts`
- [ ] Verify page title "Contacts" displays
- [ ] Verify contact count in subtitle

#### 3.2 Add Contact

- [ ] Click "Add Contact" button
- [ ] Dialog should open with form
- [ ] Fill in required fields:
  - First Name
  - Last Name
  - Email
  - Position
- [ ] Fill in optional fields:
  - Phone
  - Company
  - LinkedIn Profile
  - Relationship
  - Notes
- [ ] Click "Add Contact"
- [ ] Should close dialog and show new contact in list
- [ ] Should show success notification

#### 3.3 Search Contacts

- [ ] Type in search bar
- [ ] Results should filter in real-time
- [ ] Search should work for:
  - Name
  - Email
  - Company
  - Position

#### 3.4 Edit Contact

- [ ] Click on a contact card
- [ ] Click "Edit" button
- [ ] Dialog should open with pre-filled data
- [ ] Modify some fields
- [ ] Click "Save Changes"
- [ ] Should update contact and close dialog
- [ ] Should show success notification

#### 3.5 Delete Contact

- [ ] Click on a contact card
- [ ] Click "Delete" button (if available)
- [ ] Should show confirmation dialog
- [ ] Confirm deletion
- [ ] Contact should be removed from list

---

### ✅ Phase 4: Request Management

#### 4.1 Requests Page

- [ ] Navigate to `/requests`
- [ ] Verify two tabs: "Received" and "Sent"
- [ ] Verify request counts in tab labels

#### 4.2 Received Requests

- [ ] Click "Received" tab
- [ ] Should show requests where you are the connector
- [ ] Verify sections:
  - Pending Approval
  - Completed
- [ ] If no requests: should show empty state

#### 4.3 Approve Request

- [ ] Find a pending received request
- [ ] Click "Approve" button
- [ ] Optional: Add response message
- [ ] Confirm approval
- [ ] Request should move to "Completed" section
- [ ] Status should show "Approved"

#### 4.4 Reject Request

- [ ] Find a pending received request
- [ ] Click "Reject" button
- [ ] Optional: Add response message
- [ ] Confirm rejection
- [ ] Request should move to "Completed" section
- [ ] Status should show "Rejected"

#### 4.5 Sent Requests

- [ ] Click "Sent" tab
- [ ] Should show requests you created
- [ ] Verify sections:
  - Pending
  - Completed
- [ ] Verify you cannot approve/reject your own requests

---

### ✅ Phase 5: Search Feature

#### 5.1 Search Page

- [ ] Navigate to `/search`
- [ ] Verify search bar displays
- [ ] Enter search query
- [ ] Click "Search" button
- [ ] Note: This is a placeholder - full functionality pending

---

### ✅ Phase 6: Profile Management

#### 6.1 View Profile

- [ ] Navigate to `/profile`
- [ ] Verify profile picture/avatar displays
- [ ] Verify personal information shows:
  - First Name
  - Last Name
  - Email

#### 6.2 Edit Profile

- [ ] Click "Edit" button
- [ ] Form should become editable
- [ ] Modify First Name or Last Name
- [ ] Click "Save Changes"
- [ ] Should show success notification
- [ ] Changes should be reflected immediately

#### 6.3 Cancel Edit

- [ ] Click "Edit" button
- [ ] Modify some fields
- [ ] Click "Cancel"
- [ ] Changes should be discarded
- [ ] Form should return to view mode

#### 6.4 Profile Picture

- [ ] Verify avatar shows first initial
- [ ] Verify avatar has colored background
- [ ] Click "Change Picture" button
- [ ] Note: Upload functionality pending

#### 6.5 Password Change

- [ ] Verify "Change Password" section exists
- [ ] Click "Change Password" button
- [ ] Note: Full functionality pending

#### 6.6 Account Actions

- [ ] Verify "Export Your Data" option
- [ ] Verify "Delete Account" option
- [ ] Note: These are placeholders

---

### ✅ Phase 7: UI/UX Testing

#### 7.1 Responsive Design

- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify all layouts adapt correctly
- [ ] Verify navigation works on all sizes

#### 7.2 Dark Mode

- [ ] Toggle dark mode (if available)
- [ ] Verify all pages render correctly
- [ ] Verify text is readable
- [ ] Verify colors are appropriate

#### 7.3 Loading States

- [ ] Verify loading spinners show during:
  - Initial page load
  - Data fetching
  - Form submissions
- [ ] Verify loading messages are clear

#### 7.4 Error States

- [ ] Test with invalid form data
- [ ] Test with network errors (disconnect backend)
- [ ] Verify error messages are clear
- [ ] Verify error notifications appear

#### 7.5 Empty States

- [ ] View pages with no data:
  - Contacts page with no contacts
  - Requests page with no requests
  - Dashboard with no activity
- [ ] Verify empty state messages are helpful
- [ ] Verify call-to-action buttons work

---

### ✅ Phase 8: Performance Testing

#### 8.1 Initial Load

- [ ] Clear browser cache
- [ ] Load http://localhost:3000
- [ ] Measure time to interactive
- [ ] Should be < 2 seconds

#### 8.2 Navigation Speed

- [ ] Navigate between pages
- [ ] Verify instant navigation (no full page reload)
- [ ] Verify smooth transitions

#### 8.3 Large Datasets

- [ ] Add 50+ contacts
- [ ] Verify list renders smoothly
- [ ] Verify search is fast
- [ ] Verify scrolling is smooth

---

### ✅ Phase 9: Browser Compatibility

#### 9.1 Chrome

- [ ] Test all features in Chrome
- [ ] Verify no console errors
- [ ] Verify all styles render correctly

#### 9.2 Firefox

- [ ] Test all features in Firefox
- [ ] Verify no console errors
- [ ] Verify all styles render correctly

#### 9.3 Safari

- [ ] Test all features in Safari
- [ ] Verify no console errors
- [ ] Verify all styles render correctly

#### 9.4 Edge

- [ ] Test all features in Edge
- [ ] Verify no console errors
- [ ] Verify all styles render correctly

---

### ✅ Phase 10: Security Testing

#### 10.1 Authentication

- [ ] Verify JWT token is stored securely
- [ ] Verify token is sent with API requests
- [ ] Verify expired tokens trigger logout
- [ ] Verify unauthorized access is blocked

#### 10.2 Input Validation

- [ ] Test XSS attempts in forms
- [ ] Test SQL injection attempts
- [ ] Verify all inputs are sanitized
- [ ] Verify error messages don't leak sensitive info

---

## Known Issues

Document any issues found during testing:

1. **Issue**: [Description]
   - **Severity**: High/Medium/Low
   - **Steps to Reproduce**: [Steps]
   - **Expected**: [Expected behavior]
   - **Actual**: [Actual behavior]

---

## Test Results Summary

After completing all tests, fill in:

- **Total Tests**: [Number]
- **Passed**: [Number]
- **Failed**: [Number]
- **Skipped**: [Number]
- **Pass Rate**: [Percentage]

---

## Next Steps

Based on test results:

1. Fix any critical bugs
2. Address medium priority issues
3. Optimize performance if needed
4. Update documentation
5. Prepare for production deployment

---

## Automated Testing (Future)

Consider adding:

- Unit tests with Vitest
- Integration tests with Testing Library
- E2E tests with Playwright
- Visual regression tests
- Performance monitoring

---

**Last Updated**: January 19, 2026  
**Tested By**: [Your Name]  
**Version**: 1.0.0
