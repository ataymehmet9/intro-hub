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

type IntroductionRequestApprovedEmailProps = {
  requesterName: string
  approverName: string
  contactName: string
  contactEmail: string
  contactCompany?: string | null
  contactPosition?: string | null
  responseMessage?: string | null
}

export const IntroductionRequestApprovedEmail = ({
  requesterName,
  approverName,
  contactName,
  contactEmail,
  contactCompany,
  contactPosition,
  responseMessage,
}: IntroductionRequestApprovedEmailProps) => (
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
          <Heading style={h2}>🎉 Introduction Request Approved!</Heading>

          <Text style={text}>Hi {requesterName},</Text>

          <Text style={text}>
            Great news! {approverName} has approved your introduction request.
          </Text>

          {/* Contact Info Card */}
          <Section style={card}>
            <Text style={cardTitle}>CONTACT INFORMATION:</Text>
            <Text style={cardName}>{contactName}</Text>
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

          {/* Response Message */}
          {responseMessage && (
            <Section style={messageBox}>
              <Text style={messageTitle}>Message from {approverName}:</Text>
              <Text style={messageText}>{responseMessage}</Text>
            </Section>
          )}

          {/* Next Steps */}
          <Section style={nextStepsBox}>
            <Text style={nextStepsTitle}>Next Steps:</Text>
            <Text style={nextStepsText}>
              1. Reach out to {contactName} via email
              <br />
              2. Mention that {approverName} connected you
              <br />
              3. Be professional and respectful of their time
              <br />
              4. Follow up if you don't hear back within a week
            </Text>
          </Section>

          <Text style={text}>
            Good luck with your connection! We hope this introduction leads to
            great opportunities.
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
  padding: '24px',
  margin: '24px 0',
}

const cardTitle = {
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: 'bold',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px',
}

const cardName = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 4px',
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

const messageTitle = {
  color: '#065f46',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const messageText = {
  color: '#064e3b',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const nextStepsBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
}

const nextStepsTitle = {
  color: '#1e40af',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
}

const nextStepsText = {
  color: '#1e3a8a',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
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

// Made with Bob
