import { Link } from 'react-router-dom'
import { FileText, Zap, Palette, CheckCircle2, ArrowRight, Sparkles, Brain, Image, Download, Eye, Edit3, Shield, Star, Users, TrendingUp, Quote } from 'lucide-react'

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
    {
        quote: "Switched from an expensive resume service to this. The quality is just as good, and I can update it anytime.",
        name: 'James L.',
        role: 'UX Designer',
        initials: 'JL',
        color: '#d97706',
    },
    {
        quote: "The real-time preview saved me so much time. I could see exactly how my resume would look as I typed.",
        name: 'Emily C.',
        role: 'Marketing Manager',
        initials: 'EC',
        color: '#e11d48',
    },
    {
        quote: "I love how easy it is to switch between templates. Found the perfect design for my industry in minutes.",
        name: 'David W.',
        role: 'Financial Analyst',
        initials: 'DW',
        color: '#0d9488',
    },
]

const features = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        desc: 'Real-time preview with instant PDF export',
        lightBg: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
        darkBg: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(79,70,229,0.15))',
        color: '#2563eb',
    },
    {
        icon: Palette,
        title: '30 Design Options',
        desc: '5 professional templates × 6 color themes',
        lightBg: 'linear-gradient(135deg, #ede9fe, #fce7f3)',
        darkBg: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.15))',
        color: '#7c3aed',
    },
    {
        icon: Brain,
        title: 'AI CV Reviewer',
        desc: 'Domain-specific feedback, ATS tips & scoring',
        lightBg: 'linear-gradient(135deg, #fef3c7, #ffedd5)',
        darkBg: 'linear-gradient(135deg, rgba(217,119,6,0.15), rgba(234,88,12,0.15))',
        color: '#d97706',
    },
    {
        icon: Image,
        title: 'Profile Photo',
        desc: 'Upload your photo via Cloudinary integration',
        lightBg: 'linear-gradient(135deg, #d1fae5, #ecfdf5)',
        darkBg: 'linear-gradient(135deg, rgba(5,150,105,0.15), rgba(16,185,129,0.15))',
        color: '#059669',
    },
    {
        icon: Shield,
        title: 'ATS Optimized',
        desc: 'Passes applicant tracking systems with ease',
        lightBg: 'linear-gradient(135deg, #ffe4e6, #fecdd3)',
        darkBg: 'linear-gradient(135deg, rgba(225,29,72,0.15), rgba(239,68,68,0.15))',
        color: '#e11d48',
    },
    {
        icon: TrendingUp,
        title: 'Track Progress',
        desc: 'Manage multiple resumes from your dashboard',
        lightBg: 'linear-gradient(135deg, #ccfbf1, #cffafe)',
        darkBg: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(6,182,212,0.15))',
        color: '#0d9488',
    },
]

/* ── Testimonial Card ── */
function TestimonialCard({ quote, name, role, initials, color }: typeof testimonials[0]) {
    return (
        <div
            className="testimonial-card flex-shrink-0 w-[280px] sm:w-[340px] rounded-2xl p-5 sm:p-6 border flex flex-col gap-3 sm:gap-4"
            style={{
                background: 'var(--surface)',
                borderColor: 'var(--border)',
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                </div>
                <Quote className="w-5 h-5" style={{ color: 'var(--border)' }} />
            </div>
            <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text)' }}>
                &ldquo;{quote}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }}
                >
                    {initials}
                </div>
                <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{name}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{role}</div>
                </div>
            </div>
        </div>
    );
}

/* ── Marquee Row ── */
function MarqueeRow({ items, direction }: { items: typeof testimonials; direction: 'left' | 'right' }) {
    // Duplicate the items for seamless infinite loop
    const doubled = [...items, ...items];
    return (
        <div className="overflow-hidden marquee-mask">
            <div className={`marquee-row ${direction === 'left' ? 'marquee-left' : 'marquee-right'}`}>
                {doubled.map((t, i) => (
                    <TestimonialCard key={`${t.name}-${i}`} {...t} />
                ))}
            </div>
        </div>
    );
}

/* ── Testimonials Section ── */
function TestimonialsCarousel() {
    const row1 = testimonials.slice(0, 3);
    const row2 = testimonials.slice(3);

    return (
        <section
            className="py-24 relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, var(--bg) 0%, var(--surface) 50%, var(--bg) 100%)',
            }}
        >
            {/* Subtle decorative blobs — theme-aware */}
            <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: 'var(--primary-600)', filter: 'blur(80px)' }} />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full opacity-[0.04]" style={{ background: 'var(--primary-600)', filter: 'blur(80px)' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            </div>

            <div className="marquee-container space-y-6">
                <MarqueeRow items={row1} direction="left" />
                <MarqueeRow items={row2} direction="right" />
            </div>
        </section>
    )
}

export function Home() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

            {/* ──────────────────────────────────────
                HERO SECTION
            ────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Background Image + Overlays */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/CVs-Resumes-How-to-Secure-a-Law-Interview.jpg.webp"
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ filter: 'blur(6px) brightness(0.25)' }}
                    />
                    {/* Subtle color tint — low opacity for dark theme compatibility */}
                    <div className="absolute inset-0" style={{
                        background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(79,70,229,0.12) 50%, rgba(124,58,237,0.10) 100%)',
                    }} />
                    {/* Bottom fade to page bg — smooth theme transition */}
                    <div className="absolute bottom-0 left-0 right-0 h-48" style={{
                        background: 'linear-gradient(to top, var(--bg), transparent)',
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-24">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium max-w-full"
                            style={{
                                background: 'rgba(255,255,255,0.12)',
                                backdropFilter: 'blur(16px)',
                                WebkitBackdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                color: '#fff',
                            }}
                        >
                            <Sparkles className="w-4 h-4 shrink-0" />
                            <span className="text-left leading-tight">Free Professional Resume Builder — Powered by AI</span>
                        </div>

                        {/* Heading */}
                        <div className="animate-fade-in-up-delay-1 space-y-4">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white" style={{ letterSpacing: '-0.03em', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                                Build Resumes That
                                <span className="block" style={{
                                    background: 'linear-gradient(135deg, #93c5fd, #a78bfa, #f9a8d4)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>Get You Hired</span>
                            </h1>
                            <p className="text-xl sm:text-2xl max-w-3xl mx-auto leading-relaxed text-white/80">
                                Create ATS-friendly, visually stunning resumes in minutes. AI-powered feedback included.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link
                                to="/builder"
                                className="group px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 text-white shadow-2xl transition-all hover:scale-105 hover:shadow-blue-500/30"
                                style={{
                                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                                    boxShadow: '0 8px 32px rgba(37,99,235,0.4)',
                                }}
                            >
                                Create Resume Now
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/templates"
                                className="px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-2 text-white transition-all hover:scale-105"
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    backdropFilter: 'blur(16px)',
                                    WebkitBackdropFilter: 'blur(16px)',
                                    border: '1px solid rgba(255,255,255,0.25)',
                                }}
                            >
                                <Palette className="w-5 h-5" />
                                View Templates
                            </Link>
                        </div>

                        {/* Feature Checklist */}
                        <div className="animate-fade-in-up-delay-3 flex flex-wrap justify-center gap-6 pt-4">
                            {['No sign-up required', '5 templates · 6 themes', 'AI CV Reviewer', 'PDF export'].map((item) => (
                                <div key={item} className="flex items-center gap-2 text-white/70">
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                    <span className="font-medium text-sm">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Glass Preview Card */}
                    <div className="animate-fade-in-up-delay-4 max-w-4xl mx-auto mt-20">
                        <div className="rounded-2xl overflow-hidden shadow-2xl"
                            style={{
                                background: 'rgba(255,255,255,0.08)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                            }}
                        >
                            <div className="px-6 py-3 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="flex gap-1.5">
                                    {['#ef4444', '#eab308', '#22c55e'].map((bg, i) => (
                                        <div key={i} className="w-3 h-3 rounded-full" style={{ background: bg, opacity: 0.7 }} />
                                    ))}
                                </div>
                                <span className="text-white/60 font-medium text-sm ml-2">Live Resume Preview</span>
                            </div>
                            <div className="p-10">
                                <div className="text-center space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mx-auto shadow-lg">
                                        <FileText className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Real-time Resume Editor</h3>
                                    <p className="text-white/60">Split-screen editor with instant live preview</p>
                                    <Link to="/builder" className="inline-flex items-center gap-1 text-sm text-blue-300 font-medium hover:text-blue-200 mt-2">
                                        Try it now <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
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
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                                            border: '1px solid rgba(37,99,235,0.15)',
                                        }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: '#2563eb' }} />
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
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                                style={{
                                    background: `linear-gradient(135deg, ${color}15, ${color}25)`,
                                    border: `2px solid ${color}35`,
                                    boxShadow: `0 8px 24px ${color}20`,
                                }}
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
                        {features.map(({ icon: Icon, title, desc, lightBg, darkBg, color }) => (
                            <div
                                key={title}
                                className="rounded-2xl p-6 border card-hover"
                                style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
                            >
                                <div
                                    className="feature-icon-box w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ '--light-bg': lightBg, '--dark-bg': darkBg } as React.CSSProperties}
                                >
                                    <Icon className="w-6 h-6" style={{ color }} />
                                </div>
                                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text)' }}>{title}</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <TestimonialsCarousel />

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
