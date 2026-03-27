import { ResumeData } from '@/pages/ResumeEditor';
import { ColorTheme } from '@/types/template';

interface ClassicTemplateProps {
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

export function ClassicTemplate({ data, theme }: ClassicTemplateProps) {
    return (
        <div className="p-8 text-sm h-full" style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: theme.text,
            lineHeight: '1.5',
        }}>
            {/* Header */}
            <header className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.border}` }}>
                {data.personalInfo.profileImage ? (
                    <img src={data.personalInfo.profileImage} alt={data.personalInfo.fullName || 'Profile'}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                        style={{ border: `3px solid ${theme.secondary}`, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                ) : data.personalInfo.fullName ? (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-serif font-bold"
                        style={{ background: `${theme.secondary}15`, color: theme.secondary, border: `3px solid ${theme.secondary}30` }}>
                        {data.personalInfo.fullName[0]?.toUpperCase()}
                    </div>
                ) : null}
                <h1 className="text-3xl font-serif mb-1" style={{ color: theme.secondary }}>
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                {data.personalInfo.jobTitle && (
                    <p className="text-sm italic mb-2" style={{ color: theme.textLight || theme.text }}>{data.personalInfo.jobTitle}</p>
                )}
                <div className="text-sm space-x-3" style={{ color: theme.textLight }}>
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <><span>•</span><span>{data.personalInfo.phone}</span></>}
                    {data.personalInfo.location && <><span>•</span><span>{data.personalInfo.location}</span></>}
                </div>
                {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio) && (
                    <div className="text-xs mt-1 space-x-3" style={{ color: theme.textLight }}>
                        {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
                        {data.personalInfo.github && <span>{data.personalInfo.github}</span>}
                        {data.personalInfo.portfolio && <span>{data.personalInfo.portfolio}</span>}
                    </div>
                )}
            </header>

            {/* Summary */}
            {data.personalInfo.summary && (
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>Summary</h2>
                    <p className="text-justify" style={{ color: theme.text }}>{data.personalInfo.summary}</p>
                </section>
            )}

            {/* Experience */}
            {data.experience.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>Professional Experience</h2>
                    <div className="space-y-3">
                        {data.experience.map((exp) => {
                            const respLines = toLines(exp.responsibilities);
                            const achieveLines = toLines(exp.achievements);
                            const techItems = exp.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [];
                            return (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base" style={{ color: theme.text }}>{exp.jobTitle || 'Job Title'}</h3>
                                        <span className="text-sm italic" style={{ color: theme.textLight }}>
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="italic mb-1" style={{ color: theme.textLight }}>{exp.company || 'Company Name'}</p>
                                    {exp.description && <p className="text-justify" style={{ color: theme.text }}>{exp.description}</p>}
                                    {respLines.length > 0 && (
                                        <ul className="mt-1 list-disc list-inside" style={{ color: theme.text }}>
                                            {respLines.map((l, i) => <li key={i}>{l}</li>)}
                                        </ul>
                                    )}
                                    {achieveLines.length > 0 && (
                                        <ul className="mt-1" style={{ color: theme.text }}>
                                            {achieveLines.map((l, i) => <li key={i}>✦ {l}</li>)}
                                        </ul>
                                    )}
                                    {techItems.length > 0 && (
                                        <p className="text-xs mt-1 italic" style={{ color: theme.textLight }}>
                                            Technologies: {techItems.join(', ')}
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
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>Projects</h2>
                    <div className="space-y-3">
                        {data.projects.map((proj) => (
                            <div key={proj.id}>
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-bold" style={{ color: theme.text }}>{proj.name || 'Project'}</h3>
                                    {(proj.startDate || proj.endDate) && (
                                        <span className="text-sm italic" style={{ color: theme.textLight }}>
                                            {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                                        </span>
                                    )}
                                </div>
                                {proj.link && <p className="text-xs italic" style={{ color: theme.secondary }}>{proj.link}</p>}
                                {proj.description && <p className="text-justify" style={{ color: theme.text }}>{proj.description}</p>}
                                {proj.technologies && (
                                    <p className="text-xs italic mt-0.5" style={{ color: theme.textLight }}>
                                        Technologies: {proj.technologies}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {data.education.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>Education</h2>
                    <div className="space-y-2">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-bold" style={{ color: theme.text }}>
                                            {edu.degree || 'Degree'}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                                        </h3>
                                        <p className="italic" style={{ color: theme.textLight }}>{edu.institution || 'Institution'}</p>
                                    </div>
                                    <span className="text-sm italic" style={{ color: theme.textLight }}>
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </span>
                                </div>
                                {edu.gpa && <p className="text-sm" style={{ color: theme.textLight }}>GPA: {edu.gpa}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills */}
            {data.skills.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>Skills & Competencies</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {data.skills.map((skill) => (
                            <div key={skill.id} className="flex justify-between">
                                <span style={{ color: theme.text }}>{skill.name || 'Skill'}</span>
                                <span className="text-sm italic" style={{ color: theme.textLight }}>{skill.proficiency}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Certifications */}
            {data.certifications?.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>Certifications</h2>
                    <div className="space-y-1">
                        {data.certifications.map((cert) => (
                            <div key={cert.id} className="flex justify-between items-baseline">
                                <div>
                                    <span className="font-semibold" style={{ color: theme.text }}>{cert.name}</span>
                                    {cert.issuer && <span className="italic" style={{ color: theme.textLight }}> — {cert.issuer}</span>}
                                </div>
                                {cert.date && <span className="text-sm italic" style={{ color: theme.textLight }}>{formatDate(cert.date)}</span>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Languages */}
            {data.languages?.length > 0 && (
                <section>
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>Languages</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {data.languages.map((lang) => (
                            <div key={lang.id} className="flex justify-between">
                                <span style={{ color: theme.text }}>{lang.language}</span>
                                <span className="italic" style={{ color: theme.textLight }}>{lang.proficiency}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
