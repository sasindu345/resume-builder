/**
 * Login Page - Compact, professional centered authentication card (No cover image, no gradients)
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import { getApiErrorMessage } from '@/utils/apiError'
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    FileText 
} from 'lucide-react'

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsLoading(true)
            await login(data.email, data.password)
            toast.success('Welcome back!')
            navigate('/dashboard')
        } catch (error: unknown) {
            const errorMessage = getApiErrorMessage(
                error,
                'Login failed. Please check your credentials.'
            )
            toast.error(errorMessage, { duration: 5000 })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0b1220] transition-colors duration-300">
            {/* Centered Professional Login Card (Resized to fit content perfectly) */}
            <div className="w-full max-w-[420px] bg-white dark:bg-[#0f172a] rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-800/60 p-8 sm:p-10 relative">
                
                {/* Logo Section */}
                <div className="flex justify-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-2 font-black text-xl text-slate-900 dark:text-white">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                            <FileText className="w-4.5 h-4.5" />
                        </div>
                        <span className="tracking-tight text-lg">ResumeBuilder</span>
                    </Link>
                </div>

                {/* Heading */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Sign In
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                        Please login to access your dashboard and saved resumes.
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email field */}
                    <div>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            <input
                                type="email"
                                placeholder="Email address"
                                className={`w-full pl-11 pr-5 py-2.5 rounded-full border bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-xs ${
                                    errors.email 
                                        ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500/20 focus:border-red-500' 
                                        : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                                }`}
                                {...register('email')}
                                required
                            />
                        </div>
                        {errors.email && (
                            <p className="text-[11px] text-red-505 mt-1.5 pl-4 font-semibold">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password field */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                className={`w-full pl-11 pr-11 py-2.5 rounded-full border bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-xs ${
                                    errors.password 
                                        ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500/20 focus:border-red-500' 
                                        : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                                }`}
                                {...register('password')}
                                required
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-[11px] text-red-505 mt-1.5 pl-4 font-semibold">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="flex justify-end text-xs pt-1">
                        <Link 
                            to="/forgot-password" 
                            className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Submit Button (Solid Blue - No gradient, no arrow) */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-2.5 px-6 rounded-full font-bold text-white shadow-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[14px]"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>

                    {/* Route Switcher & Back to Home */}
                    <div className="text-center pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link 
                                to="/register" 
                                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </div>
                        <div>
                            <Link 
                                to="/" 
                                className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 transition-colors inline-block pt-1"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}
