'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useState, useEffect } from 'react'
import { ReactNode } from 'react'

const NavigationBar = () => {
    const router = useRouter()
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled
                    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
                    : 'bg-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xl">IH</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                            IntroHub
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="/what-is-introhub"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            What is IntroHub
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/get-demo"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            Get a Demo
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="plain"
                            onClick={() => router.push('/login')}
                            size="sm"
                        >
                            Login
                        </Button>
                        <Button
                            variant="solid"
                            onClick={() => router.push('/signup')}
                            size="sm"
                        >
                            Sign up for Free
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

const PublicPagesLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <NavigationBar />
            {children}
        </div>
    )
}

export default PublicPagesLayout


