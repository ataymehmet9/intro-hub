# IntroHub - Next.js Migration Guide

## Overview

IntroHub has been successfully migrated from a React + Material UI application to a Next.js 15 + ECME Tailwind application. This document provides setup instructions, architecture overview, and migration details.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running (default: http://localhost:8000)

### Installation

1. **Clone and install dependencies:**

```bash
npm install
# or
yarn install
```

2. **Configure environment variables:**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API configuration:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

3. **Run the development server:**

```bash
npm run dev
# or
yarn dev
```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   └── (intro-hub)/
│       ├── (auth-pages)/          # Authentication pages
│       │   ├── login/
│       │   └── signup/
│       └── (protected-pages)/     # Protected application pages
│           ├── dashboard/
│           ├── contacts/
│           ├── requests/
│           ├── search/
│           └── profile/
├── components/
│   ├── intro-hub/                 # IntroHub-specific components
│   │   ├── common/                # Shared components
│   │   ├── contacts/              # Contact management
│   │   ├── requests/              # Request management
│   │   └── layouts/               # Layout components
│   └── ui/                        # ECME UI component library
├── contexts/                      # React contexts
│   ├── AuthContext.tsx
│   ├── ContactContext.tsx
│   └── RequestContext.tsx
├── services/                      # API services
│   ├── api.ts                     # Axios configuration
│   ├── auth.ts                    # Authentication API
│   ├── contacts.ts                # Contacts API
│   └── requests.ts                # Requests API
├── types/                         # TypeScript definitions
│   └── intro-hub.ts
└── middleware.ts                  # Route protection
```

## 🎨 Component Migration

### Material UI → ECME Tailwind Mapping

| Material UI        | ECME Tailwind                | Notes                 |
| ------------------ | ---------------------------- | --------------------- |
| `Box`              | `div` with Tailwind classes  | Direct replacement    |
| `Container`        | `div` with `max-w-*` classes | Responsive containers |
| `Paper`            | `Card`                       | Elevated surfaces     |
| `Typography`       | Native HTML + Tailwind       | `h1`, `p`, etc.       |
| `Button`           | `Button`                     | Similar API           |
| `TextField`        | `Input` + `FormItem`         | Form integration      |
| `Dialog`           | `Dialog`                     | Modal dialogs         |
| `Drawer`           | `Drawer`                     | Side panels           |
| `Avatar`           | `Avatar`                     | User avatars          |
| `Chip`             | `Tag` or `Badge`             | Labels and badges     |
| `IconButton`       | `Button` with `icon` prop    | Icon-only buttons     |
| `Menu`             | `Dropdown` + `Menu`          | Dropdown menus        |
| `Snackbar`         | `toast`                      | Notifications         |
| `CircularProgress` | `Spinner`                    | Loading indicators    |
| `Grid`             | Tailwind grid classes        | CSS Grid              |
| `Stack`            | Tailwind flex classes        | Flexbox layouts       |

## 🔐 Authentication

### Token Management

The application uses JWT tokens stored in localStorage:

- **Access Token**: `intro_hub_token`
- **Refresh Token**: `intro_hub_refresh_token`

### Protected Routes

Routes are protected using Next.js middleware (`src/middleware.ts`):

- Unauthenticated users → Redirected to `/login`
- Authenticated users on auth pages → Redirected to `/dashboard`

### Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
    const { user, login, logout, isAuthenticated } = useAuth()
    // ...
}
```

## 📊 State Management

### Contexts

1. **AuthContext**: User authentication and profile
2. **ContactContext**: Contact management and operations
3. **RequestContext**: Introduction request handling

### Usage Example

```typescript
import { useContacts } from '@/contexts/ContactContext'

function ContactsPage() {
    const { contacts, loading, addContact, updateContact, deleteContact } =
        useContacts()
    // ...
}
```

## 🎯 Key Features

### Dashboard

- Welcome message with user info
- Network statistics (contacts, requests)
- Quick action links
- Recent activity preview

### Contacts Management

- Grid view with search
- Add/Edit/Delete contacts
- Contact details with avatar
- Import/Export functionality

### Introduction Requests

- Create new requests
- Approve/Reject incoming requests
- Track request status
- Tabbed interface (Sent/Received)

### Profile Settings

- Update personal information
- Change profile picture
- Password management
- Account actions (export data, delete account)

## 🛠️ Development

### Form Handling

Forms use **React Hook Form** + **Zod** for validation:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    })
    // ...
}
```

### API Calls

API services are centralized in `src/services/`:

```typescript
import { getContacts, createContact } from '@/services/contacts'

// Fetch contacts
const contacts = await getContacts()

// Create contact
const newContact = await createContact({
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
})
```

### Notifications

Use the ECME toast system:

```typescript
import { toast } from '@/components/ui'

toast.push(
  <div className="flex items-center gap-2">
    <span className="text-green-600">✓</span>
    <span>Success message</span>
  </div>
)
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with the ECME design system:

```tsx
<div className="max-w-4xl mx-auto p-6">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Title
    </h1>
    <p className="text-gray-600 dark:text-gray-400 mt-2">Description</p>
</div>
```

### Dark Mode

Dark mode is supported via Tailwind's `dark:` variant:

```tsx
<div className="bg-white dark:bg-gray-800">
    <p className="text-gray-900 dark:text-gray-100">Text</p>
</div>
```

## 🧪 Testing

### Running Tests

```bash
npm run test
# or
yarn test
```

### Test Structure

```
src/
├── __tests__/
│   ├── components/
│   ├── contexts/
│   └── services/
```

## 📦 Build & Deploy

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

Ensure all required environment variables are set in production:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourapp.com/api
```

## 🔄 Migration Checklist

- [x] Project structure setup
- [x] TypeScript types and interfaces
- [x] API services (auth, contacts, requests)
- [x] Context providers (Auth, Contact, Request)
- [x] Common components (LoadingSpinner, ConfirmationDialog, etc.)
- [x] Contact components (ContactCard, ContactForm)
- [x] Request components (RequestCard)
- [x] Layout components (IntroHubLayout)
- [x] Authentication pages (Login, Signup)
- [x] Application pages (Dashboard, Contacts, Requests, Search, Profile)
- [x] Route protection middleware
- [x] Form validation (React Hook Form + Zod)
- [x] Toast notifications
- [x] Dark mode support
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

## 📝 Migration Notes

### Breaking Changes

1. **Material UI Removed**: All Material UI components replaced with ECME Tailwind
2. **Formik → React Hook Form**: Form handling library changed
3. **Yup → Zod**: Validation schema library changed
4. **React Router → Next.js Router**: Routing system changed
5. **notistack → ECME toast**: Notification system changed

### Component API Changes

Most component APIs remain similar, but some props have changed:

```typescript
// Material UI
<Button variant="contained" color="primary">Click</Button>

// ECME Tailwind
<Button variant="solid">Click</Button>
```

### Styling Approach

Changed from CSS-in-JS (Material UI) to utility-first CSS (Tailwind):

```typescript
// Before (Material UI)
<Box sx={{ padding: 2, backgroundColor: 'primary.main' }}>

// After (Tailwind)
<div className="p-4 bg-primary">
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📄 License

[Your License Here]

## 🆘 Support

For issues or questions:

- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Migration Completed**: November 2025  
**Next.js Version**: 15.x  
**React Version**: 19.x  
**ECME Version**: Latest
