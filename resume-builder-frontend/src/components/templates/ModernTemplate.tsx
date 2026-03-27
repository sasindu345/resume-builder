import { ResumeData } from '@/pages/ResumeEditor';
import { ColorTheme } from '@/types/template';
import { Mail, Phone, MapPin, Linkedin, Globe, Github } from 'lucide-react';

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

/** Split multi-line or bullet-separated text into an array of lines */
const toLines = (text?: string) =>
    text ? text.split(/\n|(?:^|\n)\s*[-•*]\s*/).map(s => s.trim()).filter(Boolean) : [];

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
                    {data.personalInfo.profileImage ? (
                        <img
                            src={data.personalInfo.profileImage}
                            alt={data.personalInfo.fullName || 'Profile'}
                            className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                            style={{ border: '3px solid rgba(255,255,255,0.6)', boxShadow: '0 4px 16px rgba(0,0,0,0.25)' }}
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
                        <h1 className="text-2xl font-extrabold mb-0.5 leading-tight" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
                            {data.personalInfo.fullName || 'Your Name'}
                        </h1>
                        {data.personalInfo.jobTitle && (
                            <p className="text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.9)' }}>
                                {data.personalInfo.jobTitle}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {data.personalInfo.email && (
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3 flex-shrink-0" />{data.personalInfo.email}</span>
                            )}
                            {data.personalInfo.phone && (
                                <span className="flex items-center gap-1"><Phone className="w-3 h-3 flex-shrink-0" />{data.personalInfo.phone}</span>
                            )}
                            {data.personalInfo.location && (
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 flex-shrink-0" />{data.personalInfo.location}</span>
                            )}
                            {data.personalInfo.linkedin && (
                                <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 flex-shrink-0" />{data.personalInfo.linkedin}</span>
                            )}
                            {data.personalInfo.github && (
                                <span className="flex items-center gap-1"><Github className="w-3 h-3 flex-shrink-0" />{data.personalInfo.github}</span>
                            )}
                            {data.personalInfo.portfolio && (
                                <span className="flex items-center gap-1"><Globe className="w-3 h-3 flex-shrink-0" />{data.personalInfo.portfolio}</span>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="px-8 py-6 space-y-5">
                {/* ── SUMMARY ── */}
                {data.personalInfo.summary && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
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
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
                            Experience
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => {
                                const respLines = toLines(exp.responsibilities);
                                const achieveLines = toLines(exp.achievements);
                                const techItems = exp.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [];
                                return (
                                    <div key={exp.id} className="pl-3" style={{ borderLeft: `3px solid ${theme.primary}30` }}>
                                        <div className="flex justify-between items-start gap-2 mb-0.5">
                                            <div>
                                                <h3 className="font-bold text-sm" style={{ color: theme.secondary || theme.primary }}>
                                                    {exp.jobTitle || 'Job Title'}
                                                </h3>
                                                <p className="font-medium text-xs" style={{ color: theme.text }}>{exp.company || 'Company'}</p>
                                            </div>
                                            <span className="text-xs whitespace-nowrap flex-shrink-0 font-medium px-2 py-0.5 rounded-full"
                                                style={{ background: `${theme.primary}15`, color: theme.primary }}>
                                                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        {exp.description && (
                                            <p className="mt-1 text-xs leading-relaxed" style={{ color: theme.textLight || theme.text }}>{exp.description}</p>
                                        )}
                                        {respLines.length > 0 && (
                                            <ul className="mt-1 text-xs leading-relaxed list-disc list-inside" style={{ color: theme.textLight || theme.text }}>
                                                {respLines.map((line, i) => <li key={i}>{line}</li>)}
                                            </ul>
                                        )}
                                        {achieveLines.length > 0 && (
                                            <ul className="mt-1 text-xs leading-relaxed" style={{ color: theme.textLight || theme.text }}>
                                                {achieveLines.map((line, i) => <li key={i}>✦ {line}</li>)}
                                            </ul>
                                        )}
                                        {techItems.length > 0 && (
                                            <div className="mt-1.5 flex flex-wrap gap-1">
                                                {techItems.map((t, i) => (
                                                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                                        style={{ background: `${theme.primary}12`, color: theme.primary, border: `1px solid ${theme.primary}25` }}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ── PROJECTS ── */}
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
                            Projects
                        </h2>
                        <div className="space-y-3">
                            {data.projects.map((proj) => {
                                const techItems = proj.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [];
                                return (
                                    <div key={proj.id} className="pl-3" style={{ borderLeft: `3px solid ${theme.primary}30` }}>
                                        <div className="flex justify-between items-start gap-2 mb-0.5">
                                            <h3 className="font-bold text-sm" style={{ color: theme.secondary || theme.primary }}>
                                                {proj.name || 'Project'}
                                                {proj.link && (
                                                    <span className="text-[10px] font-normal ml-2" style={{ color: theme.textLight || theme.text }}>
                                                        {proj.link}
                                                    </span>
                                                )}
                                            </h3>
                                            {(proj.startDate || proj.endDate) && (
                                                <span className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: theme.textLight || theme.text }}>
                                                    {formatDate(proj.startDate)} – {formatDate(proj.endDate)}
                                                </span>
                                            )}
                                        </div>
                                        {proj.description && (
                                            <p className="text-xs leading-relaxed" style={{ color: theme.textLight || theme.text }}>{proj.description}</p>
                                        )}
                                        {techItems.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {techItems.map((t, i) => (
                                                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                                                        style={{ background: `${theme.primary}12`, color: theme.primary, border: `1px solid ${theme.primary}25` }}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* ── EDUCATION ── */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
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
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
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
                                        <div className="h-full rounded-full"
                                            style={{ width: proficiencyWidth[skill.proficiency] || '50%', background: theme.primary }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── CERTIFICATIONS ── */}
                {data.certifications?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
                            Certifications
                        </h2>
                        <div className="space-y-1.5">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-semibold text-xs" style={{ color: theme.text }}>{cert.name}</span>
                                        {cert.issuer && <span className="text-xs" style={{ color: theme.textLight || theme.text }}> — {cert.issuer}</span>}
                                    </div>
                                    {cert.date && <span className="text-xs" style={{ color: theme.textLight || theme.text }}>{formatDate(cert.date)}</span>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── LANGUAGES ── */}
                {data.languages?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-widest mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
                            Languages
                        </h2>
                        <div className="flex flex-wrap gap-x-6 gap-y-1">
                            {data.languages.map((lang) => (
                                <span key={lang.id} className="text-xs">
                                    <span className="font-medium" style={{ color: theme.text }}>{lang.language}</span>
                                    <span style={{ color: theme.textLight || theme.text }}> — {lang.proficiency}</span>
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
