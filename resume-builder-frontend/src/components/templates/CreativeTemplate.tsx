import { ResumeData } from '@/pages/ResumeEditor';
import { ColorTheme } from '@/types/template';

interface CreativeTemplateProps {
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

export function CreativeTemplate({ data, theme }: CreativeTemplateProps) {
    return (
        <div className="text-sm h-full flex" style={{
            fontFamily: "'Poppins', 'Inter', sans-serif",
            color: theme.text,
            lineHeight: '1.5',
        }}>
            {/* ── SIDEBAR ── */}
            <aside className="w-[35%] flex-shrink-0 p-6 space-y-5 text-white" style={{
                background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary || theme.primary}dd)`,
            }}>
                {/* Profile */}
                {data.personalInfo.profileImage ? (
                    <img src={data.personalInfo.profileImage} alt={data.personalInfo.fullName || 'Profile'}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                        style={{ border: '3px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
                ) : data.personalInfo.fullName ? (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto text-3xl font-bold"
                        style={{ background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)' }}>
                        {data.personalInfo.fullName[0]?.toUpperCase()}
                    </div>
                ) : null}

                {/* Contact */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Contact</h3>
                    <div className="space-y-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {data.personalInfo.email && <div>{data.personalInfo.email}</div>}
                        {data.personalInfo.phone && <div>{data.personalInfo.phone}</div>}
                        {data.personalInfo.location && <div>{data.personalInfo.location}</div>}
                        {data.personalInfo.linkedin && <div>{data.personalInfo.linkedin}</div>}
                        {data.personalInfo.github && <div>{data.personalInfo.github}</div>}
                        {data.personalInfo.portfolio && <div>{data.personalInfo.portfolio}</div>}
                    </div>
                </div>

                {/* Skills */}
                {data.skills.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Skills</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {data.skills.map((skill) => (
                                <span key={skill.id} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                                    style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Languages */}
                {data.languages?.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Languages</h3>
                        <div className="space-y-1">
                            {data.languages.map((lang) => (
                                <div key={lang.id} className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                    <span>{lang.language}</span>
                                    <span className="text-[10px]">{lang.proficiency}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Certifications */}
                {data.certifications?.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1"
                            style={{ borderBottom: '1px solid rgba(255,255,255,0.3)' }}>Certifications</h3>
                        <div className="space-y-1.5">
                            {data.certifications.map((cert) => (
                                <div key={cert.id} className="text-xs" style={{ color: 'rgba(255,255,255,0.85)' }}>
                                    <div className="font-semibold text-white">{cert.name}</div>
                                    {cert.issuer && <div className="text-[10px]">{cert.issuer} {cert.date && `· ${formatDate(cert.date)}`}</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </aside>

            {/* ── MAIN BODY ── */}
            <main className="flex-1 p-6 space-y-5 overflow-hidden">
                {/* Header */}
                <div className="pb-3" style={{ borderBottom: `3px solid ${theme.primary}` }}>
                    <h1 className="text-2xl font-extrabold" style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary})`,
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>
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
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1" style={{ color: theme.primary }}>
                            <span className="w-3 h-0.5 rounded-full" style={{ background: theme.primary }} />Summary
                        </h2>
                        <p className="text-xs leading-relaxed" style={{ color: theme.text }}>{data.personalInfo.summary}</p>
                    </section>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1" style={{ color: theme.primary }}>
                            <span className="w-3 h-0.5 rounded-full" style={{ background: theme.primary }} />Experience
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => {
                                const respLines = toLines(exp.responsibilities);
                                const achieveLines = toLines(exp.achievements);
                                const techItems = exp.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [];
                                return (
                                    <div key={exp.id} className="flex gap-3">
                                        <div className="flex flex-col items-center pt-1">
                                            <div className="w-2 h-2 rounded-full" style={{ background: theme.primary }} />
                                            <div className="w-px flex-1" style={{ background: `${theme.primary}30` }} />
                                        </div>
                                        <div className="flex-1 pb-2">
                                            <h3 className="font-bold text-sm" style={{ color: theme.text }}>{exp.jobTitle || 'Job Title'}</h3>
                                            <p className="text-xs" style={{ color: theme.textLight || theme.text }}>
                                                {exp.company || 'Company'} · {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                                            </p>
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
                                                        <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium text-white"
                                                            style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary})` }}>
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {data.projects?.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1" style={{ color: theme.primary }}>
                            <span className="w-3 h-0.5 rounded-full" style={{ background: theme.primary }} />Projects
                        </h2>
                        <div className="space-y-3">
                            {data.projects.map((proj) => (
                                <div key={proj.id} className="flex gap-3">
                                    <div className="flex flex-col items-center pt-1">
                                        <div className="w-2 h-2 rounded-full" style={{ background: theme.primary }} />
                                        <div className="w-px flex-1" style={{ background: `${theme.primary}30` }} />
                                    </div>
                                    <div className="flex-1 pb-2">
                                        <h3 className="font-bold text-sm" style={{ color: theme.text }}>{proj.name || 'Project'}</h3>
                                        {proj.link && <p className="text-[10px]" style={{ color: theme.primary }}>{proj.link}</p>}
                                        {proj.description && <p className="text-xs mt-0.5" style={{ color: theme.text }}>{proj.description}</p>}
                                        {proj.technologies && (
                                            <div className="mt-1 flex flex-wrap gap-1">
                                                {proj.technologies.split(',').map(t => t.trim()).filter(Boolean).map((t, i) => (
                                                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md font-medium text-white"
                                                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary})` }}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1" style={{ color: theme.primary }}>
                            <span className="w-3 h-0.5 rounded-full" style={{ background: theme.primary }} />Education
                        </h2>
                        <div className="space-y-2">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-bold text-sm" style={{ color: theme.text }}>
                                            {edu.degree || 'Degree'}{edu.fieldOfStudy && ` · ${edu.fieldOfStudy}`}
                                        </h3>
                                        <span className="text-[10px]" style={{ color: theme.textLight || theme.text }}>
                                            {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                                        </span>
                                    </div>
                                    <p className="text-xs" style={{ color: theme.textLight || theme.text }}>
                                        {edu.institution || 'Institution'} {edu.gpa && `· GPA: ${edu.gpa}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
