import { Link } from 'react-router-dom'
import { FileText, Zap, Palette, CheckCircle2, ArrowRight, Sparkles, Brain, Image, Download, Eye, Edit3, Shield, Star, Users, TrendingUp } from 'lucide-react'

const stats = [
    { label: 'Resumes Created', value: '2,400+', icon: FileText },
    { label: 'Templates Available', value: '5', icon: Palette },
    { label: 'Satisfaction Rate', value: '98%', icon: Star },
    { label: 'Always Free', value: '100%', icon: Shield },
]

const steps = [
    {
        step: '01',
        title: 'Fill in Your Details',
        description: 'Add your work experience, education, and skills through our guided step-by-step editor.',
        icon: Edit3,
        color: '#2563eb',
    },
    {
        step: '02',
        title: 'Preview in Real-Time',
        description: 'Watch your professional resume take shape instantly with live preview as you type.',
        icon: Eye,
        color: '#7c3aed',
    },
    {
        step: '03',
        title: 'Download & Apply',
        description: 'Export a pixel-perfect PDF and start applying to your dream job today.',
        icon: Download,
        color: '#059669',
    },
]

const testimonials = [
    {
        quote: "I got 3 interviews within a week of using this tool. The AI review caught issues I would never have noticed myself.",
        name: 'Sarah K.',
        role: 'Software Engineer',
        initials: 'SK',
        color: '#2563eb',
    },
    {
        quote: "The templates look incredibly professional. I went from zero callbacks to multiple offers in under a month.",
        name: 'Marcus T.',
        role: 'Product Manager',
        initials: 'MT',
        color: '#7c3aed',
    },
    {
        quote: "The ATS optimization tips from the AI reviewer made all the difference. Simple, fast, and actually free.",
        name: 'Priya R.',
        role: 'Data Analyst',
        initials: 'PR',
        color: '#059669',
    },
]

const features = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        desc: 'Real-time preview with instant PDF export',
        gradient: 'from-blue-100 to-indigo-100',
        darkGradient: 'dark:from-blue-900/30 dark:to-indigo-900/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: Palette,
        title: '30 Design Options',
        desc: '5 professional templates × 6 color themes',
        gradient: 'from-purple-100 to-pink-100',
        darkGradient: 'dark:from-purple-900/30 dark:to-pink-900/30',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
        icon: Brain,
        title: 'AI CV Reviewer',
        desc: 'Domain-specific feedback, ATS tips & scoring',
        gradient: 'from-amber-100 to-orange-100',
        darkGradient: 'dark:from-amber-900/30 dark:to-orange-900/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
        icon: Image,
        title: 'Profile Photo',
        desc: 'Upload your photo via Cloudinary integration',
        gradient: 'from-green-100 to-emerald-100',
        darkGradient: 'dark:from-green-900/30 dark:to-emerald-900/30',
        iconColor: 'text-green-600 dark:text-green-400',
    },
    {
        icon: Shield,
        title: 'ATS Optimized',
        desc: 'Passes applicant tracking systems with ease',
        gradient: 'from-rose-100 to-red-100',
        darkGradient: 'dark:from-rose-900/30 dark:to-red-900/30',
        iconColor: 'text-rose-600 dark:text-rose-400',
    },
    {
        icon: TrendingUp,
        title: 'Track Progress',
        desc: 'Manage multiple resumes from your dashboard',
        gradient: 'from-teal-100 to-cyan-100',
        darkGradient: 'dark:from-teal-900/30 dark:to-cyan-900/30',
        iconColor: 'text-teal-600 dark:text-teal-400',
    },
]

export function Home() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

            {/* ──────────────────────────────────────
                HERO SECTION
            ────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <div className="text-center space-y-8">
                    {/* Badge */}
                    <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium section-badge">
                        <Sparkles className="w-4 h-4" />
                        <span>Free Professional Resume Builder — Powered by AI</span>
                    </div>

                    {/* Heading */}
                    <div className="animate-fade-in-up-delay-1 space-y-4">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                            Build Resumes That
                            <span className="block gradient-text">Get You Hired</span>
                        </h1>
                        <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--muted)' }}>
                            Create ATS-friendly, visually stunning resumes in minutes. AI-powered feedback included.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Link
                            to="/builder"
                            className="group btn-gradient px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2"
                        >
                            Create Resume Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/templates"
                            className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 hover:shadow-md transition-all duration-200 flex items-center gap-2"
                            style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'var(--border)' }}
                        >
                            <Palette className="w-5 h-5" />
                            View Templates
                        </Link>
                    </div>

                    {/* Feature Checklist */}
                    <div className="animate-fade-in-up-delay-3 flex flex-wrap justify-center gap-6 pt-4">
                        {['No sign-up required', '5 templates · 6 themes', 'AI CV Reviewer', 'PDF export'].map((item) => (
                            <div key={item} className="flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                <span className="font-medium text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mock preview card */}
                <div className="animate-fade-in-up-delay-4 max-w-4xl mx-auto mt-20">
                    <div className="rounded-2xl shadow-2xl overflow-hidden border card-hover" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 flex items-center gap-2">
                            <div className="flex gap-1.5">
                                {['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)'].map((bg, i) => (
                                    <div key={i} className="w-3 h-3 rounded-full" style={{ background: bg }} />
                                ))}
                            </div>
                            <span className="text-white/80 font-medium text-sm ml-2">Live Resume Preview</span>
                        </div>
                        <div className="p-10" style={{ background: 'var(--bg)' }}>
                            <div className="text-center space-y-3">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg">
                                    <FileText className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>Real-time Resume Editor</h3>
                                <p style={{ color: 'var(--muted)' }}>Split-screen editor with instant live preview</p>
                                <Link to="/builder" className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium hover:underline mt-2">
                                    Try it now <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────
                STATS BANNER
            ────────────────────────────────────── */}
            <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map(({ label, value, icon: Icon }) => (
                            <div key={label} className="text-center space-y-1">
                                <div className="flex justify-center mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="text-3xl font-extrabold" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>{value}</div>
                                <div className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────
                HOW IT WORKS
            ────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-14 space-y-3">
                    <div className="inline-flex justify-center">
                        <span className="section-badge">
                            <Users className="w-3.5 h-3.5" />
                            Simple Process
                        </span>
                    </div>
                    <h2 className="section-title">How It Works</h2>
                    <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
                        Three simple steps to your perfect resume
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6 relative">
                    {/* connector line */}
                    <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 opacity-40" />
                    {steps.map(({ step, title, description, icon: Icon, color }, idx) => (
                        <div
                            key={step}
                            className="relative rounded-2xl p-8 border card-hover text-center"
                            style={{ background: 'var(--surface)', borderColor: 'var(--border)', animationDelay: `${idx * 0.1}s` }}
                        >
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                                style={{ background: `${color}18`, border: `2px solid ${color}30` }}
                            >
                                <Icon className="w-8 h-8" style={{ color }} />
                            </div>
                            <span
                                className="absolute top-6 right-6 text-xs font-bold tracking-widest"
                                style={{ color, opacity: 0.5 }}
                            >
                                {step}
                            </span>
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text)' }}>{title}</h3>
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────────────────────────────
                FEATURES GRID
            ────────────────────────────────────── */}
            <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center mb-14 space-y-3">
                        <div className="inline-flex justify-center">
                            <span className="section-badge">
                                <Zap className="w-3.5 h-3.5" />
                                Everything You Need
                            </span>
                        </div>
                        <h2 className="section-title">Packed with Features</h2>
                        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
                            Professional tools usually locked behind a paywall — all free here.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map(({ icon: Icon, title, desc, gradient, darkGradient, iconColor }) => (
                            <div
                                key={title}
                                className="rounded-2xl p-6 border card-hover"
                                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-br ${gradient} ${darkGradient} rounded-xl flex items-center justify-center mb-4`}>
                                    <Icon className={`w-6 h-6 ${iconColor}`} />
                                </div>
                                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────
                TESTIMONIALS
            ────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-14 space-y-3">
                    <div className="inline-flex justify-center">
                        <span className="section-badge">
                            <Star className="w-3.5 h-3.5" />
                            Success Stories
                        </span>
                    </div>
                    <h2 className="section-title">People Are Getting Hired</h2>
                    <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
                        Join thousands of professionals who landed their next role
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map(({ quote, name, role, initials, color }) => (
                        <div
                            key={name}
                            className="rounded-2xl p-6 border card-hover flex flex-col gap-4"
                            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
                        >
                            {/* Stars */}
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--muted)' }}>
                                &ldquo;{quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                                >
                                    {initials}
                                </div>
                                <div>
                                    <div className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{name}</div>
                                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──────────────────────────────────────
                BOTTOM CTA
            ────────────────────────────────────── */}
            <section className="px-4 sm:px-6 lg:px-8 pb-24">
                <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e40af 0%, #4f46e5 50%, #7c3aed 100%)' }}>
                    <div className="px-8 py-16 text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-white/20 text-white/90">
                            <Sparkles className="w-4 h-4" />
                            Free Forever
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                            Ready to Land Your<br />Dream Job?
                        </h2>
                        <p className="text-lg text-white/75 max-w-xl mx-auto">
                            Join thousands of job seekers who have already built their winning resume.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Link
                                to="/builder"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
                            >
                                Start Building — It's Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/templates"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/10 transition-all"
                            >
                                <Palette className="w-5 h-5" />
                                Browse Templates
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
