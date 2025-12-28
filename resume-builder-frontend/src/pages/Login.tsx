/**
 * Login Page - User authentication with email and password
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { FloatingShapes } from '@/components/animations/FloatingShapes'
import toast from 'react-hot-toast'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    /**
     * Handle form submission
     */
    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true)
            await login(data.email, data.password)
            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'Login failed. Please check your credentials.'
            toast.error(errorMessage, { duration: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            <FloatingShapes />

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                        Resume Builder
                    </Link>
                    <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--text)', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Welcome back</h1>
                    <p className="mt-2" style={{ color: 'var(--muted)' }}>
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                            Create one
                        </Link>
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="backdrop-blur rounded-2xl p-8 border shadow-xl" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    {/* Email Field */}
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        icon={<EnvelopeIcon className="h-5 w-5" />}
                        {...register('email')}
                        error={errors.email?.message}
                        required
                    />

                    {/* Password Field */}
                    <div className="mt-5">
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            icon={<LockClosedIcon className="h-5 w-5" />}
                            {...register('password')}
                            error={errors.password?.message}
                            required
                        />
                    </div>

                    {/* Forgot Password Link */}
                    <div className="mt-3 text-sm">
                        <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={isLoading}
                        fullWidth
                        className="mt-6"
                    >
                        Sign in
                    </Button>

                    {/* Removed visual divider */}

                    {/* Removed demo credentials for production-readiness */}
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                        Terms of Service
                    </a>
                </p>
            </div>
        </div>
    )
}
