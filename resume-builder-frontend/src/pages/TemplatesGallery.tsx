import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const templates = [
    {
        id: 'modern',
        name: 'Modern',
        description: 'Bold header with profile image, skill bars, and left-accent experience entries. Perfect for tech and creative roles.',
        badge: 'Most Popular',
        badgeColor: '#2563eb',
        primaryColor: '#2563eb',
        headerBg: '#2563eb',
        tags: ['Profile Photo', 'Skill Bars', 'ATS Friendly'],
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Clean, corporate layout with clear section dividers. Ideal for finance, law, and management roles.',
        badge: 'Classic Choice',
        badgeColor: '#059669',
        primaryColor: '#059669',
        headerBg: '#047857',
        tags: ['Conservative', 'Clean', 'Corporate'],
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Two-column layout with a vibrant sidebar. Stand out in design, marketing, and media industries.',
        badge: 'Eye-Catching',
        badgeColor: '#7c3aed',
        primaryColor: '#7c3aed',
        headerBg: '#6d28d9',
        tags: ['Two-Column', 'Sidebar', 'Colorful'],
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional single-column format with elegant typography. Timeless and universally accepted.',
        badge: 'Timeless',
        badgeColor: '#b45309',
        primaryColor: '#b45309',
        headerBg: '#92400e',
        tags: ['Traditional', 'Simple', 'Universal'],
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Ultra-clean design with generous whitespace. Lets your content speak for itself.',
        badge: 'Clean & Simple',
        badgeColor: '#475569',
        primaryColor: '#475569',
        headerBg: '#334155',
        tags: ['Minimal', 'Whitespace', 'Modern'],
    },
];

function TemplateMockup({ template }: { template: typeof templates[0] }) {
    return (
        <div
            className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
            style={{ background: '#fff', border: '1px solid #e5e7eb' }}
        >
            {/* Header bar */}
            <div className="h-16 flex items-center gap-3 px-4" style={{ background: template.headerBg }}>
                {/* Fake avatar */}
                {template.id === 'modern' && (
                    <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        JD
                    </div>
                )}
                <div className="flex-1 space-y-1.5">
                    <div className="h-2.5 rounded-full bg-white/70 w-3/4" />
                    <div className="h-1.5 rounded-full bg-white/40 w-1/2" />
                </div>
            </div>

            {/* Body content */}
            <div className="p-4 space-y-3">
                {/* Summary block */}
                <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-20" style={{ background: template.primaryColor, opacity: 0.7 }} />
                    <div className="h-1.5 rounded-full bg-gray-200 w-full" />
                    <div className="h-1.5 rounded-full bg-gray-200 w-5/6" />
                    <div className="h-1.5 rounded-full bg-gray-200 w-4/5" />
                </div>
                {/* Experience block */}
                <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-24" style={{ background: template.primaryColor, opacity: 0.7 }} />
                    {[0.9, 0.7, 0.8, 0.6].map((w, i) => (
                        <div key={i} className="h-1.5 rounded-full bg-gray-200" style={{ width: `${w * 100}%` }} />
                    ))}
                </div>
                {/* Skills block */}
                <div className="space-y-1.5">
                    <div className="h-1.5 rounded-full w-16" style={{ background: template.primaryColor, opacity: 0.7 }} />
                    <div className="flex gap-1.5 flex-wrap">
                        {[60, 80, 70, 90, 50].map((w, i) => (
                            <div key={i} className="h-4 rounded-full" style={{ width: `${w}%`, background: `${template.primaryColor}20`, border: `1px solid ${template.primaryColor}40` }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TemplatesGallery() {
    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
            {/* Hero */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center space-y-4">
                <div className="inline-flex justify-center">
                    <span className="section-badge">
                        <Sparkles className="w-3.5 h-3.5" />
                        5 Professional Templates
                    </span>
                </div>
                <h1 className="section-title">Choose Your Template</h1>
                <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
                    Each template is fully customizable with 6 color themes. Pick one and start building.
                </p>
            </section>

            {/* Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((template, idx) => (
                        <div
                            key={template.id}
                            className="rounded-2xl border overflow-hidden card-hover animate-fade-in-up"
                            style={{
                                background: 'var(--surface)',
                                borderColor: 'var(--border)',
                                animationDelay: `${idx * 0.08}s`,
                            }}
                        >
                            {/* Preview */}
                            <div className="p-5 pb-3" style={{ background: 'var(--bg)' }}>
                                <TemplateMockup template={template} />
                            </div>

                            {/* Info */}
                            <div className="p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{template.name}</h2>
                                    <span
                                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                                        style={{ background: `${template.badgeColor}15`, color: template.badgeColor }}
                                    >
                                        {template.badge}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                                    {template.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {template.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-xs font-medium px-2.5 py-1 rounded-full border"
                                            style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <Link
                                    to={`/builder?template=${template.id}`}
                                    className="group w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm btn-gradient mt-1"
                                >
                                    Use This Template
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
