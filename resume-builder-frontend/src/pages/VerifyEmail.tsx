/**
 * Email Verification Page
 * Handles email verification when user clicks link from email
 * Shows success/error message and redirects to login
 */

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '@/services/authService'
import { Button } from '@/components/common/Button'
import { FloatingShapes } from '@/components/animations/FloatingShapes'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export const VerifyEmail = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const token = searchParams.get('token')

        if (!token) {
            setStatus('error')
            setMessage('Invalid verification link. Please check your email for the correct link.')
            return
        }

        // Verify the email token
        const verify = async () => {
            try {
                const response = await verifyEmail(token)
                setStatus('success')
                setMessage(response || 'Email verified successfully! You can now login.')

                // Auto-redirect to login after 3 seconds
                setTimeout(() => navigate('/login'), 3000)
            } catch (error: any) {
                setStatus('error')
                setMessage(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Verification failed. The link may have expired or is invalid.'
                )
            }
        }

        verify()
    }, [searchParams, navigate])

    return (
        <div className="min-h-screen relative flex items-center justify-center px-6 py-12">
            <FloatingShapes />

            <div className="w-full max-w-md">
                <div className="rounded-2xl shadow-xl p-8 text-center" style={{ background: 'var(--surface)' }}>
                    {/* Logo/Header */}
                    <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 inline-block mb-8">
                        Resume Builder
                    </Link>

                    {/* Loading State */}
                    {status === 'loading' && (
                        <div>
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Verifying your email...
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Please wait while we verify your email address.
                            </p>
                        </div>
                    )}

                    {/* Success State */}
                    {status === 'success' && (
                        <div>
                            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Email Verified!
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                {message}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 mb-6">
                                Redirecting you to login in 3 seconds...
                            </p>
                            <Button onClick={() => navigate('/login')} variant="primary" fullWidth>
                                Go to Login
                            </Button>
                        </div>
                    )}

                    {/* Error State */}
                    {status === 'error' && (
                        <div>
                            <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                Verification Failed
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">
                                {message}
                            </p>
                            <div className="space-y-3">
                                <Button onClick={() => navigate('/login')} variant="primary" fullWidth>
                                    Go to Login
                                </Button>
                                <Button onClick={() => navigate('/register')} variant="outline" fullWidth>
                                    Create New Account
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Footer Link */}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Link
                            to="/"
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
