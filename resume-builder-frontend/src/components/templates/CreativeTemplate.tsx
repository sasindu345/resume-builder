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

export function CreativeTemplate({ data, theme }: CreativeTemplateProps) {
    return (
        <div className="p-8 text-sm h-full" style={{
            fontFamily: "'Poppins', 'Helvetica', sans-serif",
            color: theme.text,
            lineHeight: '1.65',
        }}>
            {/* Header Section with Accent */}
            <header className="mb-6 relative">
                <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: theme.accent }} />
                <div className="pl-6">
                    <h1 className="text-4xl font-bold mb-2" style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        {data.personalInfo.fullName || 'Your Name'}
                    </h1>
                    <div className="flex flex-wrap gap-3 text-sm mt-3" style={{ color: theme.textLight }}>
                        {data.personalInfo.email && (
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                                {data.personalInfo.email}
                            </span>
                        )}
                        {data.personalInfo.phone && (
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                                {data.personalInfo.phone}
                            </span>
                        )}
                        {data.personalInfo.location && (
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                                {data.personalInfo.location}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* Summary Section */}
            {data.personalInfo.summary && (
                <section className="mb-6 p-4 rounded-lg" style={{ backgroundColor: theme.primary + '08' }}>
                    <p className="leading-relaxed" style={{ color: theme.text }}>{data.personalInfo.summary}</p>
                </section>
            )}

            {/* Experience Section */}
            {data.experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.primary }}>
                        <span className="w-8 h-1 rounded" style={{ backgroundColor: theme.accent }} />
                        EXPERIENCE
                    </h2>
                    <div className="space-y-4 pl-2">
                        {data.experience.map((exp) => (
                            <div key={exp.id} className="relative">
                                <div className="absolute -left-2 top-2 w-3 h-3 rounded-full border-2"
                                    style={{
                                        backgroundColor: theme.background,
                                        borderColor: theme.accent
                                    }} />
                                <div className="pl-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-bold text-base" style={{ color: theme.secondary }}>
                                                {exp.jobTitle || 'Job Title'}
                                            </h3>
                                            <p className="font-semibold" style={{ color: theme.accent }}>
                                                {exp.company || 'Company Name'}
                                            </p>
                                        </div>
                                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                                            style={{
                                                backgroundColor: theme.primary + '15',
                                                color: theme.primary
                                            }}>
                                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                                        </span>
                                    </div>
                                    {exp.description && (
                                        <p className="mt-2 leading-relaxed" style={{ color: theme.text }}>
                                            {exp.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education Section */}
            {data.education.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.primary }}>
                        <span className="w-8 h-1 rounded" style={{ backgroundColor: theme.accent }} />
                        EDUCATION
                    </h2>
                    <div className="space-y-3 pl-6">
                        {data.education.map((edu) => (
                            <div key={edu.id} className="relative">
                                <div className="absolute -left-6 top-2 w-2 h-2 rounded-full"
                                    style={{ backgroundColor: theme.accent }} />
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold" style={{ color: theme.secondary }}>
                                            {edu.degree || 'Degree'} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                                        </h3>
                                        <p className="font-medium" style={{ color: theme.textLight }}>
                                            {edu.institution || 'Institution'}
                                        </p>
                                        {edu.gpa && (
                                            <p className="text-xs mt-1" style={{ color: theme.primary }}>
                                                GPA: {edu.gpa}
                                            </p>
                                        )}
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

            {/* Skills Section */}
            {data.skills.length > 0 && (
                <section>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.primary }}>
                        <span className="w-8 h-1 rounded" style={{ backgroundColor: theme.accent }} />
                        SKILLS
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="px-4 py-2 rounded-lg text-sm font-semibold"
                                style={{
                                    background: `linear-gradient(135deg, ${theme.primary}15, ${theme.accent}15)`,
                                    color: theme.primary,
                                    border: `1.5px solid ${theme.primary}30`,
                                }}
                            >
                                {skill.name || 'Skill'}
                                <span className="ml-2 text-xs opacity-75">• {skill.proficiency}</span>
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
