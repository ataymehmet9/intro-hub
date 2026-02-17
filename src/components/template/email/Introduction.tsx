import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from '@react-email/components'

type IntroductionEmailProps = {
  approverName: string
  requesterName: string
  requesterEmail: string
  requesterCompany?: string | null
  requesterPosition?: string | null
  contactName: string
  contactEmail: string
  contactCompany?: string | null
  contactPosition?: string | null
  customMessage: string
}

export const IntroductionEmail = ({
  approverName,
  requesterName,
  requesterEmail,
  requesterCompany,
  requesterPosition,
  contactName,
  contactEmail,
  contactCompany,
  contactPosition,
  customMessage,
}: IntroductionEmailProps) => (
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
          <Heading style={h2}>
            Introduction: {requesterName} {'<>'} {contactName}
          </Heading>

          <Text style={text}>
            Hi {contactName} and {requesterName},
          </Text>

          <Text style={text}>I'd like to introduce you both!</Text>

          {/* Contact Card */}
          <Section style={card}>
            <Text style={cardTitle}>{contactName}</Text>
            {contactPosition && contactCompany && (
              <Text style={cardDetail}>
                {contactPosition} at {contactCompany}
              </Text>
            )}
            {contactPosition && !contactCompany && (
              <Text style={cardDetail}>{contactPosition}</Text>
            )}
            {!contactPosition && contactCompany && (
              <Text style={cardDetail}>{contactCompany}</Text>
            )}
            <Text style={cardEmail}>
              <strong>Email:</strong> {contactEmail}
            </Text>
          </Section>

          {/* Requester Card */}
          <Section style={card}>
            <Text style={cardTitle}>{requesterName}</Text>
            {requesterPosition && requesterCompany && (
              <Text style={cardDetail}>
                {requesterPosition} at {requesterCompany}
              </Text>
            )}
            {requesterPosition && !requesterCompany && (
              <Text style={cardDetail}>{requesterPosition}</Text>
            )}
            {!requesterPosition && requesterCompany && (
              <Text style={cardDetail}>{requesterCompany}</Text>
            )}
            <Text style={cardEmail}>
              <strong>Email:</strong> {requesterEmail}
            </Text>
          </Section>

          {/* Custom Message */}
          {customMessage && (
            <Section style={messageBox}>
              <Text style={messageText}>{customMessage}</Text>
            </Section>
          )}

          <Text style={text}>
            I think you both would benefit from connecting. Please feel free to
            take it from here!
          </Text>

          <Text style={text}>
            Best regards,
            <br />
            {approverName}
          </Text>
        </Section>

        {/* Footer */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            This introduction was facilitated by IntroHub. If you have any
            questions, please contact support.
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
  backgroundColor: '#10b981',
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

const card = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
}

const cardTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const cardDetail = {
  color: '#4b5563',
  fontSize: '14px',
  margin: '4px 0',
}

const cardEmail = {
  color: '#2563eb',
  fontSize: '14px',
  margin: '8px 0 0',
}

const messageBox = {
  backgroundColor: '#ecfdf5',
  border: '1px solid #a7f3d0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const messageText = {
  color: '#064e3b',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
