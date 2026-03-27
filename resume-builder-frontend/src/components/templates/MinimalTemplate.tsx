import { ResumeData } from '@/pages/ResumeEditor';
import { ColorTheme } from '@/types/template';

interface MinimalTemplateProps {
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

export function MinimalTemplate({ data, theme }: MinimalTemplateProps) {
    return (
        <div className="p-12 text-sm h-full" style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: theme.text,
            lineHeight: '1.7',
        }}>
            {/* Header */}
            <header className="mb-8 flex items-center gap-6">
                {data.personalInfo.profileImage ? (
                    <img src={data.personalInfo.profileImage} alt={data.personalInfo.fullName || 'Profile'}
                        className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                        style={{ border: `2px solid ${theme.textLight || '#e5e7eb'}40`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                ) : data.personalInfo.fullName ? (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0 text-2xl font-light"
                        style={{ background: `${theme.text}08`, color: theme.textLight, border: `2px solid ${theme.text}12` }}>
                        {data.personalInfo.fullName[0]?.toUpperCase()}
                    </div>
                ) : null}
                <div className="flex-1 min-w-0">
                    <h1 className="text-4xl font-light mb-1" style={{ color: theme.text, letterSpacing: '-0.02em' }}>
                        {data.personalInfo.fullName || 'Your Name'}
                    </h1>
                    {data.personalInfo.jobTitle && (
                        <p className="text-sm font-light mb-2" style={{ color: theme.textLight }}>{data.personalInfo.jobTitle}</p>
                    )}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-light" style={{ color: theme.textLight }}>
                        {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                        {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                        {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                        {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
                        {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
                    </div>
                </div>
            </header>

            {/* Summary */}
            {data.personalInfo.summary && (
                <section className="mb-8">
                    <p className="font-light leading-relaxed" style={{ color: theme.text }}>{data.personalInfo.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>Experience</h2>
                    <div className="space-y-6">
                        {data.experience.map((exp) => {
                            const respLines = toLines(exp.responsibilities);
                            const achieveLines = toLines(exp.achievements);
                            const techItems = exp.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [];
                            return (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h3 className="text-base font-medium" style={{ color: theme.text }}>{exp.jobTitle || 'Job Title'}</h3>
                                        <span className="text-xs font-light" style={{ color: theme.textLight }}>
                                            {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="font-light mb-2" style={{ color: theme.textLight }}>{exp.company || 'Company Name'}</p>
                                    {exp.description && <p className="font-light leading-relaxed" style={{ color: theme.text }}>{exp.description}</p>}
                                    {respLines.length > 0 && (
                                        <ul className="mt-1 font-light list-disc list-inside" style={{ color: theme.text }}>
                                            {respLines.map((l, i) => <li key={i}>{l}</li>)}
                                        </ul>
                                    )}
                                    {achieveLines.length > 0 && (
                                        <ul className="mt-1 font-light" style={{ color: theme.text }}>
                                            {achieveLines.map((l, i) => <li key={i}>✦ {l}</li>)}
                                        </ul>
                                    )}
                                    {techItems.length > 0 && (
                                        <p className="mt-1 text-xs font-light" style={{ color: theme.textLight }}>
                                            {techItems.join(' · ')}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Projects */}
            {data.projects?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>Projects</h2>
                    <div className="space-y-4">
                        {data.projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-medium" style={{ color: theme.text }}>{proj.name || 'Project'}</h3>
                                    {(proj.startDate || proj.endDate) && (
                                        <span className="text-xs font-light" style={{ color: theme.textLight }}>
                                            {formatDate(proj.startDate)} — {formatDate(proj.endDate)}
                                        </span>
                                    )}
                                </div>
                                {proj.link && <p className="text-xs font-light" style={{ color: theme.textLight }}>{proj.link}</p>}
                                {proj.description && <p className="font-light" style={{ color: theme.text }}>{proj.description}</p>}
                                {proj.technologies && (
                                    <p className="text-xs font-light mt-0.5" style={{ color: theme.textLight }}>{proj.technologies}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>Education</h2>
                    <div className="space-y-4">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-medium" style={{ color: theme.text }}>{edu.degree || 'Degree'}</h3>
                                        <p className="font-light" style={{ color: theme.textLight }}>
                                            {edu.institution || 'Institution'}{edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
                                        </p>
                                    </div>
                                    <span className="text-xs font-light" style={{ color: theme.textLight }}>
                                        {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                                    </span>
                                </div>
                                {edu.gpa && <p className="text-xs font-light" style={{ color: theme.textLight }}>GPA: {edu.gpa}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>Skills</h2>
                    <div className="font-light" style={{ color: theme.text }}>
                        {data.skills.map(s => s.name).filter(Boolean).join('  ·  ')}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {data.certifications?.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>Certifications</h2>
                    <div className="space-y-1">
                        {data.certifications.map((cert) => (
                            <div key={cert.id} className="flex justify-between font-light">
                                <span style={{ color: theme.text }}>
                                    {cert.name}{cert.issuer && ` — ${cert.issuer}`}
                                </span>
                                {cert.date && <span className="text-xs" style={{ color: theme.textLight }}>{formatDate(cert.date)}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {data.languages?.length > 0 && (
                <section>
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>Languages</h2>
                    <div className="font-light" style={{ color: theme.text }}>
                        {data.languages.map(l => `${l.language} (${l.proficiency})`).join('  ·  ')}
                    </div>
                </section>
            )}
        </div>
    );
}
