/**
 * Common Input Component
 * Reusable form input with label, error, and icon support
 */

import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'
import clsx from 'clsx'
import styles from '../../styles/components/Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: ReactNode
    hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, hint, className = '', ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label className="text-sm font-semibold text-slate-700">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">{icon}</div>}
                    <input
                        ref={ref}
                        className={clsx(
                            // base layout & spacing
                            'w-full px-4 py-2.5 text-base border-2 rounded-lg transition-all duration-150',
                            // focus styles
                            'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30',
                            // background/placeholder only — text color now comes from the CSS module so it follows theme variables
                            'bg-white dark:bg-white/10 placeholder-slate-400 dark:placeholder-slate-600',
                            // ensure theme-driven text color and textarea sizing come from CSS module
                            styles.inputField,
                            icon && styles.inputWithIcon,
                            error && 'border-red-300 focus:border-red-500 focus:ring-red-200',
                            !error && 'border-slate-300 dark:border-slate-600',
                            className
                        )}
                        {...props}
                    />
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                {hint && !error && <p className="text-sm text-slate-500">{hint}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'
