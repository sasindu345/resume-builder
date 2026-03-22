import { ResumeData } from '@/pages/ResumeEditor';
import { ColorTheme } from '@/types/template';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ModernTemplateProps {
    data: ResumeData;
    theme: ColorTheme;
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const proficiencyWidth: Record<string, string> = {
    Beginner: '25%',
    Intermediate: '50%',
    Advanced: '75%',
    Expert: '100%',
};

export function ModernTemplate({ data, theme }: ModernTemplateProps) {
    return (
        <div
            className="text-sm h-full"
            style={{
                fontFamily: "'Inter', -apple-system, sans-serif",
                color: theme.text,
                lineHeight: '1.6',
            }}
        >
            {/* ── HEADER ── */}
            <header
                className="px-8 py-6"
                style={{ background: theme.primary, color: '#fff' }}
            >
                <div className="flex items-center gap-5">
                    {/* Profile Image — 96px */}
                    {data.personalInfo.profileImage ? (
                        <img
                            src={data.personalInfo.profileImage}
                            alt={data.personalInfo.fullName || 'Profile'}
                            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                            style={{
                                border: '3px solid rgba(255,255,255,0.6)',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                            }}
                        />
                    ) : (
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 text-3xl font-bold"
                            style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '3px solid rgba(255,255,255,0.4)' }}
                        >
                            {data.personalInfo.fullName?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-extrabold mb-1 leading-tight" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
                            {data.personalInfo.fullName || 'Your Name'}
                        </h1>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {data.personalInfo.email && (
                                <span className="flex items-center gap-1">
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    {data.personalInfo.email}
                                </span>
                            )}
                            {data.personalInfo.phone && (
                                <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 flex-shrink-0" />
                                    {data.personalInfo.phone}
                                </span>
                            )}
                            {data.personalInfo.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                    {data.personalInfo.location}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-8 py-6 space-y-5">
                {/* ── SUMMARY ── */}
                {data.personalInfo.summary && (
                    <section>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                        >
                            Professional Summary
                        </h2>
                        <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
                            {data.personalInfo.summary}
                        </p>
                    </section>
                )}

                {/* ── EXPERIENCE ── */}
                {data.experience.length > 0 && (
                    <section>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                        >
                            Experience
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => (
                                <div key={exp.id} className="pl-3" style={{ borderLeft: `3px solid ${theme.primary}30` }}>
                                    <div className="flex justify-between items-start gap-2 mb-0.5">
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: theme.secondary || theme.primary }}>
                                                {exp.jobTitle || 'Job Title'}
                                            </h3>
                                            <p className="font-medium text-xs" style={{ color: theme.text }}>
                                                {exp.company || 'Company'}
                                            </p>
                                        </div>
                                        <span className="text-xs whitespace-nowrap flex-shrink-0 font-medium px-2 py-0.5 rounded-full" style={{ background: `${theme.primary}15`, color: theme.primary }}>
                                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.textLight || theme.text }}>
                                            {exp.description}
                                        </p>
                                    )}
                                    {exp.achievements && (
                                        <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.textLight || theme.text }}>
                                            ✦ {exp.achievements}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── EDUCATION ── */}
                {data.education.length > 0 && (
                    <section>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                        >
                            Education
                        </h2>
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start gap-2">
                                    <div>
                                        <h3 className="font-bold text-sm" style={{ color: theme.secondary || theme.primary }}>
                                            {edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                        </h3>
                                        <p className="text-xs" style={{ color: theme.text }}>{edu.institution || 'Institution'}</p>
                                        {edu.gpa && <p className="text-xs" style={{ color: theme.textLight || theme.text }}>GPA: {edu.gpa}</p>}
                                    </div>
                                    <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: theme.textLight || theme.text }}>
                                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── SKILLS ── */}
                {data.skills.length > 0 && (
                    <section>
                        <h2
                            className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}
                        >
                            Skills
                        </h2>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            {data.skills.map((skill) => (
                                <div key={skill.id}>
                                    <div className="flex justify-between text-xs mb-0.5">
                                        <span className="font-medium" style={{ color: theme.text }}>{skill.name || 'Skill'}</span>
                                        <span style={{ color: theme.textLight || theme.text }}>{skill.proficiency}</span>
                                    </div>
                                    <div className="h-1 rounded-full overflow-hidden" style={{ background: `${theme.primary}20` }}>
                                        <div
                                            className="h-full rounded-full"
                                            style={{ width: proficiencyWidth[skill.proficiency] || '50%', background: theme.primary }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
