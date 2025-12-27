/**
 * Auth Context - Provides global authentication state and methods
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { setToken, getToken, removeToken, setUser, getUser, removeUser } from '@/utils/tokenStorage'
import { loginUser, registerUser } from '@/services/authService'

/**
 * User interface
 */
export interface User {
    id?: string
    firstName?: string
    lastName?: string
    email: string
    phone?: string
    isPremium?: boolean
    createdAt?: string
}

/**
 * Auth Context type
 */
interface AuthContextType {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
    login: (email: string, password: string) => Promise<void>
    register: (firstName: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>
    logout: () => void
    clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    /**
     * Initialize auth state on mount
     */
    useEffect(() => {
        const token = getToken()
        const savedUser = getUser()

        if (token && savedUser && typeof savedUser === 'object') {
            const userData: User = {
                email: (savedUser as any).email || '',
                firstName: (savedUser as any).firstName,
                lastName: (savedUser as any).lastName,
                id: (savedUser as any).id,
                isPremium: (savedUser as any).isPremium,
            }
            setUserState(userData)
        }

        setIsLoading(false)
    }, [])

    /**
     * Login user
     */
    const login = async (email: string, password: string) => {
        try {
            setError(null)
            setIsLoading(true)

            const response = await loginUser({ email, password })

            // Save token and user data
            // AuthResponse structure: { token, tokenType, user: { email, firstName, lastName, ... } }
            setToken(response.token)
            const userData: User = {
                email: response.user?.email || email,
                firstName: response.user?.firstName,
                lastName: response.user?.lastName,
                id: response.user?.id,
                isPremium: response.user?.isPremium,
            }
            setUser(userData)
            setUserState(userData)
        } catch (err: any) {
            const message = typeof err?.response?.data?.message === 'string'
                ? err.response.data.message
                : typeof err?.message === 'string'
                    ? err.message
                    : 'Login failed'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Register new user
     */
    const register = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
        phone?: string
    ) => {
        try {
            setError(null)
            setIsLoading(true)

            await registerUser({ firstName, lastName, email, password, phone })

            // Registration succeeds but user must verify email before logging in
            // Do NOT auto-login - just return success
        } catch (err: any) {
            const message = typeof err?.response?.data?.message === 'string'
                ? err.response.data.message
                : typeof err?.message === 'string'
                    ? err.message
                    : 'Registration failed'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    /**
     * Logout user
     * Clear token, user data, and state
     */
    const logout = () => {
        removeToken()
        removeUser()
        setUserState(null)
        setError(null)
    }

    /**
     * Clear error message
     */
    const clearError = () => {
        setError(null)
    }

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use auth context
 * Must be called inside AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
