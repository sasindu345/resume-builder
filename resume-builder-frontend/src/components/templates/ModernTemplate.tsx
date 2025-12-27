import { ResumeData } from '@/pages/ResumeEditor';
import { ColorTheme } from '@/types/template';

interface ModernTemplateProps {
    data: ResumeData;
    theme: ColorTheme;
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    const date = new Date(dateStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export function ModernTemplate({ data, theme }: ModernTemplateProps) {
    return (
        <div className="p-8 text-sm h-full" style={{
            fontFamily: "'Inter', -apple-system, sans-serif",
            color: theme.text,
            lineHeight: '1.6',
        }}>
            {/* Header Section */}
            <header className="mb-6 pb-4" style={{ borderBottom: `3px solid ${theme.primary}` }}>
                <h1 className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: theme.textLight }}>
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </header>

            {/* Summary Section */}
            {data.personalInfo.summary && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: theme.primary }}>
                        PROFESSIONAL SUMMARY
                    </h2>
                    <p style={{ color: theme.text }}>{data.personalInfo.summary}</p>
                </section>
            )}

            {/* Experience Section */}
            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: theme.primary }}>
                        EXPERIENCE
                    </h2>
                    <div className="space-y-4">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-start mb-1">
                                    <div>
                                        <h3 className="font-bold text-base" style={{ color: theme.secondary }}>
                                            {exp.jobTitle || 'Job Title'}
                                        </h3>
                                        <p className="font-medium" style={{ color: theme.text }}>
                                            {exp.company || 'Company Name'}
                                        </p>
                                    </div>
                                    <span className="text-sm whitespace-nowrap" style={{ color: theme.textLight }}>
                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p className="mt-2" style={{ color: theme.text }}>
                                        {exp.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education Section */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold mb-3" style={{ color: theme.primary }}>
                        EDUCATION
                    </h2>
                    <div className="space-y-3">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold" style={{ color: theme.secondary }}>
                                            {edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                        </h3>
                                        <p style={{ color: theme.text }}>{edu.institution || 'Institution'}</p>
                                        {edu.gpa && <p style={{ color: theme.textLight }}>GPA: {edu.gpa}</p>}
                                    </div>
                                    <span className="text-sm whitespace-nowrap" style={{ color: theme.textLight }}>
                                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills Section */}
            {data.skills.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-3" style={{ color: theme.primary }}>
                        SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="px-3 py-1 rounded-full text-sm font-medium"
                                style={{
                                    backgroundColor: theme.primary + '15',
                                    color: theme.primary,
                                }}
                            >
                                {skill.name || 'Skill'} • {skill.proficiency}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
