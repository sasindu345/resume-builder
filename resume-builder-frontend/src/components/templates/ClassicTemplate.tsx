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

export function ClassicTemplate({ data, theme }: ClassicTemplateProps) {
    return (
        <div className="p-8 text-sm h-full" style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            color: theme.text,
            lineHeight: '1.5',
        }}>
            {/* Header Section */}
            <header className="text-center mb-6 pb-4" style={{ borderBottom: `2px solid ${theme.border}` }}>
                <h1 className="text-3xl font-serif mb-2" style={{ color: theme.secondary }}>
                    {data.personalInfo.fullName || 'Your Name'}
                </h1>
                <div className="text-sm space-x-3" style={{ color: theme.textLight }}>
                    {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
                    {data.personalInfo.phone && <span>•</span>}
                    {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
                    {data.personalInfo.location && <span>•</span>}
                    {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
                </div>
            </header>

            {/* Summary Section */}
            {data.personalInfo.summary && (
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>
                        Summary
                    </h2>
                    <p className="text-justify" style={{ color: theme.text }}>{data.personalInfo.summary}</p>
                </section>
            )}

            {/* Experience Section */}
            {data.experience.length > 0 && (
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>
                        Professional Experience
                    </h2>
                    <div className="space-y-3">
                        {data.experience.map((exp) => (
                            <div key={exp.id}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-base" style={{ color: theme.text }}>
                                        {exp.jobTitle || 'Job Title'}
                                    </h3>
                                    <span className="text-sm italic" style={{ color: theme.textLight }}>
                                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                    </span>
                                </div>
                                <p className="italic mb-1" style={{ color: theme.textLight }}>
                                    {exp.company || 'Company Name'}
                                </p>
                                {exp.description && (
                                    <p className="text-justify" style={{ color: theme.text }}>
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
                <section className="mb-5">
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>
                        Education
                    </h2>
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

            {/* Skills Section */}
            {data.skills.length > 0 && (
                <section>
                    <h2 className="text-lg font-serif uppercase tracking-wide mb-2 pb-1"
                        style={{ color: theme.secondary, borderBottom: `1px solid ${theme.border}` }}>
                        Skills & Competencies
                    </h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {data.skills.map((skill) => (
                            <div key={skill.id} className="flex justify-between">
                                <span style={{ color: theme.text }}>{skill.name || 'Skill'}</span>
                                <span className="text-sm italic" style={{ color: theme.textLight }}>
                                    {skill.proficiency}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
