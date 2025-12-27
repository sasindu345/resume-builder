import axios from 'axios'
import { getToken, removeToken, removeUser } from '@/utils/tokenStorage'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
})

api.interceptors.request.use(
    (config) => {
        const publicEndpoints = ['/auth/register', '/auth/login', '/auth/verify-email', '/auth/forgot-password']

        const isPublicEndpoint = publicEndpoints.some(endpoint => {
            const url = config.url || ''
            return url.includes(endpoint)
        })

        if (!isPublicEndpoint) {
            const token = getToken()
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            removeToken()
            removeUser()
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api
