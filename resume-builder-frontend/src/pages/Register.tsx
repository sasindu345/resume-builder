/**
 * Register Page - Compact, professional centered authentication card (No cover image, no gradients)
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
    User,
    Phone,
    FileText 
} from 'lucide-react'

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
    confirmPassword: z.string(),
    phone: z.string().optional(),
    terms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export const Register = () => {
    const navigate = useNavigate()
    const { register: registerUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema)
    })

    const onSubmit = async (data: RegisterFormData) => {
        try {
            setIsLoading(true)
            await registerUser(data.firstName, data.lastName, data.email, data.password, data.phone)
            toast.success('Registration successful! Please check your email to verify your account.', {
                duration: 6000,
            })
            setTimeout(() => navigate('/login'), 2000)
        } catch (error: unknown) {
            const message = getApiErrorMessage(error, 'Registration failed. Please try again.')
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-[#0b1220] transition-colors duration-300">
            {/* Centered Professional Register Card */}
            <div className="w-full max-w-[460px] bg-white dark:bg-[#0f172a] rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-800/60 p-8 sm:p-10 relative">
                
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
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Create Account
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 leading-relaxed">
                        Join us and begin creating professional resumes.
                    </p>
                </div>

                {/* Register Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-2 gap-3.5">
                        <div>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    className={`w-full pl-11 pr-4 py-2.5 rounded-full border bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-xs ${
                                        errors.firstName 
                                            ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500/20 focus:border-red-500' 
                                            : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                                    }`}
                                    {...register('firstName')}
                                    required
                                />
                            </div>
                            {errors.firstName && (
                                <p className="text-[11px] text-red-505 mt-1 pl-4 font-semibold">
                                    {errors.firstName.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    className={`w-full pl-11 pr-4 py-2.5 rounded-full border bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-xs ${
                                        errors.lastName 
                                            ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500/20 focus:border-red-500' 
                                            : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                                    }`}
                                    {...register('lastName')}
                                    required
                                />
                            </div>
                            {errors.lastName && (
                                <p className="text-[11px] text-red-505 mt-1 pl-4 font-semibold">
                                    {errors.lastName.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email */}
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
                            <p className="text-[11px] text-red-550 mt-1 pl-4 font-semibold">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
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
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                        {errors.password ? (
                            <p className="text-[11px] text-red-505 mt-1 pl-4 font-semibold">
                                {errors.password.message}
                            </p>
                        ) : (
                            <p className="text-[9px] text-slate-400 pl-4 mt-0.5 leading-tight">
                                Must be 8+ chars: 1 uppercase, 1 lowercase, 1 number.
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                className={`w-full pl-11 pr-11 py-2.5 rounded-full border bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-xs ${
                                    errors.confirmPassword 
                                        ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500/20 focus:border-red-500' 
                                        : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                                }`}
                                {...register('confirmPassword')}
                                required
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-650 dark:hover:text-slate-300 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-[11px] text-red-505 mt-1 pl-4 font-semibold">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Phone (Optional) */}
                    <div>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
                            <input
                                type="tel"
                                placeholder="Phone number (optional)"
                                className={`w-full pl-11 pr-5 py-2.5 rounded-full border bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-xs ${
                                    errors.phone 
                                        ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500/20 focus:border-red-500' 
                                        : 'border-slate-200 dark:border-slate-800 focus:ring-blue-500/20 focus:border-blue-500'
                                }`}
                                {...register('phone')}
                            />
                        </div>
                        {errors.phone && (
                            <p className="text-[11px] text-red-505 mt-1 pl-4 font-semibold">
                                {errors.phone.message}
                            </p>
                        )}
                    </div>

                    {/* Terms & Conditions checkbox */}
                    <div className="pt-0.5">
                        <div className="flex items-start gap-2 pl-2">
                            <input
                                type="checkbox"
                                id="terms"
                                {...register('terms')}
                                className="mt-0.5 h-3.5 w-3.5 rounded border border-slate-350 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-[10px] text-slate-500 dark:text-slate-450 cursor-pointer select-none leading-tight">
                                I agree to the{' '}
                                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">
                                    Privacy Policy
                                </a>.
                            </label>
                        </div>
                        {errors.terms && (
                            <p className="text-[11px] text-red-505 mt-1 pl-4 font-semibold">
                                {errors.terms.message}
                            </p>
                        )}
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
                            <span>Create Account</span>
                        )}
                    </button>

                    {/* Route Switcher & Back to Home */}
                    <div className="text-center pt-4 space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link 
                                to="/login" 
                                className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Sign In
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
