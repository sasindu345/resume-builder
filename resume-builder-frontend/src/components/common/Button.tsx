/**
 * Common Button Component
 * Reusable button with multiple variants and states
 * Supports loading, disabled, and different sizes
 */

import { ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps {
    children: ReactNode
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    className?: string
    onClick?: () => void
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    type = 'button',
    className = '',
    onClick,
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-150'

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl',
        secondary: 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    }

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                (disabled || loading) && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            {loading && <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />}
            {children}
        </button>
    )
}
