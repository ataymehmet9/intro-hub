# Zod Validation Schemas

This directory contains Zod validation schemas that match the database schema defined in `src/db/schema.ts`. These schemas provide runtime validation and type safety for your application data.

## Overview

Each schema file corresponds to a database table and includes:

- **Base Schema**: Full validation for the complete entity
- **Insert Schema**: Validation for creating new records (excludes auto-generated fields)
- **Update Schema**: Validation for updating existing records (all fields optional)
- **Type Exports**: TypeScript types inferred from the schemas

## Schema Files

### Authentication & Authorization

#### `user.schema.ts`

Validates user data including email, name, and profile information.

**Key Validations:**

- Email must be valid and unique
- Name is required and limited to 255 characters
- Image must be a valid URL (optional)

#### `session.schema.ts`

Validates user session data.

**Key Validations:**

- Token is required and unique
- Expiration date must be in the future
- IP address must be valid IPv4 or IPv6 format (optional)

#### `account.schema.ts`

Validates OAuth account connections and credentials.

**Key Validations:**

- Provider ID and Account ID are required
- Tokens are optional but validated when present
- Token expiration dates are validated

#### `verification.schema.ts`

Validates email verification and password reset tokens.

**Key Validations:**

- Identifier and value are required
- Expiration date must be in the future

### Application Data

#### `contact.schema.ts`

Validates contact information.

**Key Validations:**

- Email must be valid (max 255 chars)
- First and last names required (max 100 chars each)
- Phone number format validation (optional)
- LinkedIn URL must be a valid LinkedIn profile (optional)
- Company and position limited to 255 characters (optional)

#### `introduction-request.schema.ts`

Validates introduction requests between users.

**Key Validations:**

- Message is required (max 5000 chars)
- Status must be one of: `pending`, `approved`, `declined`
- Requester and approver cannot be the same person
- Response message required when approving/declining (max 5000 chars)

**Special Schemas:**

- `approveRequestSchema`: For approving requests
- `declineRequestSchema`: For declining requests
- `updateRequestStatusSchema`: Discriminated union for status updates

## Usage Examples

### Basic Validation

```typescript
import { insertContactSchema } from '@/schemas'

// Validate data before inserting
const result = insertContactSchema.safeParse({
  userId: 'user_123',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  company: 'Acme Corp',
})

if (result.success) {
  // Data is valid, use result.data
  await db.insert(contacts).values(result.data)
} else {
  // Handle validation errors
  console.error(result.error.errors)
}
```

### Form Validation

```typescript
import { updateContactSchema } from '@/schemas'

// Validate partial updates
const result = updateContactSchema.safeParse({
  company: 'New Company',
  position: 'Senior Developer',
})

if (result.success) {
  await db.update(contacts).set(result.data).where(eq(contacts.id, contactId))
}
```

### Request Status Updates

```typescript
import { updateRequestStatusSchema } from '@/schemas'

// Validate status update with discriminated union
const result = updateRequestStatusSchema.safeParse({
  status: 'approved',
  responseMessage: 'Happy to make the introduction!',
})

if (result.success) {
  await db
    .update(introductionRequests)
    .set(result.data)
    .where(eq(introductionRequests.id, requestId))
}
```

### API Route Validation

```typescript
import { insertIntroductionRequestSchema } from '@/schemas'

export async function POST(request: Request) {
  const body = await request.json()

  // Validate request body
  const result = insertIntroductionRequestSchema.safeParse(body)

  if (!result.success) {
    return Response.json({ error: result.error.errors }, { status: 400 })
  }

  // Process valid data
  const newRequest = await db
    .insert(introductionRequests)
    .values(result.data)
    .returning()

  return Response.json(newRequest)
}
```

## Error Messages

All schemas include descriptive error messages for validation failures:

- **Type errors**: "Field must be a string/number/date"
- **Required errors**: "Field cannot be empty"
- **Format errors**: "Please enter a valid email/URL/phone number"
- **Length errors**: "Field must be less than X characters"
- **Custom errors**: Business logic validation messages

## Best Practices

1. **Always validate user input**: Use schemas before database operations
2. **Use appropriate schema**: Insert for creation, Update for modifications
3. **Handle errors gracefully**: Provide clear feedback to users
4. **Type safety**: Use exported types for TypeScript type checking
5. **Reuse schemas**: Import from central `index.ts` file

## Extending Schemas

To add custom validation:

```typescript
import { contactSchema } from './contact.schema'
import { z } from 'zod'

// Extend existing schema
export const contactWithMetadataSchema = contactSchema.extend({
  metadata: z.object({
    source: z.string(),
    tags: z.array(z.string()),
  }),
})

// Add custom refinements
export const contactWithValidationSchema = contactSchema.refine(
  (data) => data.email.endsWith('@company.com'),
  { message: 'Must use company email', path: ['email'] },
)
```

## Related Files

- **Database Schema**: `src/db/schema.ts` - Drizzle ORM schema definitions
- **Type Exports**: Each schema file exports TypeScript types
- **Central Export**: `src/schemas/index.ts` - Single import point

## Maintenance

When updating database schema:

1. Update the Drizzle schema in `src/db/schema.ts`
2. Update corresponding Zod schema in this directory
3. Run migrations to update database
4. Update validation rules and error messages as needed
