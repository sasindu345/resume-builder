/**
 * Common Input Component
 * Reusable form input with label, error, icon, and password toggle support
 */

import { InputHTMLAttributes, ReactNode, forwardRef, useState } from 'react'
import clsx from 'clsx'
import styles from '../../styles/components/Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: ReactNode
    hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, hint, type, className = '', ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)
        const isPassword = type === 'password'
        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">{icon}</div>}
                    <input
                        ref={ref}
                        type={inputType}
                        className={clsx(
                            'w-full px-4 py-2.5 text-base border-2 rounded-lg transition-all duration-150',
                            'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30',
                            'placeholder-slate-400 dark:placeholder-slate-600',
                            styles.inputField,
                            icon && styles.inputWithIcon,
                            isPassword && 'pr-11',
                            error && 'border-red-300 focus:border-red-500 focus:ring-red-200',
                            !error && 'border-slate-300 dark:border-slate-600',
                            className
                        )}
                        style={{ background: 'var(--surface)' }}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            tabIndex={-1}
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
                            style={{ color: 'var(--muted)' }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? (
                                /* EyeSlash icon */
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                                    <line x1="1" y1="1" x2="23" y2="23" />
                                </svg>
                            ) : (
                                /* Eye icon */
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            )}
                        </button>
                    )}
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                {hint && !error && <p className="text-sm" style={{ color: 'var(--muted)' }}>{hint}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'
