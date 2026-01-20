'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'
import { toast } from '~/components/ui'
import { loginUser, signupUser, getCurrentUser } from '~/server/auth.functions'
import { tokenUtils } from '~/services/api'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  company?: string
  position?: string
  bio?: string
  profile_image?: string
}

export interface SignupData {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  company?: string
  position?: string
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupData) => Promise<void>
  logout: () => void
  updateUserProfile: (userData: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = tokenUtils.getToken()
      
      // Only fetch user if we have a token but no user data
      if (storedToken && !user) {
        try {
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Error fetching user data:', error)
          handleLogout()
        }
      }
      
      setIsLoading(false)
    }

    initializeAuth()
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUser({ data: { email, password } })
      
      tokenUtils.setToken(result.token)
      setUser(result.user)
      setIsAuthenticated(true)
      
      toast.push(
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Login successful!</span>
        </div>,
        {
          placement: 'top-end',
        }
      )
      
      // Only navigate on successful login
      await router.navigate({ to: '/dashboard' })
    } catch (error: any) {
      // Don't show toast here, let the login page handle the error display
      console.error('Login error in AuthContext:', error)
      throw error
    }
  }

  const signup = async (data: SignupData) => {
    try {
      const result = await signupUser({ data })
      
      tokenUtils.setToken(result.token)
      setUser(result.user)
      setIsAuthenticated(true)
      
      toast.push(
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Account created successfully!</span>
        </div>,
        {
          placement: 'top-end',
        }
      )
      
      router.navigate({ to: '/dashboard' })
    } catch (error: any) {
      toast.push(
        <div className="flex items-center gap-2">
          <span className="text-red-600">✗</span>
          <span>{error.message || 'Signup failed'}</span>
        </div>,
        {
          placement: 'top-end',
        }
      )
      throw error
    }
  }

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const logout = () => {
    tokenUtils.clearTokens()
    setUser(null)
    setIsAuthenticated(false)
    router.navigate({ to: '/login' })
    
    toast.push(
      <div className="flex items-center gap-2">
        <span className="text-blue-600">ℹ</span>
        <span>Logged out successfully</span>
      </div>,
      {
        placement: 'top-end',
      }
    )
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Made with Bob
