# Batch Upload Contacts Endpoint

## Overview

The `batchUpload` endpoint allows users to upload multiple contacts at once via a CSV file. This endpoint processes the CSV content, validates each row, and inserts valid contacts into the database.

## Endpoint Details

### Route

`contactRouter.batchUpload`

### Method

Mutation (POST)

### Authentication

Protected - Requires authenticated user

## Input Schema

```typescript
{
  csvContent: string // CSV file content as a string (minimum 1 character)
}
```

## CSV Format

### Required Columns

- `email` - Contact's email address (must be valid email format)
- `name` - Contact's full name

### Optional Columns

- `company` - Company name
- `position` - Job position/title
- `notes` - Additional notes about the contact
- `phone` - Phone number
- `linkedinUrl` - LinkedIn profile URL

### Example CSV

```csv
email,name,company,position,notes,phone,linkedinUrl
john.doe@example.com,John Doe,Acme Corp,CEO,Met at conference,+1234567890,https://linkedin.com/in/johndoe
jane.smith@example.com,Jane Smith,Tech Inc,CTO,,+0987654321,
bob.jones@example.com,Bob Jones,StartupXYZ,Developer,Referred by John,,https://linkedin.com/in/bobjones
```

## Response Schema

```typescript
{
  success: boolean
  totalRows: number        // Total number of data rows in CSV
  insertedCount: number    // Number of successfully inserted contacts
  errorCount: number       // Number of rows with errors
  errors?: Array<{         // Present only if there are errors
    row: number           // Row number in CSV (1-based, including header)
    error: string         // Error description
  }>
}
```

## Validation Rules

1. **Email Validation**: Must be a valid email format (contains @ and domain)
2. **Required Fields**: Both `email` and `name` must be present
3. **Row Format**: Each row must have the same number of columns as the header
4. **Minimum Rows**: CSV must contain at least a header row and one data row

## Error Handling

### Row-Level Errors

The endpoint continues processing even if individual rows fail validation. Failed rows are reported in the `errors` array with:

- Row number (for easy identification in the source CSV)
- Specific error message

### Common Row Errors

- Missing required fields (email or name)
- Invalid email format
- Malformed CSV rows (incorrect column count)

### Request-Level Errors

These errors stop the entire operation:

- Empty CSV content
- No valid data rows found
- CSV parsing failure
- Database connection issues

## Usage Example

### TypeScript/React

```typescript
import { trpc } from '@/lib/trpc'

const uploadContacts = async (csvFile: File) => {
  // Read file content
  const csvContent = await csvFile.text()

  // Call the endpoint
  const result = await trpc.contact.batchUpload.mutate({
    csvContent,
  })

  console.log(
    `Inserted ${result.insertedCount} of ${result.totalRows} contacts`,
  )

  if (result.errors && result.errors.length > 0) {
    console.error('Errors:', result.errors)
  }
}
```

### cURL Example

```bash
curl -X POST https://your-domain.com/api/trpc/contact.batchUpload \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "csvContent": "email,name,company\njohn@example.com,John Doe,Acme Corp\njane@example.com,Jane Smith,Tech Inc"
  }'
```

## Performance Considerations

1. **Batch Processing**: All valid contacts are inserted in a single database transaction
2. **Error Tolerance**: Invalid rows don't prevent valid rows from being inserted
3. **Memory**: Large CSV files are processed in memory - consider file size limits
4. **Validation**: Each row is validated before insertion to prevent database errors

## Security

- **Authentication Required**: Only authenticated users can upload contacts
- **User Isolation**: Contacts are automatically associated with the authenticated user
- **Input Validation**: All fields are validated before database insertion
- **SQL Injection Protection**: Uses parameterized queries via Drizzle ORM

## Best Practices

1. **CSV Preparation**:
   - Ensure header row matches expected column names exactly
   - Remove any empty rows at the end of the file
   - Use consistent formatting for optional fields

2. **Error Handling**:
   - Always check the `errors` array in the response
   - Log failed rows for manual review
   - Consider implementing retry logic for failed rows

3. **Large Files**:
   - For very large CSV files (>1000 rows), consider chunking
   - Implement progress indicators in the UI
   - Add timeout handling for long-running uploads

4. **Data Quality**:
   - Validate CSV format before upload
   - Remove duplicate emails before upload
   - Standardize phone number and URL formats

## Limitations

- CSV parsing is basic and doesn't handle quoted fields with commas
- No duplicate email detection (database constraints may apply)
- All contacts are inserted with current timestamp
- No support for updating existing contacts (use update endpoint instead)

## Future Enhancements

Potential improvements for this endpoint:

- Support for more complex CSV formats (quoted fields, escaped characters)
- Duplicate detection and handling options
- Dry-run mode to validate without inserting
- Progress callbacks for large files
- Support for other file formats (Excel, JSON)
- Batch update capability for existing contacts
