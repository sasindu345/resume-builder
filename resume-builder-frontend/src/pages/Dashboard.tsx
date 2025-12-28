import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import api from '@/services/api'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { ResumeCard } from '@/components/dashboard/ResumeCard'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/dashboard/EmptyState'
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
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

    // Fetch user's resumes and stats
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                // Fetch resumes
                const resumesRes = await api.get('/resume')
                const resumesData = resumesRes.data.data || resumesRes.data
                setResumes(Array.isArray(resumesData) ? resumesData : [])
                setFilteredResumes(Array.isArray(resumesData) ? resumesData : [])

                // Fetch stats
                try {
                    const statsRes = await api.get('/user/stats')
                    setStats(statsRes.data.data || statsRes.data)
                } catch {
                    // Stats endpoint optional
                }
            } catch (error: any) {
                const errorMsg = typeof error?.response?.data?.message === 'string'
                    ? error.response.data.message
                    : typeof error?.message === 'string'
                        ? error.message
                        : 'Failed to load resumes'
                toast.error(errorMsg)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Sorting helper
    const sortResumes = (list: Resume[]) => {
        const sorted = [...list]
        switch (sortOption) {
            case 'updated':
                return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            case 'alpha':
                return sorted.sort((a, b) => a.title.localeCompare(b.title))
            default:
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        }
    }

    // Filter + sort resumes
    useEffect(() => {
        const filtered = resumes.filter(resume =>
            resume.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredResumes(sortResumes(filtered))
    }, [searchTerm, resumes, sortOption])

    // Handle create new resume
    const handleCreateResume = async () => {
        try {
            setIsCreating(true)
            const response = await api.post('/resume', {
                title: 'Untitled Resume',
            })
            const newResume = response.data.data || response.data
            setResumes([newResume, ...resumes])
            toast.success('Resume created!')
            navigate(`/resume/${newResume.id}`)
        } catch (error: any) {
            const errorMsg = typeof error?.response?.data?.message === 'string'
                ? error.response.data.message
                : typeof error?.message === 'string'
                    ? error.message
                    : 'Failed to create resume'
            toast.error(errorMsg)
        } finally {
            setIsCreating(false)
        }
    }

    // Handle delete resume
    const handleDeleteResume = async (id: string) => {
        if (!window.confirm('Are you sure? This cannot be undone.')) return

        try {
            await api.delete(`/resume/${id}`)
            setResumes(resumes.filter(r => r.id !== id))
            toast.success('Resume deleted')
        } catch (error: any) {
            const errorMsg = typeof error?.response?.data?.message === 'string'
                ? error.response.data.message
                : typeof error?.message === 'string'
                    ? error.message
                    : 'Failed to delete resume'
            toast.error(errorMsg)
        }
    }

    // Handle rename resume
    const handleRenameResume = async (id: string) => {
        const current = resumes.find(r => r.id === id)
        const newTitle = window.prompt('Enter a new title', current?.title || '')
        if (!newTitle || newTitle.trim() === '') return

        try {
            const payload = { title: newTitle.trim() }
            await api.put(`/resume/${id}`, payload)
            const updated = resumes.map(r => (r.id === id ? { ...r, title: payload.title, updatedAt: new Date().toISOString() } : r))
            setResumes(updated)
            setFilteredResumes(sortResumes(updated.filter(resume =>
                resume.title.toLowerCase().includes(searchTerm.toLowerCase())
            )))
            toast.success('Resume renamed')
        } catch (error: any) {
            const errorMsg = typeof error?.response?.data?.message === 'string'
                ? error.response.data.message
                : typeof error?.message === 'string'
                    ? error.message
                    : 'Failed to rename resume'
            toast.error(errorMsg)
        }
    }

    // Animation variants for staggered cards
    const gridVariants = {
        hidden: { opacity: 1 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.05,
            },
        },
    }

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
            {/* Header */}
            <header className="border-b sticky top-0 z-40" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Dashboard</h1>
                        <p className="mt-1" style={{ color: 'var(--muted)' }}>Welcome back, {user?.firstName}!</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm rounded-lg transition"
                        style={{ background: 'var(--bg)', color: 'var(--text)' }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Stat cards removed as requested */}
                    </div>
                )}

                {/* Search & Create Section */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                        <div className="flex-1">
                            <Input
                                label="Search resumes"
                                placeholder="Search by title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                            />
                        </div>
                        <div className="flex gap-3 items-center">
                            <div className="text-sm" style={{ color: 'var(--muted)' }}>Sort by</div>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value as 'recent' | 'updated' | 'alpha')}
                                className="border rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}
                            >
                                <option value="recent">Newest</option>
                                <option value="updated">Recently Updated</option>
                                <option value="alpha">A → Z</option>
                            </select>
                        </div>
                        <Button
                            onClick={handleCreateResume}
                            loading={isCreating}
                            className="sm:mt-0"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            New Resume
                        </Button>
                    </div>
                </div>

                {/* Resumes Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-64" />
                        ))}
                    </div>
                ) : filteredResumes.length === 0 ? (
                    <EmptyState
                        title={searchTerm ? 'No resumes found' : 'No resumes yet'}
                        description={
                            searchTerm
                                ? 'Try a different search term'
                                : 'Create your first resume to get started'
                        }
                        action={
                            !searchTerm && (
                                <Button
                                    onClick={handleCreateResume}
                                    loading={isCreating}
                                >
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
