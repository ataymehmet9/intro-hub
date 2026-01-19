# IntroHub - TanStack Start

Professional introduction management platform built with TanStack Start, React 19, and TypeScript.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Go backend running on port 8000

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx      # Root route with document shell
│   ├── index.tsx       # Landing page
│   ├── login.tsx       # Login page
│   ├── signup.tsx      # Signup page
│   └── _authenticated/ # Protected routes
│       ├── dashboard.tsx
│       ├── contacts.tsx
│       ├── requests.tsx
│       ├── search.tsx
│       └── profile.tsx
├── server/             # Server functions (type-safe RPCs)
│   ├── auth.functions.ts
│   └── user.functions.ts
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   ├── ContactContext.tsx
│   └── RequestContext.tsx
├── services/           # API service layer
│   ├── api.ts
│   ├── auth.ts
│   ├── contacts.ts
│   └── requests.ts
├── components/         # UI components
│   ├── ui/            # ECME component library
│   ├── shared/        # Shared utilities
│   └── template/      # Template components
├── assets/            # Styles, SVGs, maps
├── types/             # TypeScript types
├── configs/           # Configuration files
└── utils/             # Utility functions
```

## 🔐 Authentication

### Token Management

Tokens are stored in localStorage:

- `accessToken` - JWT access token
- `refreshToken` - JWT refresh token

### Protected Routes

Routes under `_authenticated/` require authentication. Unauthenticated users are redirected to `/login`.

### Auth Context

```typescript
import { useAuth } from "~/contexts/AuthContext";

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  // ...
}
```

## 🛣️ Routing

### File-Based Routing

TanStack Router uses file-based routing:

- `routes/index.tsx` → `/`
- `routes/login.tsx` → `/login`
- `routes/_authenticated/dashboard.tsx` → `/dashboard`

### Navigation

```typescript
import { Link, useRouter } from '@tanstack/react-router'

// Using Link component
<Link to="/dashboard">Dashboard</Link>

// Programmatic navigation
const router = useRouter()
router.navigate({ to: '/dashboard' })
```

### Route Guards

Protected routes use `beforeLoad` hook:

```typescript
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const token = tokenUtils.getToken();
    if (!token) {
      throw redirect({ to: "/login" });
    }
  },
});
```

## 🔧 Server Functions

Server functions provide type-safe RPCs between client and server.

### Authentication

```typescript
import { loginUser, signupUser } from "~/server/auth.functions";

// Login
const result = await loginUser({
  data: { email, password },
});

// Signup
const result = await signupUser({
  data: { email, password, first_name, last_name },
});
```

### User Profile

```typescript
import { updateProfile, changePassword } from "~/server/user.functions";

// Update profile
await updateProfile({
  data: { first_name, last_name, email },
});

// Change password
await changePassword({
  data: { current_password, new_password, confirm_password },
});
```

## 📊 State Management

### Contexts

Three main contexts manage application state:

1. **AuthContext** - User authentication
2. **ContactContext** - Contact management
3. **RequestContext** - Introduction requests

### Usage Example

```typescript
import { useContacts } from "~/contexts/ContactContext";

function ContactsPage() {
  const { contacts, loading, addContact, updateContact, deleteContact } =
    useContacts();

  // ...
}
```

## 🎨 UI Components

### ECME Component Library

The project uses a custom Tailwind CSS component library:

```typescript
import { Button, Card, Input, Dialog } from '~/components/ui'

<Card className="p-6">
  <Input placeholder="Enter text" />
  <Button variant="solid">Submit</Button>
</Card>
```

### Common Components

- `Button` - Buttons with variants
- `Card` - Container with elevation
- `Input` - Form inputs
- `Dialog` - Modal dialogs
- `Drawer` - Side panels
- `Avatar` - User avatars
- `Badge` - Labels and badges
- `Spinner` - Loading indicators

## 🔌 API Integration

### Axios Client

Configured Axios instance with interceptors:

```typescript
import { apiClient } from "~/services/api";

// Automatic auth header injection
const response = await apiClient.get("/contacts");
```

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_TIMEOUT=30000
```

## 🧪 Development

### Scripts

```bash
# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run build  # Includes tsc --noEmit
```

### Hot Module Replacement

Vite provides instant HMR for:

- React components
- CSS/Tailwind styles
- Route changes

### DevTools

TanStack Router DevTools are available in development mode (bottom-right corner).

## 🏗️ Building for Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Start production server
npm run start
```

### Output

Production build creates:

- `.output/` - Server and client bundles
- Optimized and minified code
- Code-split chunks for better performance

## 🚀 Deployment

### Supported Platforms

- **Vercel** - Zero-config deployment
- **Netlify** - Easy deployment with CLI
- **Cloudflare Pages** - Fast global CDN
- **Railway** - Full-stack deployment
- **Fly.io** - Custom deployments

### Environment Variables

Set these in your deployment platform:

```env
VITE_API_BASE_URL=https://api.yourapp.com/api
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 📝 Key Features

- ✅ Full-document SSR
- ✅ Streaming
- ✅ Server functions (type-safe RPCs)
- ✅ File-based routing
- ✅ Type-safe navigation
- ✅ Route guards
- ✅ Hot module replacement
- ✅ Optimized production builds
- ✅ Universal deployment

## 🔄 Migration from Next.js

This project was migrated from Next.js 15 to TanStack Start. See:

- `MIGRATION_PROGRESS.md` - Current migration status
- `../frontend/TANSTACK_START_MIGRATION_PLAN.md` - Complete migration plan

### Key Differences

| Feature       | Next.js           | TanStack Start           |
| ------------- | ----------------- | ------------------------ |
| Routing       | App Router        | File-based Router        |
| Data Fetching | Server Components | Server Functions         |
| Navigation    | `next/link`       | `@tanstack/react-router` |
| Build Tool    | Turbopack/Webpack | Vite                     |
| Deployment    | Vercel-optimized  | Universal                |

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Your License Here]

## 🆘 Support

- Check documentation
- Review migration guides
- Contact development team

---

**Built with:**

- [TanStack Start](https://tanstack.com/start)
- [TanStack Router](https://tanstack.com/router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- [Tailwind CSS](https://tailwindcss.com)
