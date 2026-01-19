import { createFileRoute, redirect } from '@tanstack/react-router'
import { tokenUtils } from '~/services/api'
import { useAuth } from '~/contexts/AuthContext'
import { useState } from 'react'
import { Button, Input, Card } from '~/components/ui'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const token = tokenUtils.getToken()
    
    if (token) {
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              IntroHub
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              variant="solid"
              className="w-full"
              loading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

// Made with Bob
