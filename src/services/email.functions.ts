import { createServerFn } from '@tanstack/react-start'
import { render, pretty, toPlainText } from '@react-email/render'
import { ForgotPasswordEmail } from '@/components/template/email'
import { forgotPasswordEmailSchema } from '@/schemas'
import { getResendInstance } from '@/integrations/resend'

export const sendForgotPasswordEmail = createServerFn({ method: 'POST' })
  .inputValidator(forgotPasswordEmailSchema)
  .handler(async ({ data }) => {
    const { to, url, from } = data
    const resend = getResendInstance()
    const emailHtml = await pretty(
      await render(ForgotPasswordEmail({ to, url })),
    )
    const plainText = toPlainText(emailHtml)

    try {
      const { data: emailData, error } = await resend.emails.send({
        from: from ?? 'Intro Hub <delivered@resend.dev>',
        to: [to],
        subject: 'Reset your password',
        html: emailHtml,
        text: plainText,
      })

      if (error) {
        console.error('Error sending email:', error)

        return { success: false, message: 'Failed to send email' }
      }

      return {
        success: true,
        message: 'Email sent successfully',
        emailId: emailData.id,
      }
    } catch (error) {
      console.error('Error sending email:', error)

      return { success: false, message: 'Unknown error sending email' }
    }
  })
