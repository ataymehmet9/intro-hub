'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

export default Layout
