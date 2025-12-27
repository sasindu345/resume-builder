/**
 * Register Page - User registration with validation
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
import { UserIcon, EnvelopeIcon, LockClosedIcon, PhoneIcon } from '@heroicons/react/24/outline'

const registerSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    phone: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
})

type RegisterFormData = z.infer<typeof registerSchema>

export const Register = () => {
    const navigate = useNavigate()
    const { register: registerUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    /**
     * Handle form submission
     */
    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true)
            // Only send fields expected by backend (terms is frontend-only validation)
            await registerUser(data.firstName, data.lastName, data.email, data.password, data.phone)
            toast.success('Registration successful! Please check your email to verify your account before logging in.', {
                duration: 6000,
            })
            // Don't navigate - user must verify email first
            // Redirect to login page after showing success message
            setTimeout(() => navigate('/login'), 2000)
        } catch (error: any) {
            toast.error(error?.message || 'Registration failed. Please try again.')
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
                    <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--text)', textShadow: '0 1px 2px rgba(33, 8, 107, 0.1)' }}>Create your account</h1>
                    <p className="mt-2" style={{ color: 'var(--muted)' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="backdrop-blur rounded-2xl p-8 border shadow-xl space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    {/* First Name */}
                    <Input
                        label="First name"
                        type="text"
                        placeholder="John"
                        icon={<UserIcon className="h-5 w-5" />}
                        {...register('firstName')}
                        error={errors.firstName?.message}
                        required
                    />

                    {/* Last Name */}
                    <Input
                        label="Last name"
                        type="text"
                        placeholder="Doe"
                        icon={<UserIcon className="h-5 w-5" />}
                        {...register('lastName')}
                        error={errors.lastName?.message}
                        required
                    />

                    {/* Email */}
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        icon={<EnvelopeIcon className="h-5 w-5" />}
                        {...register('email')}
                        error={errors.email?.message}
                        required
                    />

                    {/* Password */}
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<LockClosedIcon className="h-5 w-5" />}
                        hint="At least 8 characters, 1 uppercase, 1 lowercase, 1 number"
                        {...register('password')}
                        error={errors.password?.message}
                        required
                    />

                    {/* Phone (Optional) */}
                    <Input
                        label="Phone (optional)"
                        type="tel"
                        placeholder="+1-234-567-8900"
                        icon={<PhoneIcon className="h-5 w-5" />}
                        {...register('phone')}
                        error={errors.phone?.message}
                    />

                    {/* Terms & Conditions Checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            {...register('terms')}
                            className="mt-1 h-5 w-5 rounded border-2 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
                        />
                        <label htmlFor="terms" className="text-sm" style={{ color: 'var(--muted)' }}>
                            I agree to the{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    {errors.terms && <p className="text-sm text-red-600 font-medium">{errors.terms.message}</p>}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        loading={isLoading}
                        fullWidth
                        className="mt-6"
                    >
                        Create account
                    </Button>
                </form>

                {/* Footer */}
                <p className="mt-6 text-center text-sm" style={{ color: 'var(--muted)' }}>
                    We'll send you a confirmation email to verify your account.
                </p>
            </div>
        </div>
    )
}
