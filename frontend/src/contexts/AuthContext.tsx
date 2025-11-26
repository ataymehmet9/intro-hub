'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { toast, Notification as NotificationComponent } from '@/components/ui'
import {
  login as loginService,
  register as registerService,
  getCurrentUser
} from '@/services/auth'
import { tokenUtils } from '@/services/api'
import { AuthContextType, User, SignupData } from '@/types/intro-hub'

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenUtils.getToken()
      
      if (storedToken) {
        setToken(storedToken)
        // Sync token to cookie for middleware
        document.cookie = `intro_hub_token=${storedToken}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
        
        try {
          console.log('Attempting to fetch user data...')
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
          console.log('User data fetched successfully:', userData)
        } catch (error) {
          console.error('Error fetching user data:', error)
          handleLogout()
        }
      } else {
        console.log('No token found. Skipping authentication.')
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  // Handle login
  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true)
      const data = await loginService({ email, password })

      console.log('Login response:', data)

      // Store token in localStorage
      tokenUtils.setToken(data.token)
      setToken(data.token)
      
      // Also set token as cookie for middleware
      document.cookie = `intro_hub_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days

      // Set user data
      setUser(data.user)
      setIsAuthenticated(true)

      // Success notification
      toast.push(
        <NotificationComponent title="Success!" type="success">
          Welcome back!
        </NotificationComponent>
      )
      
      // Redirect to dashboard after successful login
      console.log('Redirecting to dashboard...')
      if (typeof window !== 'undefined') {
        window.location.href = '/dashboard'
      }
    } catch (error: unknown) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.'
      
      toast.push(
        <NotificationComponent title="Error" type="danger">
          {errorMessage}
        </NotificationComponent>
      )
      
      // Don't throw error - just show notification and stay on login page
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup
  const handleSignup = async (userData: SignupData): Promise<void> => {
    try {
      setIsLoading(true)
      await registerService(userData)

      // Automatically log in after successful registration
      await handleLogin(userData.email, userData.password)

      toast.push(
        <NotificationComponent title="Success!" type="success">
          Account created successfully!
        </NotificationComponent>
      )
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.'
      
      toast.push(
        <NotificationComponent title="Error" type="danger">
          {errorMessage}
        </NotificationComponent>
      )
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = (): void => {
    console.log('handleLogout called')
    
    // Clear tokens and state
    tokenUtils.clearTokens()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    
    // Clear cookie
    document.cookie = 'intro_hub_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    // Redirect to login
    router.push('/login')
    
    toast.push(
      <NotificationComponent title="Logged Out" type="info">
        You have been logged out
      </NotificationComponent>
    )
  }

  // Update user profile
  const updateUserProfile = (updatedUserData: Partial<User>): void => {
    setUser((prevUser) => {
      if (!prevUser) return null
      return {
        ...prevUser,
        ...updatedUserData,
      }
    })
  }

  // Context value
  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateUserProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}


