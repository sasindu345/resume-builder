import { ResumeData } from '@/pages/ResumeEditor';
import { ColorTheme } from '@/types/template';

interface ProfessionalTemplateProps {
    data: ResumeData;
    theme: ColorTheme;
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const toLines = (text?: string) =>
    text ? text.split(/\n|(?:^|\n)\s*[-•*]\s*/).map(s => s.trim()).filter(Boolean) : [];

export function ProfessionalTemplate({ data, theme }: ProfessionalTemplateProps) {
    return (
        <div className="text-sm h-full flex" style={{
            fontFamily: "'Segoe UI', Roboto, sans-serif",
            color: theme.text,
            lineHeight: '1.5',
        }}>
            {/* ── SIDEBAR ── */}
            <aside className="w-[35%] flex-shrink-0 p-6 space-y-5" style={{ background: `${theme.primary}08`, borderRight: `2px solid ${theme.primary}15` }}>
                {/* Profile Image */}
                {data.personalInfo.profileImage ? (
                    <img src={data.personalInfo.profileImage} alt={data.personalInfo.fullName || 'Profile'}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                        style={{ border: `3px solid ${theme.primary}`, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                ) : data.personalInfo.fullName ? (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto text-2xl font-bold"
                        style={{ background: `${theme.primary}15`, color: theme.primary, border: `3px solid ${theme.primary}30` }}>
                        {data.personalInfo.fullName[0]?.toUpperCase()}
                    </div>
                ) : null}

                {/* Contact */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                        style={{ color: theme.primary, borderBottom: `1px solid ${theme.primary}30` }}>Contact</h3>
                    <div className="space-y-1.5 text-xs" style={{ color: theme.textLight || theme.text }}>
                        {data.personalInfo.email && <div>📧 {data.personalInfo.email}</div>}
                        {data.personalInfo.phone && <div>📱 {data.personalInfo.phone}</div>}
                        {data.personalInfo.location && <div>📍 {data.personalInfo.location}</div>}
                        {data.personalInfo.linkedin && <div>🔗 {data.personalInfo.linkedin}</div>}
                        {data.personalInfo.github && <div>💻 {data.personalInfo.github}</div>}
                        {data.personalInfo.portfolio && <div>🌐 {data.personalInfo.portfolio}</div>}
                    </div>
                </div>

                {/* Skills */}
                {data.skills.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.primary}30` }}>Skills</h3>
                        <div className="space-y-2">
                            {data.skills.map((skill) => (
                                <div key={skill.id}>
                                    <div className="flex justify-between text-xs mb-0.5">
                                        <span style={{ color: theme.text }}>{skill.name}</span>
                                        <span className="text-[10px]" style={{ color: theme.textLight || theme.text }}>{skill.proficiency}</span>
                                    </div>
                                    <div className="h-1 rounded-full" style={{ background: `${theme.primary}20` }}>
                                        <div className="h-full rounded-full" style={{
                                            background: theme.primary,
                                            width: skill.proficiency === 'Expert' ? '100%' : skill.proficiency === 'Advanced' ? '75%' : skill.proficiency === 'Intermediate' ? '50%' : '25%'
                                        }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {data.languages?.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.primary}30` }}>Languages</h3>
                        <div className="space-y-1">
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex justify-between text-xs">
                                    <span style={{ color: theme.text }}>{lang.language}</span>
                                    <span style={{ color: theme.textLight || theme.text }}>{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {data.certifications?.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.primary}30` }}>Certifications</h3>
                        <div className="space-y-1.5">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="text-xs">
                                    <div className="font-semibold" style={{ color: theme.text }}>{cert.name}</div>
                                    {cert.issuer && <div style={{ color: theme.textLight || theme.text }}>{cert.issuer}</div>}
                                    {cert.date && <div className="text-[10px]" style={{ color: theme.textLight || theme.text }}>{formatDate(cert.date)}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* ── MAIN BODY ── */}
            <main className="flex-1 p-6 space-y-5 overflow-hidden">
                {/* Header */}
                <div className="pb-3" style={{ borderBottom: `2px solid ${theme.primary}` }}>
                    <h1 className="text-2xl font-bold" style={{ color: theme.primary }}>
                        {data.personalInfo.fullName || 'Your Name'}
                    </h1>
                    {data.personalInfo.jobTitle && (
                        <p className="text-sm font-medium mt-0.5" style={{ color: theme.textLight || theme.text }}>
                            {data.personalInfo.jobTitle}
                        </p>
                    )}
                </div>

                {/* Summary */}
                {data.personalInfo.summary && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}>Summary</h2>
                        <p className="text-xs leading-relaxed" style={{ color: theme.text }}>{data.personalInfo.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}>Experience</h2>
                        <div className="space-y-3">
                            {data.experience.map((exp) => {
                                const respLines = toLines(exp.responsibilities);
                                const achieveLines = toLines(exp.achievements);
                                const techItems = exp.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [];
                                return (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-sm" style={{ color: theme.text }}>{exp.jobTitle || 'Job Title'}</h3>
                                            <span className="text-[10px]" style={{ color: theme.textLight || theme.text }}>
                                                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                            </span>
                                        </div>
                                        <p className="text-xs italic" style={{ color: theme.textLight || theme.text }}>{exp.company || 'Company'}</p>
                                        {exp.description && <p className="text-xs mt-1" style={{ color: theme.text }}>{exp.description}</p>}
                                        {respLines.length > 0 && (
                                            <ul className="mt-1 text-xs list-disc list-inside" style={{ color: theme.textLight || theme.text }}>
                                                {respLines.map((l, i) => <li key={i}>{l}</li>)}
                                            </ul>
                                        )}
                                        {achieveLines.length > 0 && (
                                            <ul className="mt-1 text-xs" style={{ color: theme.textLight || theme.text }}>
                                                {achieveLines.map((l, i) => <li key={i}>✦ {l}</li>)}
                                            </ul>
                                        )}
                                        {techItems.length > 0 && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {techItems.map((t, i) => (
                                                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                                        style={{ background: `${theme.primary}10`, color: theme.primary }}>
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

                {/* Projects */}
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}>Projects</h2>
                        <div className="space-y-3">
                            {data.projects.map((proj) => (
                                <div key={proj.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm" style={{ color: theme.text }}>{proj.name || 'Project'}</h3>
                                        {(proj.startDate || proj.endDate) && (
                                            <span className="text-[10px]" style={{ color: theme.textLight || theme.text }}>
                                                {formatDate(proj.startDate)} – {formatDate(proj.endDate)}
                                            </span>
                                        )}
                                    </div>
                                    {proj.link && <p className="text-[10px]" style={{ color: theme.primary }}>{proj.link}</p>}
                                    {proj.description && <p className="text-xs mt-0.5" style={{ color: theme.text }}>{proj.description}</p>}
                                    {proj.technologies && (
                                        <div className="mt-1 flex flex-wrap gap-1">
                                            {proj.technologies.split(',').map(t => t.trim()).filter(Boolean).map((t, i) => (
                                                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                                    style={{ background: `${theme.primary}10`, color: theme.primary }}>{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ color: theme.primary, borderBottom: `1px solid ${theme.border}` }}>Education</h2>
                        <div className="space-y-2">
                            {data.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-bold text-sm" style={{ color: theme.text }}>
                                            {edu.degree || 'Degree'}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                                        </h3>
                                        <p className="text-xs" style={{ color: theme.textLight || theme.text }}>{edu.institution || 'Institution'}</p>
                                        {edu.gpa && <p className="text-[10px]" style={{ color: theme.textLight || theme.text }}>GPA: {edu.gpa}</p>}
                                    </div>
                                    <span className="text-[10px]" style={{ color: theme.textLight || theme.text }}>
                                        {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
