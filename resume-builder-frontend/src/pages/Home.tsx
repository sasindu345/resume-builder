import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

/* ── Animated Stat Value Component ── */
function AnimatedStatValue({ value }: { value: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const numericStr = value.replace(/[^0-9]/g, '');
        const target = parseInt(numericStr, 10) || 0;
        if (target === 0) {
            setCount(0);
            return;
        }

        const duration = 2000; // 2 seconds
        const frameRate = 60;
        const totalFrames = Math.round((duration / 1000) * frameRate);
        let frame = 0;

        const timer = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const easeOutProgress = progress * (2 - progress); // Quadratic easeOut
            const currentVal = Math.round(easeOutProgress * target);

            setCount(currentVal);

            if (frame >= totalFrames) {
                setCount(target);
                clearInterval(timer);
            }
        }, 1000 / frameRate);

        return () => clearInterval(timer);
    }, [value]);

    const hasCommas = value.includes(',');
    const suffix = value.replace(/[0-9,]/g, '');

    const formattedCount = hasCommas 
        ? count.toLocaleString('en-US') 
        : count.toString();

    return (
        <span>{formattedCount}{suffix}</span>
    );
}

export function Home() {
    const [textIndex, setTextIndex] = useState(0);
    const cyclingTexts = ["Get You Hired", "Stand Out", "Land Interviews", "Win Offers"];

    useEffect(() => {
        const timer = setInterval(() => {
            setTextIndex((prev) => (prev + 1) % cyclingTexts.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

            {/* ──────────────────────────────────────
                HERO — MOBILE (app-like fullscreen)
            ────────────────────────────────────── */}
            <section className="sm:hidden relative overflow-hidden" style={{ minHeight: '100svh' }}>
                {/* Theme-aware background */}
                <div className="absolute inset-0 z-0 bg-white dark:bg-[#0b1220] transition-colors duration-300" />
                
                {/* Decorative circles */}
                <div className="absolute top-[-20%] right-[-30%] w-[70vw] h-[70vw] rounded-full opacity-5 dark:opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
                <div className="absolute bottom-[10%] left-[-20%] w-[50vw] h-[50vw] rounded-full opacity-5 dark:opacity-15 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />

                <div className="relative z-10 flex flex-col justify-between px-6 pt-20 pb-8" style={{ minHeight: '100svh' }}>
                    {/* Top content */}
                    <div className="flex-1 flex flex-col justify-center space-y-6">
                        {/* Small badge */}
                        <div className="animate-fade-in-up">
                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 text-blue-700 dark:text-blue-300">
                                Free &middot; AI-Powered
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="animate-fade-in-up-delay-1 space-y-3">
                            <h1 className="text-[2.5rem] font-extrabold leading-[1.08] tracking-tight text-slate-900 dark:text-white">
                                Build Resumes<br />
                                That{' '}
                                <span className="relative inline-block overflow-hidden h-[1.2em] min-w-[200px] align-bottom">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={textIndex}
                                            initial={{ y: 25, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: -25, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                            className="absolute left-0 text-blue-600 dark:text-blue-400"
                                            style={{ whiteSpace: 'nowrap' }}
                                        >
                                            {cyclingTexts[textIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                            </h1>
                            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 max-w-[300px]">
                                Create professional, ATS-friendly resumes in minutes with AI-powered feedback.
                            </p>
                        </div>

                        {/* CTA */}
                        <div className="animate-fade-in-up-delay-2 space-y-3 pt-2">
                            <Link
                                to="/builder"
                                className="group flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-[15px] text-white shadow-md bg-blue-600 hover:bg-blue-700 transition-all active:scale-[0.98]"
                            >
                                Create Resume Now
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/templates"
                                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-[15px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
                            >
                                <Palette className="w-4 h-4" />
                                View Templates
                            </Link>
                        </div>
                    </div>

                    {/* Bottom feature pills */}
                    <div className="animate-fade-in-up-delay-3 pt-6">
                        <div className="grid grid-cols-2 gap-2.5">
                            {[
                                { icon: Shield, label: 'No sign-up needed' },
                                { icon: Palette, label: '5 templates · 6 themes' },
                                { icon: Brain, label: 'AI CV Reviewer' },
                                { icon: Download, label: 'PDF export' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                                    <Icon className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ──────────────────────────────────────
                HERO — DESKTOP / TABLET
            ────────────────────────────────────── */}
            <section className="hidden sm:block relative overflow-hidden hero-section-desktop">
                {/* Glowing decorative shapes */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-5 dark:opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }} />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-3xl opacity-5 dark:opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }} />
                
                <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{
                    background: 'linear-gradient(to top, var(--bg), transparent)',
                }} />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-24">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
                        {/* Left Column — Text & CTAs */}
                        <div className="text-left space-y-8 flex flex-col justify-center">
                            {/* Badge */}
                            <div className="animate-fade-in-up inline-flex">
                                <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 text-blue-700 dark:text-blue-300">
                                    Free Professional Resume Builder — Powered by AI
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="animate-fade-in-up-delay-1 space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
                                    Build Resumes That<br />
                                    <span className="relative inline-block h-[1.25em] w-full overflow-hidden mt-1">
                                        <AnimatePresence mode="wait">
                                            <motion.span
                                                key={textIndex}
                                                initial={{ y: 35, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                exit={{ y: -35, opacity: 0 }}
                                                transition={{ duration: 0.35, ease: "easeOut" }}
                                                className="absolute left-0 text-blue-600 dark:text-blue-400"
                                            >
                                                {cyclingTexts[textIndex]}
                                            </motion.span>
                                        </AnimatePresence>
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-700 dark:text-slate-300 max-w-lg leading-relaxed pt-2">
                                    Create ATS-friendly, visually stunning resumes in minutes. AI-powered feedback included.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="animate-fade-in-up-delay-2 flex flex-wrap gap-4 items-center">
                                <Link
                                    to="/builder"
                                    className="group px-7 py-3.5 rounded-xl font-semibold text-base flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-blue-600/10 active:scale-[0.98] transition-all"
                                >
                                    Create Resume Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    to="/templates"
                                    className="px-7 py-3.5 rounded-xl font-semibold text-base flex items-center gap-2 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] transition-all"
                                >
                                    <Palette className="w-5 h-5" />
                                    View Templates
                                </Link>
                            </div>

                            {/* Feature Checklist */}
                            <div className="animate-fade-in-up-delay-3 grid grid-cols-2 gap-3 pt-6 border-t border-slate-100 dark:border-white/10 max-w-md">
                                {['No sign-up required', '5 templates · 6 themes', 'AI CV Reviewer', 'PDF export'].map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <span className="font-medium text-xs">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column — Animated Image Mockup */}
                        <motion.div 
                            className="relative flex justify-center lg:justify-end perspective-mockup-container"
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            {/* Orbiting Floating Badge 1 (ATS Score) */}
                            <motion.div 
                                className="hidden md:flex absolute top-12 -left-12 z-20 items-center gap-2.5 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-lg backdrop-blur-md"
                                animate={{ y: [0, -10, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 5,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">ATS Score</div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">98% Match</div>
                                </div>
                            </motion.div>

                            {/* Orbiting Floating Badge 2 (PDF Export) */}
                            <motion.div 
                                className="hidden md:flex absolute bottom-16 -right-8 z-20 items-center gap-2.5 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 shadow-lg backdrop-blur-md"
                                animate={{ y: [0, 10, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 4.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                    <Download className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">Export Quality</div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">PDF Standard</div>
                                </div>
                            </motion.div>

                            {/* Soft shadow background behind the image */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] rounded-2xl blur-3xl opacity-10 dark:opacity-35 pointer-events-none" 
                                style={{ background: 'radial-gradient(circle, #3b82f6, #7c3aed, transparent 75%)' }} />
                            
                            {/* Floating animated frame container */}
                            <motion.div 
                                animate={{ y: [0, -12, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 6,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-white/40 dark:bg-slate-900/40 p-2.5 backdrop-blur-sm perspective-mockup">
                                    <img 
                                        src="/image.png" 
                                        alt="Resume Mockup" 
                                        className="w-full max-w-[390px] rounded-xl object-cover shadow-inner"
                                        style={{ 
                                            aspectRatio: '3/4',
                                            maxHeight: '520px',
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
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
                                            background: 'color-mix(in srgb, var(--primary-600) 12%, transparent)',
                                            border: '1px solid color-mix(in srgb, var(--primary-600) 25%, transparent)',
                                        }}
                                    >
                                        <Icon className="w-5 h-5" style={{ color: 'var(--primary-600)' }} />
                                    </div>
                                </div>
                                <div className="text-3xl font-extrabold" style={{ color: 'var(--text)', letterSpacing: '-0.03em' }}>
                                    <AnimatedStatValue value={value} />
                                </div>
                                {/* Horizontal Animated Progress Bar */}
                                <div className="relative w-16 h-1 bg-slate-100 dark:bg-slate-800/80 rounded-full mx-auto my-2 overflow-hidden">
                                    <motion.div 
                                        className="absolute left-0 top-0 bottom-0 bg-blue-600 dark:bg-blue-400 rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ 
                                            width: value.includes('%') 
                                                ? `${parseInt(value.replace(/[^0-9]/g, ''), 10)}%` 
                                                : "100%" 
                                        }}
                                        transition={{ duration: 1.8, ease: "easeOut", delay: 0.1 }}
                                    />
                                </div>
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
                <div 
                    className="max-w-4xl mx-auto rounded-3xl overflow-hidden border shadow-xl relative" 
                    style={{ 
                        background: 'var(--surface)', 
                        borderColor: 'var(--border)' 
                    }}
                >
                    {/* Decorative subtle background glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'var(--primary-600)' }} />
                    <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: 'var(--accent)' }} />

                    <div className="relative z-10 px-8 py-16 text-center space-y-6">
                        <div 
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border"
                            style={{ 
                                background: 'color-mix(in srgb, var(--primary-600) 10%, transparent)',
                                borderColor: 'color-mix(in srgb, var(--primary-600) 20%, transparent)',
                                color: 'var(--primary-600)'
                            }}
                        >
                            <Sparkles className="w-4 h-4" />
                            Free Forever
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold" style={{ color: 'var(--text)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                            Ready to Land Your<br />Dream Job?
                        </h2>
                        <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
                            Join thousands of job seekers who have already built their winning resume.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Link
                                to="/builder"
                                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-lg hover:opacity-95 transition-all shadow-lg active:scale-[0.98] btn-gradient"
                            >
                                Start Building — It's Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/templates"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-[0.98]"
                                style={{ 
                                    borderColor: 'var(--border)', 
                                    color: 'var(--text)', 
                                    background: 'var(--surface)' 
                                }}
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
