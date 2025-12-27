import { clsx } from 'clsx'

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={clsx(
                'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg animate-pulse',
                className
            )}
            style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
            }}
        />
    )
}
