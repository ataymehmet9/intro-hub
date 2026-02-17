import { Resend } from 'resend'

let resendInstance: Resend | null = null

/**
 * Get singleton instance of Resend client
 * @returns {Resend} Resend client instance
 */
export function getResendInstance(): Resend {
  if (!resendInstance) {
    resendInstance = new Resend(import.meta.env.RESEND_API_KEY)
  }
  return resendInstance
}

/**
 * Reset the Resend instance (useful for testing)
 */
export function resetResendInstance(): void {
  resendInstance = null
}
