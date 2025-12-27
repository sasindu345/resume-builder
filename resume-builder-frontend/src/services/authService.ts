import api from './api'

export const registerUser = async (data: {
    firstName: string
    lastName: string
    email: string
    password: string
    phone?: string
}) => {
    const payload: Record<string, string> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
    }

    if (data.phone && data.phone.trim() !== '') {
        payload.phone = data.phone.trim()
    }

    const response = await api.post('/auth/register', payload)
    return response.data
}

export const loginUser = async (data: { email: string; password: string }) => {
    const payload = {
        email: data.email,
        password: data.password,
    }
    const response = await api.post('/auth/login', payload)
    return response.data
}

export const verifyEmail = async (token: string): Promise<string> => {
    const response = await api.get(`/auth/verify-email?token=${token}`)
    return response.data
}

export const forgotPassword = async (email: string): Promise<string> => {
    const response = await api.post(`/auth/forgot-password?email=${email}`)
    return response.data
}

export const resetPassword = async (token: string, newPassword: string): Promise<string> => {
    const response = await api.post(
        `/auth/reset-password?token=${token}&newPassword=${newPassword}`
    )
    return response.data
}

export const healthCheck = async (): Promise<string> => {
    const response = await api.get('/auth/health')
    return response.data
}
