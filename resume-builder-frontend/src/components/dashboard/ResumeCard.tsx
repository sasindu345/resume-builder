import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { FileText } from 'lucide-react'

const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

const templateColors: Record<string, { from: string; to: string; accent: string }> = {
    modern:       { from: '#dbeafe', to: '#ede9fe', accent: '#2563eb' },
    professional: { from: '#d1fae5', to: '#d1fae5', accent: '#059669' },
    creative:     { from: '#fce7f3', to: '#ede9fe', accent: '#7c3aed' },
    classic:      { from: '#fef9c3', to: '#fef3c7', accent: '#b45309' },
    minimal:      { from: '#f1f5f9', to: '#e2e8f0', accent: '#475569' },
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
    const tKey = resume.template?.toLowerCase() as keyof typeof templateColors | undefined
    const colors = (tKey && templateColors[tKey]) || templateColors.modern

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border overflow-hidden shadow-sm group"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
            {/* Thumbnail */}
            <div
                className="h-36 relative overflow-hidden flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
            >
                {/* Decorative lines */}
                <div className="absolute inset-0 opacity-30">
                    {[20, 36, 52, 68, 84].map((top) => (
                        <div
                            key={top}
                            className="absolute left-8 right-8 h-px rounded-full"
                            style={{ top: `${top}%`, background: colors.accent }}
                        />
                    ))}
                </div>
                <div className="relative flex flex-col items-center gap-2">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                        style={{ background: colors.accent }}
                    >
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <span
                        className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/50"
                        style={{ color: colors.accent }}
                    >
                        {resume.template || 'Resume'}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold truncate text-base" style={{ color: 'var(--text)' }}>{resume.title}</h3>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                    Updated {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                </p>
            </div>

            {/* Actions */}
            <div
                className="px-4 py-3 border-t flex gap-2"
                style={{ background: 'var(--bg)', borderTop: '1px solid var(--border)' }}
            >
                <button
                    onClick={onEdit}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all"
                    style={{ background: `${colors.accent}15`, color: colors.accent }}
                    onMouseEnter={e => (e.currentTarget.style.background = `${colors.accent}25`)}
                    onMouseLeave={e => (e.currentTarget.style.background = `${colors.accent}15`)}
                >
                    <PencilIcon className="w-3.5 h-3.5" />
                    Edit
                </button>
                <button
                    onClick={() => onRename(resume.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all"
                    style={{ background: 'var(--border)', color: 'var(--muted)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                    Rename
                </button>
                <button
                    onClick={() => onDelete(resume.id)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                    <TrashIcon className="w-3.5 h-3.5" />
                </button>
            </div>
        </motion.div>
    )
}
