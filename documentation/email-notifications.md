professionals
• Attend industry events
• Engage on professional networks

````

---

## Error Handling

### Graceful Degradation

Email failures **DO NOT** block core operations:

```typescript
try {
  await sendIntroductionRequestEmail({ data })
} catch (error) {
  // Log error but continue
  console.error('Failed to send email:', error)
}
// Request is still created successfully
````

### Error Logging

All email operations are logged with structured data:

```typescript
console.error('Email Error:', {
  type: 'introduction_request',
  requestId: request.id,
  error: error.message,
  timestamp: new Date().toISOString(),
})
```

### Common Error Types

1. **Resend API Errors**
   - Invalid API key
   - Rate limit exceeded
   - Invalid email address
   - Domain not verified

2. **Template Rendering Errors**
   - Missing required props
   - Invalid React component
   - Rendering timeout

3. **Network Errors**
   - Connection timeout
   - DNS resolution failure
   - SSL certificate issues

### Monitoring

Monitor email delivery in:

- **Resend Dashboard**: View sent emails, delivery status, opens, clicks
- **Application Logs**: Check console for error messages
- **Database**: Track request creation vs email sending

---

## Testing

### Local Development

1. **Use Resend Test Mode**:

   ```env
   RESEND_API_KEY=re_test_xxxxxxxxxxxxx
   ```

2. **Test Email Addresses**:
   - Use your own email for testing
   - Resend test mode delivers to verified addresses only

3. **Preview Templates**:

   ```bash
   # Install React Email CLI
   npm install -g react-email

   # Preview templates
   cd src/components/template/email
   react-email dev
   ```

### Testing Checklist

- [ ] Introduction request email sent successfully
- [ ] Approved email sent with correct contact details
- [ ] Declined email sent with polite message
- [ ] Emails render correctly in Gmail
- [ ] Emails render correctly in Outlook
- [ ] Emails render correctly on mobile
- [ ] Plain text version is readable
- [ ] Dashboard links work correctly
- [ ] Error handling doesn't block operations
- [ ] Logs capture all email events

---

## Production Setup

### 1. Configure Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get production API key
4. Add to environment variables

### 2. Domain Verification

Add DNS records to verify your domain:

```
Type: TXT
Name: @
Value: resend-verify=xxxxxxxxxxxxx
```

### 3. Environment Variables

```env
# Production
RESEND_API_KEY=re_xxxxxxxxxxxxx
APP_URL=https://introhub.com
RESEND_FROM_EMAIL=IntroHub <noreply@introhub.com>
```

### 4. Email Deliverability

Best practices:

- Use verified domain
- Implement SPF, DKIM, DMARC
- Monitor bounce rates
- Handle unsubscribes
- Maintain sender reputation

---

## Customization

### Changing Email Templates

1. Edit React components in `src/components/template/email/`
2. Update styles inline (email clients don't support external CSS)
3. Test in multiple email clients
4. Rebuild application

### Adding New Email Types

1. Create new React Email component
2. Add schema in `src/schemas/email.schema.ts`
3. Create service function in `src/services/email.functions.ts`
4. Call from appropriate tRPC router
5. Update documentation

### Branding

Update these elements in templates:

- Header background color
- Logo (add image URL)
- Font family
- Button colors
- Footer content

---

## Performance

### Email Sending Speed

- Average: 1-2 seconds per email
- Resend API is fast and reliable
- Async operation doesn't block user

### Rate Limits

Resend limits (as of 2024):

- **Free**: 100 emails/day
- **Pro**: 50,000 emails/month
- **Enterprise**: Custom limits

### Optimization Tips

1. **Batch Operations**: Send multiple emails in parallel
2. **Queue System**: Use job queue for high volume (future)
3. **Caching**: Cache rendered templates (future)
4. **Monitoring**: Track delivery rates and optimize

---

## Troubleshooting

### Email Not Received

1. Check spam folder
2. Verify email address is correct
3. Check Resend dashboard for delivery status
4. Review application logs for errors
5. Verify API key is valid

### Template Not Rendering

1. Check React component syntax
2. Verify all props are provided
3. Test template in React Email preview
4. Check for missing imports
5. Review error logs

### API Errors

1. Verify API key is correct
2. Check rate limits in Resend dashboard
3. Ensure domain is verified (production)
4. Review Resend API status page
5. Check network connectivity

---

## Future Enhancements

### Planned Features

1. **Email Preferences**
   - Allow users to opt-out of notifications
   - Frequency settings (immediate, daily digest)
   - Notification type preferences

2. **Rich Content**
   - User avatars in emails
   - Company logos
   - Social media links
   - Profile previews

3. **Analytics**
   - Track email open rates
   - Monitor click-through rates
   - A/B test subject lines
   - Optimize send times

4. **Advanced Features**
   - Email templates editor (admin)
   - Multi-language support
   - Custom branding per organization
   - Scheduled sending

5. **Reliability**
   - Retry mechanism for failed emails
   - Queue system for high volume
   - Fallback email provider
   - Delivery guarantees

---

## API Reference

### sendIntroductionRequestEmail

```typescript
await sendIntroductionRequestEmail({
  data: {
    to: string
    approverName: string
    requesterName: string
    requesterEmail: string
    requesterCompany?: string | null
    requesterPosition?: string | null
    contactName: string
    contactEmail: string
    message: string
    dashboardUrl: string
    from?: string
  }
})

// Returns
{
  success: boolean
  message: string
  emailId?: string
  error?: string
}
```

### sendIntroductionResponseEmail

```typescript
await sendIntroductionResponseEmail({
  data: {
    to: string
    requesterName: string
    approverName: string
    contactName: string
    status: 'approved' | 'declined'
    responseMessage?: string | null
    contactEmail?: string | null
    contactCompany?: string | null
    contactPosition?: string | null
    from?: string
  }
})

// Returns
{
  success: boolean
  message: string
  emailId?: string
  error?: string
}
```

---

## Related Documentation

- [Search Feature](./search-feature.md)
- [Introduction Requests](./introduction-requests.md) (future)
- [Resend Integration](https://resend.com/docs)
- [React Email](https://react.email/docs)

---

**Last Updated**: 2026-02-16  
**Version**: 1.0.0  
**Author**: Bob (AI Assistant)
