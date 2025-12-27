/**
 * Token Storage Utilities
 * Handles JWT token persistence in localStorage
 * Helps maintain authentication state across page reloads
 */

const TOKEN_KEY = 'resume_builder_token'
const USER_KEY = 'resume_builder_user'

/**
 * Save JWT token to localStorage
 * @param token - JWT token from backend
 */
export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Retrieve JWT token from localStorage
 * @returns JWT token or null if not found
 */
export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
}

/**
 * Remove JWT token from localStorage (on logout)
 */
export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY)
}

/**
 * Save user data to localStorage
 * @param user - User object from backend
 */
export const setUser = (user: Record<string, any>): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/**
 * Retrieve user data from localStorage
 * @returns User object or null if not found
 */
export const getUser = (): Record<string, any> | null => {
    const user = localStorage.getItem(USER_KEY)
    return user ? JSON.parse(user) : null
}

/**
 * Remove user data from localStorage (on logout)
 */
export const removeUser = (): void => {
    localStorage.removeItem(USER_KEY)
}

/**
 * Clear all auth data (token + user) - typically on logout
 */
export const clearAuth = (): void => {
    removeToken()
    removeUser()
}

/**
 * Check if user is authenticated
 * @returns true if token exists, false otherwise
 */
export const isAuthenticated = (): boolean => {
    return getToken() !== null
}
