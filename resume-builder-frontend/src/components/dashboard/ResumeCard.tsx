import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
}

interface ResumeCardProps {
    resume: {
        id: string
        title: string
        createdAt: string
        updatedAt: string
        template?: string
    }
    onEdit: () => void
    onDelete: (id: string) => void
    onRename: (id: string) => void
}

export function ResumeCard({ resume, onEdit, onDelete, onRename }: ResumeCardProps) {
    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -4 }}
            className="rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
            {/* Thumbnail */}
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{resume.title[0]?.toUpperCase()}</p>
                        <p className="text-xs text-blue-500 mt-1">Resume</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                </p>
                {resume.template && (
                    <div className="mt-3">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {resume.template}
                        </span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-4 py-3 border-t flex gap-2" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                <button
                    onClick={onEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition"
                >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={() => onRename(resume.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-amber-700 bg-amber-50 rounded hover:bg-amber-100 transition"
                >
                    Rename
                </button>
                <button
                    onClick={() => onDelete(resume.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                >
                    <TrashIcon className="w-4 h-4" />
                    Delete
                </button>
            </div>
        </motion.div>
    )
}
