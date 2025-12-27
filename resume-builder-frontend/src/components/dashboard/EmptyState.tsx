import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { ReactNode } from 'react'

interface EmptyStateProps {
    title: string
    description: string
    action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <DocumentPlusIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">{title}</h3>
            <p className="text-gray-600 text-center max-w-sm mt-2">{description}</p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    )
}
