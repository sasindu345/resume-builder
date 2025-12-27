import { Link } from 'react-router-dom'
import { FileText, Zap, Palette, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react'

export function Home() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center space-y-8">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>Free Professional Resume Builder</span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
                            Professional Resume
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                                Builder
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text)' }}>
                            Create ATS-friendly resumes that land interviews
                        </p>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
                            Build professional resumes with live preview and export to PDF instantly. Choose from multiple templates and themes.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link
                            to="/register"
                            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
                        >
                            Get started free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 rounded-xl font-semibold text-lg border-2 hover:shadow-md transition-all duration-200"
                            style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }}
                        >
                            Sign in
                        </Link>
                    </div>

                    {/* Feature Checklist */}
                    <div className="flex flex-wrap justify-center gap-6 pt-8">
                        <div className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-medium">5 professional templates</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-medium">6 color themes</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: 'var(--text)' }}>
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <span className="font-medium">Auto-save & PDF export</span>
                        </div>
                    </div>
                </div>

                {/* Preview & Features Section */}
                <div className="mt-24 space-y-16">
                    {/* Preview Card */}
                    <div className="max-w-4xl mx-auto">
                        <div className="rounded-2xl shadow-2xl overflow-hidden border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                        <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                                    </div>
                                    <span className="text-white font-medium ml-4">Live Preview</span>
                                </div>
                            </div>
                            <div className="p-8 sm:p-12" style={{ background: 'var(--bg)' }}>
                                <div className="text-center space-y-4">
                                    <FileText className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto" />
                                    <h3 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Real-time Resume Editor</h3>
                                    <p className="max-w-md mx-auto" style={{ color: 'var(--muted)' }}>
                                        Split-screen editor with instant preview
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Card 1 */}
                        <div className="rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>Lightning Fast</h3>
                            <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
                                Real-time preview as you type with instant PDF export
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl flex items-center justify-center mb-6">
                                <Palette className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>30 Design Options</h3>
                            <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
                                Mix and match 5 templates with 6 color themes
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3" style={{ color: 'var(--text)' }}>ATS-Optimized</h3>
                            <p className="leading-relaxed" style={{ color: 'var(--muted)' }}>
                                Clean format that works with applicant tracking systems
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
