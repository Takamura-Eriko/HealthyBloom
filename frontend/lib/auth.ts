"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import type { User } from "firebase/auth"

// Mock user for preview
const mockUser: User = {
  uid: "mock-uid",
  email: "mock@example.com",
  displayName: "Mock User",
  photoURL: null,
  emailVerified: true,
  phoneNumber: null,
  isAnonymous: false,
  tenantId: null,
  providerData: [],
  metadata: {
    creationTime: "1620000000000",
    lastSignInTime: "1620000000000",
  },
  refreshToken: "mock-refresh-token",
  delete: async () => {},
  getIdToken: async () => "mock-id-token",
  getIdTokenResult: async () => ({
    token: "mock-id-token",
    authTime: "1620000000",
    issuedAtTime: "1620000000",
    expirationTime: "1620086400",
    signInProvider: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
}

// Auth context type
interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<User>
  signIn: (email: string, password: string) => Promise<User>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // For preview, set the mock user after a short delay
    const timer = setTimeout(() => {
      setUser(mockUser)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const signUp = async (email: string, password: string, displayName: string) => {
    // Mock sign up
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockUser
  }

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser(mockUser)
    return mockUser
  }

  const signOut = async () => {
    // Mock sign out
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser(null)
  }

  const resetPassword = async (email: string) => {
    // Mock password reset
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

