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
        accentColor: '#4f46e5',
        tags: ['Profile Photo', 'Skill Bars', 'ATS Friendly'],
    },
    {
        id: 'professional',
        name: 'Professional',
        description: 'Clean, corporate layout with clear section dividers. Ideal for finance, law, and management roles.',
        badge: 'Classic Choice',
        badgeColor: '#059669',
        primaryColor: '#059669',
        accentColor: '#047857',
        tags: ['Two-Column', 'Clean', 'Corporate'],
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Two-column layout with a vibrant sidebar. Stand out in design, marketing, and media industries.',
        badge: 'Eye-Catching',
        badgeColor: '#7c3aed',
        primaryColor: '#7c3aed',
        accentColor: '#6d28d9',
        tags: ['Sidebar', 'Gradient', 'Colorful'],
    },
    {
        id: 'classic',
        name: 'Classic',
        description: 'Traditional single-column format with elegant typography. Timeless and universally accepted.',
        badge: 'Timeless',
        badgeColor: '#b45309',
        primaryColor: '#b45309',
        accentColor: '#92400e',
        tags: ['Traditional', 'Serif', 'Universal'],
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Ultra-clean design with generous whitespace. Lets your content speak for itself.',
        badge: 'Clean & Simple',
        badgeColor: '#475569',
        primaryColor: '#475569',
        accentColor: '#334155',
        tags: ['Minimal', 'Whitespace', 'Modern'],
    },
];

/* ── Rich demo data shown on every card ── */
const demo = {
    name: 'Alexandra Chen',
    initials: 'AC',
    title: 'Senior Product Designer',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexchen',
    github: 'github.com/alexchen',
    portfolio: 'alexchen.design',
    summary: 'Creative product designer with 6+ years of experience in UX/UI design, design systems, and user research. Led cross-functional teams to ship products used by millions.',
    experience: [
        {
            role: 'Senior Product Designer',
            company: 'TechVision Inc.',
            period: '2021 – Present',
            responsibilities: ['Led redesign of core product dashboard', 'Managed team of 4 designers'],
            technologies: ['Figma', 'React', 'Storybook'],
        },
        {
            role: 'UX Designer',
            company: 'DesignLab Studio',
            period: '2018 – 2021',
            responsibilities: ['Created design system with 120+ components', 'Improved conversion by 35%'],
            technologies: ['Sketch', 'InVision'],
        },
    ],
    education: { degree: 'B.A. Graphic Design', institution: 'Stanford University', year: '2014 – 2018' },
    skills: ['Figma', 'React', 'Design Systems', 'User Research', 'Prototyping', 'Wireframing'],
    projects: [
        { name: 'DesignKit Pro', tech: 'React, TypeScript, Tailwind' },
        { name: 'UX Analytics Dashboard', tech: 'Vue.js, D3' },
    ],
    certifications: ['Google UX Design Professional', 'AWS Cloud Practitioner'],
    languages: [
        { lang: 'English', level: 'Native' },
        { lang: 'Mandarin', level: 'Fluent' },
        { lang: 'Spanish', level: 'Intermediate' },
    ],
};

/* ──────── MODERN MOCKUP ──────── */
function ModernMockup({ color, accent }: { color: string; accent: string }) {
    return (
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
            <div className="px-4 py-3 flex items-center gap-3" style={{ background: `linear-gradient(135deg, ${color}, ${accent})` }}>
                <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {demo.initials}
                </div>
                <div className="min-w-0">
                    <div className="text-white font-bold text-sm truncate">{demo.name}</div>
                    <div className="text-white/70 text-[10px] truncate">{demo.title}</div>
                </div>
            </div>
            <div className="px-4 py-2.5 space-y-2">
                {/* Contact row */}
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[6px] text-gray-400">
                    <span>{demo.email}</span><span>·</span><span>{demo.phone}</span><span>·</span><span>{demo.location}</span>
                </div>
                <div className="flex flex-wrap gap-x-2 text-[6px] text-gray-400">
                    <span>{demo.linkedin}</span><span>·</span><span>{demo.github}</span>
                </div>

                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Summary`}</div>
                    <div className="text-[7px] text-gray-500 leading-[1.4]">{demo.summary}</div>
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Experience`}</div>
                    {demo.experience.map((exp) => (
                        <div key={exp.role} className="mb-1.5 pl-2" style={{ borderLeft: `2px solid ${color}` }}>
                            <div className="text-[8px] font-semibold text-gray-800">{exp.role}</div>
                            <div className="text-[7px] text-gray-500">{exp.company} · {exp.period}</div>
                            <div className="mt-0.5 space-y-0.5">
                                {exp.responsibilities.map((r, i) => (
                                    <div key={i} className="text-[6px] text-gray-400 flex gap-1">
                                        <span className="flex-shrink-0">•</span><span>{r}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-0.5 mt-0.5">
                                {exp.technologies.map(t => (
                                    <span key={t} className="text-[5px] px-1 py-[1px] rounded" style={{ background: `${color}10`, color }}>{t}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Projects`}</div>
                    {demo.projects.map(p => (
                        <div key={p.name} className="mb-1">
                            <div className="text-[7px] font-semibold text-gray-700">{p.name}</div>
                            <div className="text-[6px] text-gray-400">{p.tech}</div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Skills`}</div>
                    <div className="flex flex-wrap gap-1">
                        {demo.skills.map((s) => (
                            <span key={s} className="text-[6px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: `${color}12`, color, border: `1px solid ${color}30` }}>{s}</span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5" style={{ color }}>{`Certifications`}</div>
                        {demo.certifications.map(c => (
                            <div key={c} className="text-[6px] text-gray-500">✦ {c}</div>
                        ))}
                    </div>
                    <div className="flex-1">
                        <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5" style={{ color }}>{`Languages`}</div>
                        {demo.languages.map(l => (
                            <div key={l.lang} className="text-[6px] text-gray-500">{l.lang} ({l.level})</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────── PROFESSIONAL MOCKUP ──────── */
function ProfessionalMockup({ color }: { color: string }) {
    return (
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-white flex" style={{ border: '1px solid #e5e7eb' }}>
            {/* Sidebar */}
            <div className="w-[35%] p-3 space-y-2.5 flex-shrink-0" style={{ background: `${color}08` }}>
                <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xs" style={{ background: `${color}20`, color, border: `2px solid ${color}40` }}>
                    {demo.initials}
                </div>
                <div>
                    <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Contact`}</div>
                    <div className="text-[6px] text-gray-500 space-y-1">
                        <div className="truncate">{demo.email}</div>
                        <div className="truncate">{demo.phone}</div>
                        <div className="truncate">{demo.location}</div>
                        <div className="flex items-center gap-0.5 min-w-0">
                            <svg className="w-2 h-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                            <span className="truncate">{demo.linkedin}</span>
                        </div>
                        <div className="flex items-center gap-0.5 min-w-0">
                            <svg className="w-2 h-2 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                            </svg>
                            <span className="truncate">{demo.github}</span>
                        </div>
                        <div className="flex items-center gap-0.5 min-w-0">
                            <svg className="w-2 h-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            <span className="truncate">{demo.portfolio}</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Skills`}</div>
                    <div className="space-y-1">
                        {demo.skills.slice(0, 5).map((s) => (
                            <div key={s}>
                                <div className="text-[6px] text-gray-600 mb-0.5">{s}</div>
                                <div className="h-1 rounded-full bg-gray-200">
                                    <div className="h-full rounded-full" style={{ background: color, width: `${65 + Math.random() * 30}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Languages`}</div>
                    {demo.languages.map(l => (
                        <div key={l.lang} className="text-[6px] text-gray-500">{l.lang} — {l.level}</div>
                    ))}
                </div>
                <div>
                    <div className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Certs`}</div>
                    {demo.certifications.map(c => (
                        <div key={c} className="text-[5px] text-gray-500 mb-0.5">✦ {c}</div>
                    ))}
                </div>
            </div>
            {/* Main */}
            <div className="flex-1 p-3 space-y-2 overflow-hidden">
                <div>
                    <div className="text-sm font-bold text-gray-800">{demo.name}</div>
                    <div className="text-[8px] text-gray-500">{demo.title}</div>
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Summary`}</div>
                    <div className="text-[6px] text-gray-500 leading-[1.4]">{demo.summary}</div>
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Experience`}</div>
                    {demo.experience.map((exp) => (
                        <div key={exp.role} className="mb-1.5">
                            <div className="text-[8px] font-semibold text-gray-800">{exp.role}</div>
                            <div className="text-[6px] text-gray-500">{exp.company} · {exp.period}</div>
                            {exp.responsibilities.map((r, i) => (
                                <div key={i} className="text-[5px] text-gray-400 flex gap-0.5"><span>•</span><span>{r}</span></div>
                            ))}
                        </div>
                    ))}
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Projects`}</div>
                    {demo.projects.map(p => (
                        <div key={p.name} className="mb-1">
                            <div className="text-[7px] font-semibold text-gray-700">{p.name}</div>
                            <div className="text-[5px] text-gray-400">{p.tech}</div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color }}>{`Education`}</div>
                    <div className="text-[7px] font-medium text-gray-700">{demo.education.degree}</div>
                    <div className="text-[6px] text-gray-500">{demo.education.institution} · {demo.education.year}</div>
                </div>
            </div>
        </div>
    );
}

/* ──────── CREATIVE MOCKUP ──────── */
function CreativeMockup({ color, accent }: { color: string; accent: string }) {
    return (
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
            <div className="relative px-4 py-3 flex items-center gap-3">
                <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: color }} />
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${accent})` }}>
                    {demo.initials}
                </div>
                <div className="min-w-0">
                    <div className="font-bold text-sm" style={{ background: `linear-gradient(135deg, ${color}, ${accent})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{demo.name}</div>
                    <div className="text-[8px] text-gray-500">{demo.title}</div>
                    <div className="text-[6px] text-gray-400 flex items-center gap-1 mt-0.5">
                        <span>{demo.email}</span><span>·</span><span>{demo.linkedin}</span>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-3 space-y-2">
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color }}>
                        <span className="w-3 h-0.5 rounded-full" style={{ background: color }} />{`Summary`}
                    </div>
                    <div className="text-[7px] text-gray-500 leading-[1.4]">{demo.summary}</div>
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color }}>
                        <span className="w-3 h-0.5 rounded-full" style={{ background: color }} />{`Experience`}
                    </div>
                    {demo.experience.map((exp) => (
                        <div key={exp.role} className="mb-1.5 flex gap-2">
                            <div className="flex flex-col items-center pt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                                <div className="w-px flex-1" style={{ background: `${color}30` }} />
                            </div>
                            <div>
                                <div className="text-[8px] font-semibold text-gray-800">{exp.role}</div>
                                <div className="text-[7px] text-gray-500">{exp.company}</div>
                                <div className="text-[6px] text-gray-400">{exp.period}</div>
                                {exp.responsibilities.slice(0, 1).map((r, i) => (
                                    <div key={i} className="text-[5px] text-gray-400 mt-0.5">• {r}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <div className="text-[9px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color }}>
                        <span className="w-3 h-0.5 rounded-full" style={{ background: color }} />{`Skills`}
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {demo.skills.map((s) => (
                            <span key={s} className="text-[6px] px-1.5 py-0.5 rounded-md font-medium text-white" style={{ background: `linear-gradient(135deg, ${color}, ${accent})` }}>{s}</span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1" style={{ color }}>
                            <span className="w-2 h-0.5 rounded-full" style={{ background: color }} />{`Projects`}
                        </div>
                        {demo.projects.map(p => (
                            <div key={p.name} className="text-[6px] text-gray-500 mb-0.5">▸ {p.name}</div>
                        ))}
                    </div>
                    <div className="flex-1">
                        <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1" style={{ color }}>
                            <span className="w-2 h-0.5 rounded-full" style={{ background: color }} />{`Languages`}
                        </div>
                        {demo.languages.map(l => (
                            <div key={l.lang} className="text-[6px] text-gray-500">{l.lang} ({l.level})</div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="text-[8px] font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1" style={{ color }}>
                        <span className="w-2 h-0.5 rounded-full" style={{ background: color }} />{`Certifications`}
                    </div>
                    {demo.certifications.map(c => (
                        <div key={c} className="text-[5px] text-gray-500">✦ {c}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ──────── CLASSIC MOCKUP ──────── */
function ClassicMockup({ color }: { color: string }) {
    return (
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
            <div className="p-4 text-center pb-2.5" style={{ borderBottom: `2px solid ${color}30` }}>
                <div className="w-10 h-10 rounded-full mx-auto mb-1.5 flex items-center justify-center font-bold text-sm" style={{ background: `${color}10`, color, border: `2px solid ${color}30` }}>
                    {demo.initials}
                </div>
                <div className="text-sm font-serif font-bold" style={{ color, fontFamily: 'Georgia, serif' }}>{demo.name}</div>
                <div className="text-[8px] text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>{demo.title}</div>
                <div className="text-[6px] text-gray-400 mt-0.5">{demo.email} · {demo.phone} · {demo.location}</div>
                <div className="text-[6px] text-gray-400">{demo.linkedin} · {demo.github}</div>
            </div>
            <div className="px-4 py-2.5 space-y-2">
                <div>
                    <div className="text-[9px] font-serif font-bold uppercase tracking-wider mb-0.5 pb-0.5" style={{ color, borderBottom: `1px solid ${color}20`, fontFamily: 'Georgia, serif' }}>{`Summary`}</div>
                    <div className="text-[7px] text-gray-500 leading-[1.4]" style={{ fontFamily: 'Georgia, serif' }}>{demo.summary}</div>
                </div>
                <div>
                    <div className="text-[9px] font-serif font-bold uppercase tracking-wider mb-0.5 pb-0.5" style={{ color, borderBottom: `1px solid ${color}20`, fontFamily: 'Georgia, serif' }}>{`Experience`}</div>
                    {demo.experience.map((exp) => (
                        <div key={exp.role} className="mb-1.5">
                            <div className="flex justify-between items-baseline">
                                <span className="text-[7px] font-semibold text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>{exp.role}</span>
                                <span className="text-[5px] text-gray-400">{exp.period}</span>
                            </div>
                            <div className="text-[6px] text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>{exp.company}</div>
                            {exp.responsibilities.slice(0, 1).map((r, i) => (
                                <div key={i} className="text-[5px] text-gray-400 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>• {r}</div>
                            ))}
                        </div>
                    ))}
                </div>
                <div>
                    <div className="text-[9px] font-serif font-bold uppercase tracking-wider mb-0.5 pb-0.5" style={{ color, borderBottom: `1px solid ${color}20`, fontFamily: 'Georgia, serif' }}>{`Education`}</div>
                    <div className="text-[7px] text-gray-700 font-semibold" style={{ fontFamily: 'Georgia, serif' }}>{demo.education.degree}</div>
                    <div className="text-[6px] text-gray-500 italic" style={{ fontFamily: 'Georgia, serif' }}>{demo.education.institution} · {demo.education.year}</div>
                </div>
                <div>
                    <div className="text-[9px] font-serif font-bold uppercase tracking-wider mb-0.5 pb-0.5" style={{ color, borderBottom: `1px solid ${color}20`, fontFamily: 'Georgia, serif' }}>{`Skills & Competencies`}</div>
                    <div className="flex flex-wrap gap-1">
                        {demo.skills.map(s => (
                            <span key={s} className="text-[6px] text-gray-600" style={{ fontFamily: 'Georgia, serif' }}>{s} ·</span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className="text-[8px] font-serif font-bold uppercase tracking-wider mb-0.5" style={{ color, fontFamily: 'Georgia, serif' }}>{`Projects`}</div>
                        {demo.projects.map(p => (
                            <div key={p.name} className="text-[6px] text-gray-500" style={{ fontFamily: 'Georgia, serif' }}>▪ {p.name}</div>
                        ))}
                    </div>
                    <div className="flex-1">
                        <div className="text-[8px] font-serif font-bold uppercase tracking-wider mb-0.5" style={{ color, fontFamily: 'Georgia, serif' }}>{`Languages`}</div>
                        {demo.languages.map(l => (
                            <div key={l.lang} className="text-[6px] text-gray-500" style={{ fontFamily: 'Georgia, serif' }}>{l.lang} — {l.level}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────── MINIMAL MOCKUP ──────── */
function MinimalMockup({ color }: { color: string }) {
    return (
        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg bg-white" style={{ border: '1px solid #e5e7eb' }}>
            <div className="p-4 pb-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg font-light flex-shrink-0" style={{ background: `${color}08`, color: `${color}80`, border: `1px solid ${color}15` }}>
                    {demo.initials[0]}
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-light text-gray-800" style={{ letterSpacing: '-0.02em' }}>{demo.name}</div>
                    <div className="text-[7px] text-gray-500 font-light">{demo.title}</div>
                    <div className="text-[6px] text-gray-400 flex gap-2 mt-0.5">
                        <span>{demo.email}</span>
                        <span>{demo.phone}</span>
                        <span>{demo.linkedin}</span>
                    </div>
                </div>
            </div>
            <div className="px-4 pb-3 space-y-2">
                <div className="h-px" style={{ background: `${color}15` }} />
                <div>
                    <div className="text-[7px] text-gray-600 leading-[1.4] font-light">{demo.summary}</div>
                </div>
                <div className="h-px" style={{ background: `${color}15` }} />
                <div>
                    <div className="text-[8px] font-medium text-gray-400 uppercase tracking-widest mb-1">{`Experience`}</div>
                    {demo.experience.map((exp) => (
                        <div key={exp.role} className="mb-1.5">
                            <div className="flex justify-between items-baseline">
                                <div className="text-[7px] font-medium text-gray-700">{exp.role}</div>
                                <div className="text-[5px] text-gray-400">{exp.period}</div>
                            </div>
                            <div className="text-[6px] text-gray-400 font-light">{exp.company}</div>
                            {exp.responsibilities.slice(0, 1).map((r, i) => (
                                <div key={i} className="text-[5px] text-gray-400 font-light mt-0.5">• {r}</div>
                            ))}
                            <div className="text-[5px] text-gray-400 font-light mt-0.5">{exp.technologies.join(' · ')}</div>
                        </div>
                    ))}
                </div>
                <div className="h-px" style={{ background: `${color}15` }} />
                <div>
                    <div className="text-[8px] font-medium text-gray-400 uppercase tracking-widest mb-1">{`Projects`}</div>
                    {demo.projects.map(p => (
                        <div key={p.name} className="mb-1">
                            <div className="text-[7px] font-medium text-gray-700">{p.name}</div>
                            <div className="text-[5px] text-gray-400 font-light">{p.tech}</div>
                        </div>
                    ))}
                </div>
                <div className="h-px" style={{ background: `${color}15` }} />
                <div>
                    <div className="text-[8px] font-medium text-gray-400 uppercase tracking-widest mb-1">{`Skills`}</div>
                    <div className="text-[6px] text-gray-500 font-light">{demo.skills.join('  ·  ')}</div>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1">
                        <div className="text-[7px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">{`Certs`}</div>
                        {demo.certifications.map(c => (
                            <div key={c} className="text-[5px] text-gray-500 font-light">{c}</div>
                        ))}
                    </div>
                    <div className="flex-1">
                        <div className="text-[7px] font-medium text-gray-400 uppercase tracking-widest mb-0.5">{`Languages`}</div>
                        <div className="text-[5px] text-gray-500 font-light">{demo.languages.map(l => `${l.lang} (${l.level})`).join(' · ')}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ──────── Template Mockup Selector ──────── */
function TemplateMockup({ template }: { template: typeof templates[0] }) {
    switch (template.id) {
        case 'modern': return <ModernMockup color={template.primaryColor} accent={template.accentColor} />;
        case 'professional': return <ProfessionalMockup color={template.primaryColor} />;
        case 'creative': return <CreativeMockup color={template.primaryColor} accent={template.accentColor} />;
        case 'classic': return <ClassicMockup color={template.primaryColor} />;
        case 'minimal': return <MinimalMockup color={template.primaryColor} />;
        default: return <ModernMockup color={template.primaryColor} accent={template.accentColor} />;
    }
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
                            className="rounded-2xl border overflow-hidden card-hover animate-fade-in-up flex flex-col h-full"
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
                            <div className="p-5 flex-1 flex flex-col space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>{template.name}</h2>
                                    <span
                                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                                        style={{ background: `${template.badgeColor}15`, color: template.badgeColor }}
                                    >
                                        {template.badge}
                                    </span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400" style={{ color: 'var(--muted)' }}>
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
                                    className="group w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm btn-gradient mt-auto pt-2"
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
