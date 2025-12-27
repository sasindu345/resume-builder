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

export function MinimalTemplate({ data, theme }: MinimalTemplateProps) {
    return (
        <div className="p-12 text-sm h-full" style={{
            fontFamily: "'Helvetica Neue', Arial, sans-serif",
            color: theme.text,
            lineHeight: '1.7',
        }}>
            {/* Header Section */}
            <header className="mb-8">
                <h1 className="text-4xl font-light mb-3" style={{ color: theme.text, letterSpacing: '-0.02em' }}>
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="flex gap-6 text-sm font-light" style={{ color: theme.textLight }}>
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </header>

            {/* Summary Section */}
            {data.personalInfo.summary && (
                <section className="mb-8">
                    <p className="font-light leading-relaxed" style={{ color: theme.text }}>
                        {data.personalInfo.summary}
                    </p>
                </section>
            )}

            {/* Experience Section */}
            {data.experience.length > 0 && (
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>
                        Experience
                    </h2>
                    <div className="space-y-6">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="text-base font-medium" style={{ color: theme.text }}>
                                        {exp.jobTitle || 'Job Title'}
                                    </h3>
                                    <span className="text-xs font-light" style={{ color: theme.textLight }}>
                                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                                    </span>
                                </div>
                                <p className="font-light mb-2" style={{ color: theme.textLight }}>
                                    {exp.company || 'Company Name'}
                                </p>
                                {exp.description && (
                                    <p className="font-light leading-relaxed" style={{ color: theme.text }}>
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
                <section className="mb-8">
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>
                        Education
                    </h2>
                    <div className="space-y-4">
                        {data.education.map((edu) => (
                            <div key={edu.id}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-medium" style={{ color: theme.text }}>
                                            {edu.degree || 'Degree'}
                                        </h3>
                                        <p className="font-light" style={{ color: theme.textLight }}>
                                            {edu.institution || 'Institution'}
                                            {edu.fieldOfStudy && ` • ${edu.fieldOfStudy}`}
                                        </p>
                                    </div>
                                    <span className="text-xs font-light" style={{ color: theme.textLight }}>
                                        {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
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
                    <h2 className="text-xs uppercase tracking-widest mb-5 font-medium" style={{ color: theme.textLight }}>
                        Skills
                    </h2>
                    <div className="space-y-1">
                        {data.skills.map((skill) => (
                            <div key={skill.id} className="font-light" style={{ color: theme.text }}>
                                {skill.name || 'Skill'}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
