import {
  Html,
  Button,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
} from '@react-email/components'

type ForgotPasswordEmailProps = {
  to: string
  url: string
}

export const ForgotPasswordEmail = ({ to, url }: ForgotPasswordEmailProps) => (
  <Html lang="en">
    <Head />
    <Body>
      <Container>
        <Section>
          <Heading>Reset your password</Heading>
          <Text>Hi there, {to}</Text>
          <Text>Click the button below to reset your password.</Text>
          <Button href={url}>Reset Password</Button>
        </Section>
      </Container>
    </Body>
  </Html>
)
