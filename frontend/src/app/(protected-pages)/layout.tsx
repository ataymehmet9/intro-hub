'use client'

import React from 'react'
import PostLoginLayout from '@/components/layouts/PostLoginLayout'
import { AuthProvider } from '@/contexts/AuthContext'
import { ContactProvider } from '@/contexts/ContactContext'
import { RequestProvider } from '@/contexts/RequestContext'
import { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <AuthProvider>
            <ContactProvider>
                <RequestProvider>
                    <PostLoginLayout>{children}</PostLoginLayout>
                </RequestProvider>
            </ContactProvider>
        </AuthProvider>
    )
}

export default Layout
