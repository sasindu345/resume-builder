import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeftIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ResumePreview } from '@/components/resume-editor/ResumePreview';
import { motion } from 'framer-motion';
import { TemplateName, ThemeName } from '@/types/template';
import editorStyles from '../styles/pages/ResumeEditor.module.css';
import previewStyles from '../styles/editor/ResumePreview.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface ResumeData {
    title: string;
    template: TemplateName;
    theme: ThemeName;
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        location: string;
        summary: string;
    };
    education: Array<{
        id: string;
        degree: string;
        institution: string;
        fieldOfStudy: string;
        startDate: string;
        endDate: string;
        gpa?: string;
    }>;
    experience: Array<{
        id: string;
        jobTitle: string;
        company: string;
        startDate: string;
        endDate: string;
        description: string;
    }>;
    skills: Array<{
        id: string;
        name: string;
        proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    }>;
}

const defaultResumeData: ResumeData = {
    title: 'My Resume',
    template: 'modern',
    theme: 'blue',
    personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
    },
    education: [],
    experience: [],
    skills: [],
};

export function ResumeEditor() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>();
    const previewRef = useRef<HTMLDivElement>(null);

    // Step configuration
    const steps = [
        { title: 'Personal Info', description: 'Basic information and summary' },
        { title: 'Experience & Education', description: 'Work history and academic background' },
        { title: 'Skills & More', description: 'Skills, projects, and certifications' },
    ];

    // Keyboard shortcuts (Phase 5)
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const isMeta = e.metaKey || e.ctrlKey;
            if (!isMeta) return;

            // Prevent default browser save dialog
            if (e.key.toLowerCase() === 's') {
                e.preventDefault();
                exportToPDF();
                toast.success('Exporting PDF via shortcut');
                return;
            }

            if (e.shiftKey) {
                const k = e.key.toLowerCase();
                if (k === 'e') {
                    e.preventDefault();
                    addEducation();
                    toast.success('Added education entry');
                } else if (k === 'x') {
                    e.preventDefault();
                    addExperience();
                    toast.success('Added experience entry');
                } else if (k === 'k') {
                    e.preventDefault();
                    addSkill();
                    toast.success('Added skill');
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    // Fetch resume data
    useEffect(() => {
        const fetchResume = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const response = await api.get(`/resume/${id}`);
                // Parse content if it exists and is valid JSON
                if (response.data.content) {
                    try {
                        const parsedContent = JSON.parse(response.data.content);
                        setResumeData(parsedContent);
                    } catch {
                        // If not JSON, use default structure with title
                        setResumeData({ ...defaultResumeData, title: response.data.title });
                    }
                } else {
                    setResumeData({ ...defaultResumeData, title: response.data.title });
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load resume');
                toast.error('Failed to load resume');
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    // Auto-save with debounce
    const autoSave = useCallback(async () => {
        if (!id) return;
        try {
            setIsSaving(true);
            await api.put(`/resume/${id}`, {
                title: resumeData.title,
                template: resumeData.template,
                colorTheme: resumeData.theme,
                content: JSON.stringify(resumeData),
            });
            setLastSaved(new Date());
            console.log('✅ Auto-saved successfully at', new Date().toISOString());
        } catch (err) {
            console.error('❌ Auto-save failed:', err);
            toast.error('Failed to save changes', { duration: 2000 });
        } finally {
            setIsSaving(false);
        }
    }, [id, resumeData]);

    // Debounced auto-save
    useEffect(() => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            autoSave();
        }, 2000);

        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [resumeData, autoSave]);

    const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
        setResumeData((prev) => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value },
        }));
    };

    const addEducation = () => {
        const newEducation = {
            id: Date.now().toString(),
            degree: '',
            institution: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            gpa: '',
        };
        setResumeData((prev) => ({
            ...prev,
            education: [...prev.education, newEducation],
        }));
    };

    const updateEducation = (id: string, field: keyof ResumeData['education'][0], value: string) => {
        setResumeData((prev) => ({
            ...prev,
            education: prev.education.map((edu) =>
                edu.id === id ? { ...edu, [field]: value } : edu
            ),
        }));
    };

    const removeEducation = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            education: prev.education.filter((edu) => edu.id !== id),
        }));
    };

    const addExperience = () => {
        const newExperience = {
            id: Date.now().toString(),
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            description: '',
        };
        setResumeData((prev) => ({
            ...prev,
            experience: [...prev.experience, newExperience],
        }));
    };

    const updateExperience = (id: string, field: keyof ResumeData['experience'][0], value: string) => {
        setResumeData((prev) => ({
            ...prev,
            experience: prev.experience.map((exp) =>
                exp.id === id ? { ...exp, [field]: value } : exp
            ),
        }));
    };

    const removeExperience = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            experience: prev.experience.filter((exp) => exp.id !== id),
        }));
    };

    const addSkill = () => {
        const newSkill = {
            id: Date.now().toString(),
            name: '',
            proficiency: 'Intermediate' as const,
        };
        setResumeData((prev) => ({
            ...prev,
            skills: [...prev.skills, newSkill],
        }));
    };

    const updateSkill = (id: string, field: keyof ResumeData['skills'][0], value: string) => {
        setResumeData((prev) => ({
            ...prev,
            skills: prev.skills.map((skill) =>
                skill.id === id ? { ...skill, [field]: value } : skill
            ),
        }));
    };

    const removeSkill = (id: string) => {
        setResumeData((prev) => ({
            ...prev,
            skills: prev.skills.filter((skill) => skill.id !== id),
        }));
    };

    const exportToPDF = async () => {
        if (!previewRef.current) return;

        try {
            setIsExporting(true);
            toast.loading('Generating PDF...', { id: 'pdf-export' });

            // Capture the preview as canvas
            const canvas = await html2canvas(previewRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            // Calculate PDF dimensions (A4 size)
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

            // Download the PDF
            const fileName = `${resumeData.personalInfo.fullName || resumeData.title || 'resume'}.pdf`;
            pdf.save(fileName);

            toast.success('PDF downloaded successfully!', { id: 'pdf-export' });
        } catch (error) {
            console.error('PDF export failed:', error);
            toast.error('Failed to export PDF', { id: 'pdf-export' });
        } finally {
            setIsExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-gray-500">Loading resume...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <Button onClick={() => navigate('/dashboard')} variant="primary">
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/dashboard')}
                        aria-label="Back to dashboard"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </button>

                    <div className="flex items-center gap-4">
                        <Button
                            onClick={exportToPDF}
                            disabled={isExporting}
                            variant="primary"
                            className="flex items-center gap-2"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            {isExporting ? 'Exporting...' : 'Download PDF'}
                        </Button>
                        <div aria-live="polite" role="status" className="text-sm">
                            {lastSaved && !isSaving && (
                                <span className="text-green-600">
                                    Saved {new Date(lastSaved).toLocaleTimeString()}
                                </span>
                            )}
                            {isSaving && <span className="text-blue-600">Saving...</span>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Step Progress Indicator */}
                <div style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} className="rounded-lg shadow p-6 mb-6 border">
                    <div className="flex items-center justify-between mb-2">
                        <h3 style={{ color: 'var(--text)' }} className="text-sm font-medium">
                            Step {currentStep + 1} of {steps.length}
                        </h3>
                        <span style={{ color: 'var(--muted)' }} className="text-xs">
                            {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
                        </span>
                    </div>
                    <div className="mb-3">
                        <div style={{ background: 'var(--border)' }} className="w-full h-2 rounded-full overflow-hidden">
                            <div
                                className="h-full transition-all duration-300"
                                style={{
                                    background: 'var(--primary-600)',
                                    width: `${((currentStep + 1) / steps.length) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text)' }} className="text-lg font-semibold mb-1">
                            {steps[currentStep].title}
                        </h4>
                        <p style={{ color: 'var(--muted)' }} className="text-sm">
                            {steps[currentStep].description}
                        </p>
                    </div>
                </div>

                <div className={`grid grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_820px] gap-6 items-start ${editorStyles.editorGrid}`}>
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Resume Title */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Resume Title</h2>
                            <Input
                                value={resumeData.title}
                                onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                                placeholder="My Resume"
                            />
                        </div>

                        {/* Template & Theme Selection */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Design</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {/* Template Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Template
                                    </label>
                                    <select
                                        value={resumeData.template}
                                        onChange={(e) => setResumeData({ ...resumeData, template: e.target.value as TemplateName })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="modern">Modern</option>
                                        <option value="classic">Classic</option>
                                        <option value="minimal">Minimal</option>
                                        <option value="professional">Professional</option>
                                        <option value="creative">Creative</option>
                                    </select>
                                </div>

                                {/* Theme Selector */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Color Theme
                                    </label>
                                    <select
                                        value={resumeData.theme}
                                        onChange={(e) => setResumeData({ ...resumeData, theme: e.target.value as ThemeName })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    >
                                        <option value="blue">Blue</option>
                                        <option value="green">Green</option>
                                        <option value="purple">Purple</option>
                                        <option value="red">Red</option>
                                        <option value="orange">Orange</option>
                                        <option value="gray">Gray</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h2>
                            <div className="space-y-4">
                                <Input
                                    label="Full Name"
                                    value={resumeData.personalInfo.fullName}
                                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                                    placeholder="John Doe"
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={resumeData.personalInfo.email}
                                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                                    placeholder="john@example.com"
                                />
                                <Input
                                    label="Phone"
                                    value={resumeData.personalInfo.phone}
                                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                />
                                <Input
                                    label="Location"
                                    value={resumeData.personalInfo.location}
                                    onChange={(e) => updatePersonalInfo('location', e.target.value)}
                                    placeholder="New York, NY"
                                />
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        Professional Summary
                                    </label>
                                    <textarea
                                        value={resumeData.personalInfo.summary}
                                        onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                                        placeholder="Write a brief summary about yourself..."
                                        rows={3}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Education</h2>
                                <button
                                    onClick={addEducation}
                                    aria-label="Add education entry"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Add
                                </button>
                            </div>
                            <div className="space-y-4">
                                {resumeData.education.map((edu) => (
                                    <div key={edu.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Degree"
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                placeholder="Bachelor's"
                                            />
                                            <Input
                                                label="Institution"
                                                value={edu.institution}
                                                onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                                                placeholder="University Name"
                                            />
                                        </div>
                                        <Input
                                            label="Field of Study"
                                            value={edu.fieldOfStudy}
                                            onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)}
                                            placeholder="Computer Science"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Start Date"
                                                type="month"
                                                value={edu.startDate}
                                                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                            />
                                            <Input
                                                label="End Date"
                                                type="month"
                                                value={edu.endDate}
                                                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                            />
                                        </div>
                                        <Input
                                            label="GPA (Optional)"
                                            value={edu.gpa}
                                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                            placeholder="3.8"
                                        />
                                        <button
                                            onClick={() => removeEducation(edu.id)}
                                            aria-label="Remove education entry"
                                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Experience Section */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Experience</h2>
                                <button
                                    onClick={addExperience}
                                    aria-label="Add experience entry"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Add
                                </button>
                            </div>
                            <div className="space-y-4">
                                {resumeData.experience.map((exp) => (
                                    <div key={exp.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Job Title"
                                                value={exp.jobTitle}
                                                onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
                                                placeholder="Software Engineer"
                                            />
                                            <Input
                                                label="Company"
                                                value={exp.company}
                                                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                                placeholder="Company Name"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                label="Start Date"
                                                type="month"
                                                value={exp.startDate}
                                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                            />
                                            <Input
                                                label="End Date"
                                                type="month"
                                                value={exp.endDate}
                                                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                value={exp.description}
                                                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                                placeholder="Describe your responsibilities and achievements..."
                                                rows={3}
                                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeExperience(exp.id)}
                                            aria-label="Remove experience entry"
                                            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors text-sm"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Skills Section */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-slate-900">Skills</h2>
                                <button
                                    onClick={addSkill}
                                    aria-label="Add skill entry"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                    <PlusIcon className="h-5 w-5" />
                                    Add
                                </button>
                            </div>
                            <div className="space-y-3">
                                {resumeData.skills.map((skill) => (
                                    <div key={skill.id} className="flex items-end gap-3">
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <Input
                                                label="Skill"
                                                value={skill.name}
                                                onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                                placeholder="React"
                                            />
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                                    Proficiency
                                                </label>
                                                <select
                                                    value={skill.proficiency}
                                                    onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                >
                                                    <option>Beginner</option>
                                                    <option>Intermediate</option>
                                                    <option>Advanced</option>
                                                    <option>Expert</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeSkill(skill.id)}
                                            className="text-red-600 hover:text-red-700 transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Live Preview */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className={`sticky top-6 max-h-[calc(100vh-96px)] overflow-auto px-2 ${editorStyles.previewAside}`}
                        aria-label="Resume preview"
                    >
                        <div ref={previewRef} className={`a4-sheet mx-auto shrink-0 ${previewStyles.sheet}`}>
                            <ResumePreview data={resumeData} />
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}
