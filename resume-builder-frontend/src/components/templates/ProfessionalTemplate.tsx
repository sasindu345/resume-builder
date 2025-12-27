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

export function ProfessionalTemplate({ data, theme }: ProfessionalTemplateProps) {
    return (
        <div className="flex h-full">
            {/* Left Sidebar */}
            <aside className="w-1/3 p-6" style={{ backgroundColor: theme.primary + '10' }}>
                <div className="space-y-6">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: theme.primary }}>
                            Contact
                        </h2>
                        <div className="space-y-2 text-xs" style={{ color: theme.text }}>
                            {data.personalInfo.email && <p className="break-words">{data.personalInfo.email}</p>}
                            {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
                            {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
                        </div>
                    </div>

                    {/* Skills */}
                    {data.skills.length > 0 && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-wide mb-3" style={{ color: theme.primary }}>
                                Skills
                            </h2>
                            <div className="space-y-3">
                                {data.skills.map((skill) => (
                                    <div key={skill.id}>
                                        <p className="text-xs font-medium mb-1" style={{ color: theme.text }}>
                                            {skill.name || 'Skill'}
                                        </p>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className="h-1.5 flex-1 rounded"
                                                    style={{
                                                        backgroundColor:
                                                            (skill.proficiency === 'Expert' && level <= 4) ||
                                                                (skill.proficiency === 'Advanced' && level <= 3) ||
                                                                (skill.proficiency === 'Intermediate' && level <= 2) ||
                                                                (skill.proficiency === 'Beginner' && level <= 1)
                                                                ? theme.primary
                                                                : theme.border,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8" style={{
                fontFamily: "'Calibri', 'Segoe UI', sans-serif",
                lineHeight: '1.5',
            }}>
                {/* Header */}
                <header className="mb-6">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: theme.secondary }}>
                        {data.personalInfo.fullName || 'Your Name'}
                    </h1>
                    {data.personalInfo.summary && (
                        <p className="text-sm leading-relaxed" style={{ color: theme.textLight }}>
                            {data.personalInfo.summary}
                        </p>
                    )}
                </header>

                {/* Experience */}
                {data.experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-lg font-bold uppercase mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
                            Experience
                        </h2>
                        <div className="space-y-4">
                            {data.experience.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-base" style={{ color: theme.text }}>
                                            {exp.jobTitle || 'Job Title'}
                                        </h3>
                                        <span className="text-xs" style={{ color: theme.textLight }}>
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    <p className="font-semibold text-sm mb-2" style={{ color: theme.textLight }}>
                                        {exp.company || 'Company Name'}
                                    </p>
                                    {exp.description && (
                                        <p className="text-sm" style={{ color: theme.text }}>
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <section>
                        <h2 className="text-lg font-bold uppercase mb-3 pb-1"
                            style={{ color: theme.primary, borderBottom: `2px solid ${theme.primary}` }}>
                            Education
                        </h2>
                        <div className="space-y-3">
                            {data.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <h3 className="font-bold text-sm" style={{ color: theme.text }}>
                                                {edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                            </h3>
                                            <p className="text-sm" style={{ color: theme.textLight }}>{edu.institution || 'Institution'}</p>
                                        </div>
                                        <span className="text-xs" style={{ color: theme.textLight }}>
                                            {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
