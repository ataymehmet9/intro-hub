'use client'

import React from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ContactProvider } from '@/contexts/ContactContext'
import { RequestProvider } from '@/contexts/RequestContext'
import IntroHubLayout from '@/components/intro-hub/layouts/IntroHubLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <ContactProvider>
        <RequestProvider>
          <IntroHubLayout>{children}</IntroHubLayout>
        </RequestProvider>
      </ContactProvider>
    </AuthProvider>
  )
}

// Made with Bob
