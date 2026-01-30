# Next.js vs TanStack Start - Migration Comparison

This document highlights the key differences between the original Next.js implementation and the new TanStack Start version.

---

## 📊 Side-by-Side Comparison

### Project Structure

#### Next.js

```
frontend/
├── src/
│   ├── app/                    # App Router
│   │   ├── (auth-pages)/      # Route groups
│   │   ├── (protected-pages)/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   └── styles/
├── public/
└── next.config.js
```

#### TanStack Start

```
frontend-tanstack/
├── src/
│   ├── routes/                 # File-based routing
│   │   ├── __root.tsx
│   │   ├── _authenticated/    # Layout routes
│   │   └── *.tsx
│   ├── server/                 # Server functions
│   ├── contexts/
│   ├── services/
│   └── components/
├── public/
└── app.config.ts
```

**Key Difference**: TanStack Start uses a flatter structure with dedicated `server/` and `services/` directories.

---

### Routing

#### Next.js (App Router)

```typescript
// app/(protected-pages)/dashboard/page.tsx
export default function DashboardPage() {
  return <div>Dashboard</div>
}

// Navigation
import Link from 'next/link'
<Link href="/dashboard">Dashboard</Link>
```

#### TanStack Start

```typescript
// src/routes/_authenticated/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return <div>Dashboard</div>
}

// Navigation
import { Link } from '@tanstack/react-router'
<Link to="/dashboard">Dashboard</Link>
```

**Key Differences**:

- TanStack uses `createFileRoute()` for route definition
- Type-safe navigation with `to` prop
- Layout routes use `_` prefix
- Auto-generated route tree with full TypeScript support

---

### Data Fetching

#### Next.js (Server Components)

```typescript
// Server Component
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <div>{data.title}</div>
}
```

#### TanStack Start (Server Functions)

```typescript
// src/server/data.functions.ts
import { createServerFn } from '@tanstack/react-start'

export const getData = createServerFn({ method: 'GET' })
  .handler(async () => {
    const res = await fetch('https://api.example.com/data')
    return res.json()
  })

// Component
function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    getData().then(setData)
  }, [])

  return <div>{data?.title}</div>
}
```

**Key Differences**:

- TanStack uses explicit server functions
- Client-side data fetching with hooks
- Type-safe RPC calls
- Can use TanStack Query for caching

---

### Authentication

#### Next.js (NextAuth.js)

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // ...
    }),
  ],
};

export default NextAuth(authOptions);

// Usage
import { useSession } from "next-auth/react";
const { data: session } = useSession();
```

#### TanStack Start (Custom Auth)

```typescript
// src/server/auth.functions.ts
export const loginUser = createServerFn({ method: 'POST' })
  .inputValidator((data) => LoginSchema.parse(data))
  .handler(async ({ data }) => {
    const response = await apiClient.post('/auth/login', data)
    return { token: response.data.token, user: response.data.user }
  })

// src/contexts/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const result = await loginUser({ data: { email, password } })
    tokenUtils.setToken(result.token)
    setUser(result.user)
  }

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Key Differences**:

- TanStack uses custom auth implementation
- More control over auth flow
- JWT tokens managed manually
- Direct integration with backend API

---

### Route Protection

#### Next.js (Middleware)

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
```

#### TanStack Start (Route Config)

```typescript
// src/routes/_authenticated.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const token = tokenUtils.getToken();
    if (!token) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});
```

**Key Differences**:

- TanStack uses `beforeLoad` hook
- Protection defined per route/layout
- Type-safe redirects
- Simpler configuration

---

### Form Handling

#### Next.js (Server Actions)

```typescript
'use server'

async function createContact(formData: FormData) {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
  }

  await db.contacts.create(data)
  revalidatePath('/contacts')
}

// Component
export default function ContactForm() {
  return (
    <form action={createContact}>
      <input name="name" />
      <input name="email" />
      <button type="submit">Create</button>
    </form>
  )
}
```

#### TanStack Start (Server Functions + React Hook Form)

```typescript
// src/server/contact.functions.ts
export const createContact = createServerFn({ method: 'POST' })
  .inputValidator((data) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    const response = await apiClient.post('/contacts', data)
    return response.data
  })

// Component
function ContactForm() {
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    await createContact({ data })
    // Handle success
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <button type="submit">Create</button>
    </form>
  )
}
```

**Key Differences**:

- TanStack uses explicit form libraries
- Client-side validation with Zod
- More control over form state
- Better TypeScript integration

---

### Build Tool

#### Next.js

- **Bundler**: Webpack (or Turbopack in dev)
- **Dev Server**: Next.js dev server
- **Build Time**: ~30-60 seconds
- **HMR**: Good

#### TanStack Start

- **Bundler**: Vite
- **Dev Server**: Vite dev server
- **Build Time**: ~10-20 seconds
- **HMR**: Excellent (instant)

**Key Differences**:

- Vite is significantly faster
- Better HMR experience
- Simpler configuration
- Native ESM support

---

### Configuration

#### Next.js

```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["example.com"],
  },
  env: {
    API_URL: process.env.API_URL,
  },
};
```

#### TanStack Start

```typescript
// app.config.ts
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
  // TanStack Start config
});

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "~": "/src",
    },
  },
});
```

**Key Differences**:

- Separate configs for TanStack and Vite
- More explicit configuration
- Better TypeScript support
- Simpler environment variable handling

---

### Environment Variables

#### Next.js

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
API_SECRET=secret123
```

```typescript
// Usage
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

#### TanStack Start

```bash
# .env
VITE_API_BASE_URL=http://localhost:8000
API_SECRET=secret123
```

```typescript
// Usage
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

**Key Differences**:

- Vite uses `VITE_` prefix for public vars
- Uses `import.meta.env` instead of `process.env`
- Simpler naming convention

---

### Styling

#### Next.js

```typescript
// app/layout.tsx
import './globals.css'

// Component
import styles from './component.module.css'

export default function Component() {
  return <div className={styles.container}>Content</div>
}
```

#### TanStack Start

```typescript
// src/routes/__root.tsx
import appCss from '~/assets/styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
})

// Component (same as Next.js)
import styles from './component.module.css'

export default function Component() {
  return <div className={styles.container}>Content</div>
}
```

**Key Differences**:

- TanStack requires explicit CSS imports in root
- Same CSS Modules support
- Same Tailwind CSS support
- Vite handles CSS processing

---

### TypeScript

#### Next.js

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### TanStack Start

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "~/*": ["./src/*"],
      "@/*": ["./src/*"]
    }
  }
}
```

**Key Differences**:

- TanStack uses modern ES2020 target
- `react-jsx` for JSX transform
- Both path aliases supported
- Better type inference

---

### Deployment

#### Next.js

```bash
# Build
npm run build

# Start
npm run start

# Deploy to Vercel (automatic)
git push
```

#### TanStack Start

```bash
# Build
npm run build

# Start
npm run start

# Deploy (manual or CI/CD)
# - Build Docker image
# - Deploy to VPS/cloud
# - Configure reverse proxy
```

**Key Differences**:

- Next.js has Vercel integration
- TanStack requires manual deployment setup
- More deployment flexibility
- Can deploy anywhere Node.js runs

---

## 📈 Performance Comparison

| Metric              | Next.js   | TanStack Start | Winner      |
| ------------------- | --------- | -------------- | ----------- |
| Dev Server Start    | ~3-5s     | ~1-2s          | ⚡ TanStack |
| HMR Speed           | ~500ms    | ~50ms          | ⚡ TanStack |
| Build Time          | ~30-60s   | ~10-20s        | ⚡ TanStack |
| Bundle Size         | Medium    | Small          | ⚡ TanStack |
| Initial Load        | Fast      | Fast           | 🤝 Tie      |
| Runtime Performance | Excellent | Excellent      | 🤝 Tie      |

---

## 🎯 When to Use Each

### Use Next.js When:

- ✅ Need Vercel deployment
- ✅ Want built-in image optimization
- ✅ Need ISR (Incremental Static Regeneration)
- ✅ Want Server Components
- ✅ Need built-in API routes
- ✅ Want NextAuth.js integration

### Use TanStack Start When:

- ✅ Want faster development experience
- ✅ Need more control over architecture
- ✅ Prefer explicit over implicit
- ✅ Want type-safe routing
- ✅ Need flexible deployment options
- ✅ Want modern build tooling (Vite)

---

## 🔄 Migration Effort

### Easy to Migrate:

- ✅ React components (95% compatible)
- ✅ Styling (CSS, Tailwind, CSS Modules)
- ✅ TypeScript types
- ✅ Static assets
- ✅ Business logic

### Requires Changes:

- 🔄 Routing structure
- 🔄 Data fetching patterns
- 🔄 Authentication implementation
- 🔄 Environment variables
- 🔄 Build configuration

### Significant Rewrite:

- ❌ Server Components → Server Functions
- ❌ Server Actions → Server Functions
- ❌ Middleware → Route guards
- ❌ API routes → Server functions or separate API

---

## 💡 Key Takeaways

1. **TanStack Start is faster** in development
2. **Next.js is more opinionated** with better defaults
3. **TanStack Start gives more control** over architecture
4. **Next.js has better ecosystem** integration
5. **TanStack Start has better TypeScript** support
6. **Both are production-ready** frameworks

---

## 🎓 Learning Curve

### Next.js

- **Beginner**: Easy (lots of tutorials)
- **Intermediate**: Medium (App Router concepts)
- **Advanced**: Medium (Server Components, caching)

### TanStack Start

- **Beginner**: Medium (newer framework)
- **Intermediate**: Easy (explicit patterns)
- **Advanced**: Easy (full control)

---

## 📚 Resources

### Next.js

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Learn Next.js](https://nextjs.org/learn)

### TanStack Start

- [TanStack Start Docs](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [TanStack Examples](https://github.com/TanStack/router/tree/main/examples)

---

**Conclusion**: Both frameworks are excellent choices. Next.js offers more out-of-the-box features and easier deployment, while TanStack Start provides better performance, more control, and a superior development experience. Choose based on your project needs and team preferences.

---

**Last Updated**: January 19, 2026  
**Comparison Version**: Next.js 15 vs TanStack Start (Beta)
