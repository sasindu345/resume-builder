import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/services/api'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ResumeCard } from '@/components/dashboard/ResumeCard'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { FileText, LayoutTemplate, Clock, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'

interface Resume {
    id: string
    title: string
    createdAt: string
    updatedAt: string
    template?: string
}

interface UserStats {
    totalResumes: number
    completedResumes: number
    templates: string[]
}

export function Dashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const [resumes, setResumes] = useState<Resume[]>([])
    const [filteredResumes, setFilteredResumes] = useState<Resume[]>([])
    const [stats, setStats] = useState<UserStats | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortOption, setSortOption] = useState<'recent' | 'updated' | 'alpha'>('recent')
    const [isLoading, setIsLoading] = useState(true)
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)
                const resumesRes = await api.get('/resume')
                const resumesData = resumesRes.data.data || resumesRes.data
                setResumes(Array.isArray(resumesData) ? resumesData : [])
                setFilteredResumes(Array.isArray(resumesData) ? resumesData : [])
                try {
                    const statsRes = await api.get('/user/stats')
                    setStats(statsRes.data.data || statsRes.data)
                } catch {
                    // Stats endpoint optional
                }
            } catch (error: any) {
                const msg = typeof error?.response?.data?.message === 'string'
                    ? error.response.data.message
                    : error?.message || 'Failed to load resumes'
                toast.error(msg)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const sortResumes = (list: Resume[]) => {
        const sorted = [...list]
        switch (sortOption) {
            case 'updated': return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            case 'alpha':   return sorted.sort((a, b) => a.title.localeCompare(b.title))
            default:        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
    }

    useEffect(() => {
        const filtered = resumes.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
        setFilteredResumes(sortResumes(filtered))
    }, [searchTerm, resumes, sortOption])

    const handleCreateResume = async () => {
        try {
            setIsCreating(true)
            const response = await api.post('/resume', { title: 'Untitled Resume' })
            const newResume = response.data.data || response.data
            setResumes([newResume, ...resumes])
            toast.success('Resume created!')
            navigate(`/resume/${newResume.id}`)
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to create resume')
        } finally {
            setIsCreating(false)
        }
    }

    const handleDeleteResume = async (id: string) => {
        if (!window.confirm('Delete this resume? This cannot be undone.')) return
        try {
            await api.delete(`/resume/${id}`)
            setResumes(resumes.filter(r => r.id !== id))
            toast.success('Resume deleted')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to delete')
        }
    }

    const handleRenameResume = async (id: string) => {
        const current = resumes.find(r => r.id === id)
        const newTitle = window.prompt('Enter a new title', current?.title || '')
        if (!newTitle?.trim()) return
        try {
            const payload = { title: newTitle.trim() }
            await api.put(`/resume/${id}`, payload)
            const updated = resumes.map(r => r.id === id ? { ...r, ...payload, updatedAt: new Date().toISOString() } : r)
            setResumes(updated)
            setFilteredResumes(sortResumes(updated.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))))
            toast.success('Resume renamed')
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error?.message || 'Failed to rename')
        }
    }

    // Derived stats
    const totalResumes = resumes.length
    const templatesUsed = [...new Set(resumes.map(r => r.template).filter(Boolean))].length
    const lastUpdated = resumes.length > 0
        ? new Date(Math.max(...resumes.map(r => new Date(r.updatedAt).getTime()))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—'

    const dashboardStats = [
        { label: 'Total Resumes', value: totalResumes, icon: FileText, color: '#2563eb', bg: '#dbeafe' },
        { label: 'Templates Used', value: templatesUsed || stats?.templates?.length || 0, icon: LayoutTemplate, color: '#7c3aed', bg: '#ede9fe' },
        { label: 'Last Updated', value: lastUpdated, icon: Clock, color: '#059669', bg: '#d1fae5' },
    ]

    const gridVariants = {
        hidden: { opacity: 1 },
        show: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
            {/* Header */}
            <header className="border-b" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2 group" aria-label="Home">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center group-hover:opacity-80 transition">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <line x1="7" y1="8" x2="17" y2="8" />
                                    <line x1="7" y1="12" x2="14" y2="12" />
                                    <line x1="7" y1="16" x2="11" y2="16" />
                                </svg>
                            </div>
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
                            <p className="text-sm" style={{ color: 'var(--muted)' }}>
                                Welcome back, <span className="font-semibold" style={{ color: 'var(--text)' }}>{user?.firstName}</span>!
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{ background: 'var(--bg)', color: 'var(--muted)', border: '1px solid var(--border)' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {dashboardStats.map(({ label, value, icon: Icon, color, bg }, idx) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="rounded-2xl p-5 border flex items-center gap-4"
                            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                                <Icon className="w-6 h-6" style={{ color }} />
                            </div>
                            <div>
                                <div className="text-2xl font-extrabold" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
                                    {value}
                                </div>
                                <div className="text-sm" style={{ color: 'var(--muted)' }}>{label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Search, Sort & Create */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <div className="flex-1 w-full sm:max-w-sm">
                        <Input
                            label=""
                            placeholder="Search resumes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                        />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value as 'recent' | 'updated' | 'alpha')}
                            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        >
                            <option value="recent">Newest First</option>
                            <option value="updated">Recently Updated</option>
                            <option value="alpha">A → Z</option>
                        </select>
                        <Button onClick={handleCreateResume} loading={isCreating} className="btn-gradient whitespace-nowrap">
                            <PlusIcon className="w-4 h-4 mr-1.5" />
                            New Resume
                        </Button>
                    </div>
                </div>

                {/* Resume Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-64 rounded-2xl skeleton" />
                        ))}
                    </div>
                ) : filteredResumes.length === 0 ? (
                    <EmptyState
                        title={searchTerm ? 'No resumes found' : 'No resumes yet'}
                        description={searchTerm ? 'Try a different search term' : 'Create your first resume to get started'}
                        action={
                            !searchTerm && (
                                <Button onClick={handleCreateResume} loading={isCreating}>
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Create Resume
                                </Button>
                            )
                        }
                    />
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={gridVariants}
                        initial="hidden"
                        animate="show"
                    >
                        {filteredResumes.map((resume) => (
                            <ResumeCard
                                key={resume.id}
                                resume={resume}
                                onDelete={handleDeleteResume}
                                onEdit={() => navigate(`/resume/${resume.id}`)}
                                onRename={handleRenameResume}
                            />
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    )
}
