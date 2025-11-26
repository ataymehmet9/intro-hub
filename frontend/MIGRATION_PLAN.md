# Intro-Hub to ECME Next.js Migration Plan

## Executive Summary

This document outlines the complete migration strategy for converting the Intro-Hub React application (Material UI) to the ECME Next.js application (Tailwind CSS). The migration involves replacing Material UI components with ECME's custom Tailwind-based component library while maintaining all functionality.

---

## Project Analysis

### Source Project (Intro-Hub)

- **Framework**: React 18.2.0 with Create React App
- **UI Library**: Material UI (@mui/material 5.13.0)
- **Routing**: React Router DOM 6.11.1
- **State Management**: React Context API
- **Forms**: Formik 2.2.9 + Yup 1.1.1
- **Notifications**: Notistack 3.0.1
- **HTTP Client**: Axios 1.4.0
- **Authentication**: Custom JWT-based auth with localStorage

### Target Project (ECME)

- **Framework**: Next.js 15.3.1 with App Router
- **UI Library**: Custom Tailwind CSS components
- **Routing**: Next.js App Router (file-based)
- **State Management**: Zustand 5.0.2 + React Context
- **Forms**: React Hook Form 7.53.0 + Zod 3.23.8
- **Notifications**: Custom toast system
- **HTTP Client**: Axios 1.7.7 (already available)
- **Authentication**: NextAuth 5.0.0-beta.25

---

## Component Mapping Matrix

### Material UI → ECME Tailwind Components

| Material UI Component | ECME Equivalent            | Migration Complexity | Notes                                      |
| --------------------- | -------------------------- | -------------------- | ------------------------------------------ |
| `AppBar`              | Custom Header Component    | Medium               | Use ECME's header template structure       |
| `Drawer`              | `Drawer`                   | Low                  | Direct replacement available               |
| `Box`                 | `div` with Tailwind        | Low                  | Replace with semantic HTML + Tailwind      |
| `Container`           | `div` with `max-w-*`       | Low                  | Use Tailwind container utilities           |
| `Grid`                | Tailwind Grid/Flex         | Low                  | Use `grid` or `flex` utilities             |
| `Card`                | `Card`                     | Low                  | Direct replacement available               |
| `CardContent`         | `Card` body                | Low                  | Use Card's children prop                   |
| `CardActions`         | `Card` footer              | Low                  | Use Card's footer prop                     |
| `Button`              | `Button`                   | Low                  | Direct replacement with similar API        |
| `IconButton`          | `Button` with icon         | Low                  | Use Button's icon prop                     |
| `TextField`           | `Input`                    | Low                  | Direct replacement available               |
| `Typography`          | HTML + Tailwind            | Low                  | Use semantic HTML with Tailwind typography |
| `Avatar`              | `Avatar`                   | Low                  | Direct replacement available               |
| `Chip`                | `Tag` or `Badge`           | Low                  | Use Tag for labels, Badge for counts       |
| `Menu`                | `Dropdown` + `Menu`        | Medium               | Combine Dropdown and Menu components       |
| `MenuItem`            | `MenuItem`                 | Low                  | Direct replacement available               |
| `Dialog`              | `Dialog`                   | Low                  | Direct replacement available               |
| `CircularProgress`    | `Spinner`                  | Low                  | Direct replacement available               |
| `Divider`             | `<hr>` or border utilities | Low                  | Use Tailwind border utilities              |
| `Paper`               | `Card` or `div`            | Low                  | Use Card for elevated surfaces             |
| `Stack`               | Flexbox utilities          | Low                  | Use `flex flex-col` or `flex-row`          |
| `Alert` (MUI)         | `Alert`                    | Low                  | Direct replacement available               |
| `Collapse`            | Framer Motion              | Medium               | Use framer-motion for animations           |
| `CssBaseline`         | Tailwind base styles       | Low                  | Already handled by Tailwind                |
| `ThemeProvider`       | `ConfigProvider`           | Medium               | Use ECME's ConfigProvider                  |

### Icons Migration

| Material UI Icons     | ECME Equivalent  | Notes                                     |
| --------------------- | ---------------- | ----------------------------------------- |
| `@mui/icons-material` | `react-icons`    | ECME uses react-icons (already installed) |
| All MUI icons         | HeroIcons (Hi\*) | Use react-icons/hi or react-icons/hi2     |

---

## Architecture Changes

### 1. Routing Migration

**From: React Router DOM**

```javascript
// Old: routes.js
<Routes>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/contacts" element={<Contacts />} />
</Routes>
```

**To: Next.js App Router**

```
src/app/
├── (protected-pages)/
│   ├── dashboard/
│   │   └── page.tsx
│   ├── contacts/
│   │   └── page.tsx
│   ├── search/
│   │   └── page.tsx
│   ├── requests/
│   │   └── page.tsx
│   └── profile/
│       └── page.tsx
└── (auth-pages)/
    ├── login/
    │   └── page.tsx
    └── signup/
        └── page.tsx
```

### 2. Authentication Strategy

**Option A: Keep Custom JWT Auth (Simpler Migration)**

- Migrate existing AuthContext
- Adapt to Next.js patterns (client components)
- Keep localStorage token management
- Update API interceptors for Next.js

**Option B: Migrate to NextAuth (Better Long-term)**

- Convert to NextAuth providers
- Use server-side session management
- Implement JWT strategy in NextAuth
- Better security and Next.js integration

**Recommendation**: Start with Option A for faster migration, then refactor to Option B.

### 3. State Management

**Current (Intro-Hub)**

- AuthContext for authentication
- ContactContext for contacts
- RequestContext for requests

**Target (ECME)**

- Keep Context API for auth (or use NextAuth)
- Consider Zustand for global state (already available)
- Use SWR for data fetching (already available)

### 4. Form Handling

**From: Formik + Yup**

```javascript
<Formik
  initialValues={{ email: '', password: '' }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
```

**To: React Hook Form + Zod**

```typescript
const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { email: "", password: "" },
});
```

### 5. Notifications

**From: Notistack**

```javascript
const { enqueueSnackbar } = useSnackbar();
enqueueSnackbar("Success!", { variant: "success" });
```

**To: ECME Toast**

```typescript
import { toast } from '@/components/ui'
toast.push(<Notification type="success">Success!</Notification>)
```

---

## Project Structure

### Proposed Directory Structure

```
src/
├── app/
│   ├── (auth-pages)/
│   │   ├── login/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       └── LoginForm.tsx
│   │   └── signup/
│   │       ├── page.tsx
│   │       └── _components/
│   │           └── SignupForm.tsx
│   │
│   ├── (protected-pages)/
│   │   ├── layout.tsx                    # Main layout with sidebar
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── WelcomeSection.tsx
│   │   │       ├── NetworkStats.tsx
│   │   │       └── QuickLinks.tsx
│   │   ├── contacts/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── ContactCard.tsx
│   │   │       ├── ContactForm.tsx
│   │   │       └── ContactList.tsx
│   │   ├── search/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       └── SearchFilters.tsx
│   │   ├── requests/
│   │   │   ├── page.tsx
│   │   │   └── _components/
│   │   │       ├── RequestCard.tsx
│   │   │       └── RequestList.tsx
│   │   └── profile/
│   │       ├── page.tsx
│   │       └── _components/
│   │           └── ProfileForm.tsx
│   │
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts
│
├── components/
│   ├── intro-hub/                        # Migrated components
│   │   ├── common/
│   │   │   ├── ConfirmationDialog.tsx
│   │   │   ├── DateFormat.tsx
│   │   │   └── FileUploadButton.tsx
│   │   ├── contacts/
│   │   │   ├── ContactCard.tsx
│   │   │   └── ContactForm.tsx
│   │   ├── requests/
│   │   │   └── RequestCard.tsx
│   │   └── layouts/
│   │       └── IntroHubLayout.tsx
│   │
│   └── ui/                               # Existing ECME components
│       ├── Alert/
│       ├── Button/
│       ├── Card/
│       └── ...
│
├── contexts/
│   ├── AuthContext.tsx                   # Migrated auth context
│   ├── ContactContext.tsx                # Migrated contact context
│   └── RequestContext.tsx                # Migrated request context
│
├── hooks/
│   ├── useAuth.ts                        # Migrated auth hook
│   ├── useContacts.ts                    # Migrated contacts hook
│   └── useRequests.ts                    # Migrated requests hook
│
├── services/
│   ├── api.ts                            # Axios instance configuration
│   ├── auth.ts                           # Auth API calls
│   ├── contacts.ts                       # Contacts API calls
│   └── requests.ts                       # Requests API calls
│
└── utils/
    ├── formUtils.ts                      # Form utilities
    └── tokenUtils.ts                     # Token management
```

---

## Migration Steps (Detailed)

### Phase 1: Foundation Setup (Priority: High)

#### 1.1 Project Structure

- [ ] Create new directory structure under `src/app/(protected-pages)/`
- [ ] Create `src/components/intro-hub/` for migrated components
- [ ] Set up `src/contexts/` for state management
- [ ] Set up `src/services/` for API calls

#### 1.2 Dependencies

- [ ] Verify axios is available (✓ already installed)
- [ ] Remove Material UI dependencies (not needed)
- [ ] Verify react-icons is available (✓ already installed)
- [ ] Add any missing utilities

#### 1.3 Configuration

- [ ] Configure API base URL in environment variables
- [ ] Set up axios interceptors for authentication
- [ ] Configure CORS if needed

### Phase 2: Core Services & Utilities (Priority: High)

#### 2.1 API Service Layer

- [ ] Migrate `services/api.ts` - Axios instance with interceptors
- [ ] Migrate `services/auth.ts` - Authentication API calls
- [ ] Migrate `services/contacts.ts` - Contacts API calls
- [ ] Migrate `services/requests.ts` - Requests API calls
- [ ] Update API endpoints for Next.js environment

#### 2.2 Utilities

- [ ] Migrate `utils/tokenUtils.ts` - Token management
- [ ] Migrate `utils/formUtils.ts` - Form helpers
- [ ] Create date formatting utilities (replace date-fns if needed)

### Phase 3: Authentication System (Priority: High)

#### 3.1 Context & Hooks

- [ ] Migrate `contexts/AuthContext.tsx`
  - Convert to TypeScript
  - Adapt for Next.js client components
  - Update token storage strategy
  - Integrate with ECME toast for notifications
- [ ] Migrate `hooks/useAuth.ts`
  - Update type definitions
  - Ensure compatibility with Next.js

#### 3.2 Auth Pages

- [ ] Create `app/(auth-pages)/login/page.tsx`
  - Convert Login component to Next.js page
  - Replace Material UI components with ECME components
  - Update form handling to react-hook-form + zod
- [ ] Create `app/(auth-pages)/signup/page.tsx`
  - Convert Signup component to Next.js page
  - Replace Material UI components with ECME components
  - Update form handling

#### 3.3 Route Protection

- [ ] Create middleware for protected routes
- [ ] Implement route guards in layout components
- [ ] Add loading states for auth checks

### Phase 4: Layout System (Priority: High)

#### 4.1 Main Layout

- [ ] Create `app/(protected-pages)/layout.tsx`
  - Migrate MainLayout component
  - Replace Material UI Drawer with ECME Drawer
  - Replace Material UI AppBar with custom header
  - Update navigation menu styling
  - Add responsive mobile menu

#### 4.2 Navigation

- [ ] Create navigation configuration
- [ ] Implement active route highlighting
- [ ] Add user profile menu
- [ ] Implement logout functionality

### Phase 5: Common Components (Priority: Medium)

#### 5.1 Reusable Components

- [ ] Migrate `ConfirmationDialog.tsx`
  - Replace Material UI Dialog with ECME Dialog
  - Update button styling
- [ ] Migrate `DateFormat.tsx`
  - Update date formatting library (use dayjs, already available)
- [ ] Migrate `FileUploadButton.tsx`
  - Replace Material UI Button with ECME Button
  - Update file upload handling
- [ ] Create `LoadingSpinner.tsx`
  - Use ECME Spinner component

### Phase 6: Contact Management (Priority: High)

#### 6.1 Context & Hooks

- [ ] Migrate `contexts/ContactContext.tsx`
  - Convert to TypeScript
  - Update API integration
  - Add error handling
- [ ] Migrate `hooks/useContacts.ts`
  - Update type definitions
  - Consider using SWR for data fetching

#### 6.2 Components

- [ ] Migrate `ContactCard.tsx`
  - Replace Material UI Card with ECME Card
  - Replace Material UI Avatar with ECME Avatar
  - Replace Material UI Chip with ECME Tag
  - Update menu/dropdown functionality
  - Update icon library to react-icons
- [ ] Migrate `ContactForm.tsx`
  - Replace Material UI TextField with ECME Input
  - Convert Formik to react-hook-form
  - Convert Yup to Zod validation
  - Update form layout with Tailwind

#### 6.3 Page

- [ ] Create `app/(protected-pages)/contacts/page.tsx`
  - Migrate Contacts page component
  - Replace Material UI Grid with Tailwind grid
  - Update layout and styling
  - Add search and filter functionality

### Phase 7: Request Management (Priority: High)

#### 7.1 Context & Hooks

- [ ] Migrate `contexts/RequestContext.tsx`
  - Convert to TypeScript
  - Update API integration
- [ ] Migrate `hooks/useRequests.ts`
  - Update type definitions
  - Consider using SWR

#### 7.2 Components

- [ ] Migrate `RequestCard.tsx`
  - Replace Material UI components with ECME
  - Update status badges
  - Add action buttons
  - Update styling

#### 7.3 Page

- [ ] Create `app/(protected-pages)/requests/page.tsx`
  - Migrate Requests page component
  - Add tabs for sent/received requests
  - Update layout and styling

### Phase 8: Dashboard (Priority: High)

#### 8.1 Dashboard Components

- [ ] Create `WelcomeSection.tsx`
  - Replace Material UI Paper with ECME Card
  - Update gradient styling with Tailwind
  - Add responsive layout
- [ ] Create `NetworkStats.tsx`
  - Display contact and introduction counts
  - Use ECME Card component
  - Add visual indicators
- [ ] Create `QuickLinks.tsx`
  - Create quick action buttons
  - Use ECME Button component

#### 8.2 Dashboard Page

- [ ] Create `app/(protected-pages)/dashboard/page.tsx`
  - Migrate Dashboard component
  - Replace Material UI Grid with Tailwind grid
  - Integrate all dashboard sub-components
  - Add loading states
  - Update styling

### Phase 9: Search & Profile (Priority: Medium)

#### 9.1 Search Page

- [ ] Create `app/(protected-pages)/search/page.tsx`
  - Migrate Search component
  - Create search filters
  - Add results display
  - Update styling

#### 9.2 Profile Page

- [ ] Create `app/(protected-pages)/profile/page.tsx`
  - Migrate Profile component
  - Create profile form
  - Add image upload
  - Update styling

### Phase 10: Theme & Styling (Priority: Medium)

#### 10.1 Theme Configuration

- [ ] Remove Material UI theme
- [ ] Configure ECME theme colors to match Intro-Hub branding
- [ ] Update primary/secondary colors
- [ ] Configure dark mode if needed

#### 10.2 Global Styles

- [ ] Review and update global CSS
- [ ] Ensure consistent spacing
- [ ] Update typography styles
- [ ] Add custom animations if needed

### Phase 11: Testing & Refinement (Priority: High)

#### 11.1 Functionality Testing

- [ ] Test authentication flow (login, signup, logout)
- [ ] Test contact CRUD operations
- [ ] Test request management
- [ ] Test navigation and routing
- [ ] Test form validations
- [ ] Test API error handling

#### 11.2 UI/UX Testing

- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test dark mode (if applicable)
- [ ] Test loading states
- [ ] Test error states
- [ ] Verify accessibility

#### 11.3 Performance

- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Add loading skeletons
- [ ] Optimize images

### Phase 12: Documentation (Priority: Medium)

#### 12.1 Code Documentation

- [ ] Add JSDoc comments to components
- [ ] Document API service functions
- [ ] Document custom hooks
- [ ] Add README for intro-hub module

#### 12.2 Migration Documentation

- [ ] Document component mappings
- [ ] Document breaking changes
- [ ] Create migration guide for future reference
- [ ] Document environment variables

---

## Component Migration Examples

### Example 1: Button Migration

**Before (Material UI):**

```jsx
import { Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
<Button
  variant="contained"
  color="primary"
  startIcon={<AddIcon />}
  onClick={handleClick}
>
  Add Contact
</Button>;
```

**After (ECME):**

```tsx
import { Button } from "@/components/ui";
import { HiPlus } from "react-icons/hi2";
<Button variant="solid" icon={<HiPlus />} onClick={handleClick}>
  Add Contact
</Button>;
```

### Example 2: Card Migration

**Before (Material UI):**

```jsx
import { Card, CardContent, CardActions, Typography } from "@mui/material";
<Card>
  <CardContent>
    <Typography variant="h6">Title</Typography>
    <Typography variant="body2">Content</Typography>
  </CardContent>
  <CardActions>
    <Button>Action</Button>
  </CardActions>
</Card>;
```

**After (ECME):**

```tsx
import { Card, Button } from "@/components/ui";
<Card
  header={{ content: <h6>Title</h6> }}
  footer={{ content: <Button>Action</Button> }}
>
  <p className="text-sm">Content</p>
</Card>;
```

### Example 3: Form Migration

**Before (Formik + Material UI):**

```jsx
import { Formik, Form, Field } from "formik";
import { TextField } from "@mui/material";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
});

<Formik
  initialValues={{ email: "", password: "" }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ errors, touched }) => (
    <Form>
      <Field
        as={TextField}
        name="email"
        label="Email"
        error={touched.email && errors.email}
        helperText={touched.email && errors.email}
      />
    </Form>
  )}
</Formik>;
```

**After (React Hook Form + ECME):**

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, FormItem, FormContainer } from "@/components/ui";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(schema),
});

<FormContainer>
  <form onSubmit={handleSubmit(onSubmit)}>
    <FormItem
      label="Email"
      invalid={!!errors.email}
      errorMessage={errors.email?.message}
    >
      <Input {...register("email")} />
    </FormItem>
  </form>
</FormContainer>;
```

### Example 4: Layout Migration

**Before (Material UI):**

```jsx
import { AppBar, Drawer, Toolbar, List, ListItem } from "@mui/material";
<Box sx={{ display: "flex" }}>
  <AppBar position="fixed">
    <Toolbar>
      <Typography>Intro-Hub</Typography>
    </Toolbar>
  </AppBar>
  <Drawer variant="permanent">
    <List>
      <ListItem button>Dashboard</ListItem>
    </List>
  </Drawer>
  <Box component="main">{children}</Box>
</Box>;
```

**After (ECME):**

```tsx
import { Drawer } from "@/components/ui";
import Link from "next/link";
<div className="flex">
  <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b">
    <div className="flex items-center h-full px-4">
      <h1 className="text-xl font-bold">Intro-Hub</h1>
    </div>
  </header>
  <Drawer isOpen={true} placement="left" width={240}>
    <nav>
      <Link href="/dashboard" className="block p-4 hover:bg-gray-100">
        Dashboard
      </Link>
    </nav>
  </Drawer>
  <main className="flex-1 p-6 mt-16">{children}</main>
</div>;
```

---

## Risk Assessment & Mitigation

### High Risk Areas

1. **Authentication Flow**

   - **Risk**: Token management differences between SPA and Next.js
   - **Mitigation**: Thorough testing of auth flow, implement proper error handling

2. **API Integration**

   - **Risk**: CORS issues, different request patterns in Next.js
   - **Mitigation**: Configure API properly, use Next.js API routes if needed

3. **State Management**
   - **Risk**: Context API behavior differences in Next.js
   - **Mitigation**: Mark contexts as 'use client', test thoroughly

### Medium Risk Areas

1. **Form Validation**

   - **Risk**: Different validation patterns between Formik/Yup and RHF/Zod
   - **Mitigation**: Create validation schema mapping guide

2. **Routing**

   - **Risk**: Different routing paradigms
   - **Mitigation**: Create routing migration guide, test all routes

3. **Styling**
   - **Risk**: Visual inconsistencies during migration
   - **Mitigation**: Create component-by-component comparison

---

## Success Criteria

### Functional Requirements

- ✅ All authentication flows work correctly
- ✅ All CRUD operations for contacts work
- ✅ All request management features work
- ✅ Navigation and routing work correctly
- ✅ Forms validate properly
- ✅ API integration works correctly

### Non-Functional Requirements

- ✅ Application is responsive on all devices
- ✅ Performance is equal or better than original
- ✅ Code follows Next.js and TypeScript best practices
- ✅ All components are properly typed
- ✅ No Material UI dependencies remain
- ✅ Bundle size is optimized

### Quality Requirements

- ✅ Code is well-documented
- ✅ Components are reusable
- ✅ Error handling is comprehensive
- ✅ Loading states are implemented
- ✅ Accessibility standards are met

---

## Timeline Estimate

| Phase                          | Estimated Time  | Priority |
| ------------------------------ | --------------- | -------- |
| Phase 1: Foundation Setup      | 2-4 hours       | High     |
| Phase 2: Core Services         | 4-6 hours       | High     |
| Phase 3: Authentication        | 6-8 hours       | High     |
| Phase 4: Layout System         | 4-6 hours       | High     |
| Phase 5: Common Components     | 3-4 hours       | Medium   |
| Phase 6: Contact Management    | 8-10 hours      | High     |
| Phase 7: Request Management    | 6-8 hours       | High     |
| Phase 8: Dashboard             | 6-8 hours       | High     |
| Phase 9: Search & Profile      | 6-8 hours       | Medium   |
| Phase 10: Theme & Styling      | 4-6 hours       | Medium   |
| Phase 11: Testing & Refinement | 8-12 hours      | High     |
| Phase 12: Documentation        | 3-4 hours       | Medium   |
| **Total**                      | **60-84 hours** |          |

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Answer key questions**:
   - Integration approach (new module vs. replacement)
   - Authentication strategy (custom JWT vs. NextAuth)
   - API backend location and configuration
   - Feature prioritization
3. **Set up development environment**
4. **Begin Phase 1: Foundation Setup**

---

## Appendix

### A. Material UI to React Icons Mapping

| Material UI Icon | React Icons Equivalent              |
| ---------------- | ----------------------------------- |
| `Dashboard`      | `HiViewGrid` or `HiHome`            |
| `Contacts`       | `HiUsers`                           |
| `Search`         | `HiSearch`                          |
| `SwapHoriz`      | `HiSwitchHorizontal`                |
| `Person`         | `HiUser`                            |
| `Add`            | `HiPlus`                            |
| `Edit`           | `HiPencil`                          |
| `Delete`         | `HiTrash`                           |
| `MoreVert`       | `HiDotsVertical`                    |
| `Close`          | `HiX`                               |
| `Menu`           | `HiMenu`                            |
| `ChevronRight`   | `HiChevronRight`                    |
| `Business`       | `HiOfficeBuilding`                  |
| `Phone`          | `HiPhone`                           |
| `Email`          | `HiMail`                            |
| `LinkedIn`       | Use `react-icons/fa` - `FaLinkedin` |

### B. Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_TOKEN_KEY=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_KEY=refreshToken

# NextAuth (if using)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### C. TypeScript Types

```typescript
// User types
interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  profile_image?: string;
}

// Contact types
interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  company?: string;
  position: string;
  linkedin_profile?: string;
  relationship?: string;
  created_at: string;
}

// Request types
interface Request {
  id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  // Add other fields as needed
}
```

---

## Document Version

- **Version**: 1.0
- **Date**: 2025-11-21
- **Author**: Migration Planning Team
- **Status**: Draft - Awaiting Review
