import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Link,
} from '@react-email/components'

type IntroductionRequestDeclinedEmailProps = {
  requesterName: string
  approverName: string
  contactName: string
  responseMessage?: string | null
}

export const IntroductionRequestDeclinedEmail = ({
  requesterName,
  approverName,
  contactName,
  responseMessage,
}: IntroductionRequestDeclinedEmailProps) => (
  <Html lang="en">
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Heading style={h1}>IntroHub</Heading>
        </Section>

        {/* Main Content */}
        <Section style={content}>
          <Heading style={h2}>Introduction Request Update</Heading>

          <Text style={text}>Hi {requesterName},</Text>

          <Text style={text}>
            Thank you for your interest in connecting with {contactName}.
            Unfortunately, {approverName} is unable to facilitate this
            introduction at this time.
          </Text>

          {/* Response Message */}
          {responseMessage && (
            <Section style={messageBox}>
              <Text style={messageTitle}>Message from {approverName}:</Text>
              <Text style={messageText}>{responseMessage}</Text>
            </Section>
          )}

          {/* Encouragement */}
          <Section style={encouragementBox}>
            <Text style={encouragementTitle}>Keep Networking!</Text>
            <Text style={encouragementText}>
              While this particular introduction didn't work out, we encourage
              you to continue building your network. Here are some suggestions:
            </Text>
            <Text style={encouragementText}>
              • Try connecting with other professionals in your field
              <br />
              • Attend industry events and conferences
              <br />
              • Engage with content on professional networks
              <br />• Consider alternative paths to reach your goals
            </Text>
          </Section>

          <Text style={text}>
            Thank you for using IntroHub. We wish you the best in your
            networking journey!
          </Text>

          <Text style={text}>
            Need help? Visit our{' '}
            <Link href="https://introhub.com/help" style={link}>
              Help Center
            </Link>{' '}
            or contact support.
          </Text>
        </Section>

        {/* Footer */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            This email was sent by IntroHub. If you have any questions, please
            contact support.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 48px',
  backgroundColor: '#6b7280',
}

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
}

const content = {
  padding: '0 48px',
}

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '32px 0 24px',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const messageBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fde68a',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const messageTitle = {
  color: '#92400e',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const messageText = {
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const encouragementBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const encouragementTitle = {
  color: '#1e40af',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const encouragementText = {
  color: '#1e3a8a',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 12px',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
}

const footer = {
  padding: '0 48px',
}

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
}
