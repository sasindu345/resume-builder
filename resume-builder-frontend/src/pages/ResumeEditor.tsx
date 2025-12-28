import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeftIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ResumePreview } from '@/components/resume-editor/ResumePreview';
import { motion } from 'framer-motion';
import { TemplateName, ThemeName, TEMPLATES, THEMES } from '@/types/template';
import { TemplateIcon } from '@/components/common/TemplateIcon';
import { ColorSwatch } from '@/components/common/ColorSwatch';
import editorStyles from '../styles/pages/ResumeEditor.module.css';
import previewStyles from '../styles/editor/ResumePreview.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ✅ FIXED: Extended interface to include all fields used in UI
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
        // ✅ ADDED: Fields that were previously untyped
        responsibilities?: string;
        technologies?: string;
        achievements?: string;
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

    // ✅ FIXED: Step configuration now matches actual rendering logic
    const steps = [
        { title: 'Title & Design', description: 'Choose a title, template, and color' },
        { title: 'Personal Info', description: 'Basic information and summary' },
        { title: 'Experience', description: 'Work history and details' },
        { title: 'Education', description: 'Academic background' },
        { title: 'Skills', description: 'Professional skills and proficiency' },
    ];

    // Keyboard shortcuts
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            const isMeta = e.metaKey || e.ctrlKey;
            if (!isMeta) return;

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
                if (response.data.content) {
                    try {
                        const parsedContent = JSON.parse(response.data.content);
                        setResumeData(parsedContent);
                    } catch {
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
            responsibilities: '',
            technologies: '',
            achievements: '',
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

            const canvas = await html2canvas(previewRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
            });

            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

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

    // ✅ FIXED: Handle finish action properly
    const handleFinishOrNext = async () => {
        if (currentStep === steps.length - 1) {
            // Final step - ensure save then navigate
            await autoSave();
            toast.success('Resume saved successfully!');
            navigate('/dashboard');
        } else {
            setCurrentStep(currentStep + 1);
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
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
            {/* Header */}
            <div className="sticky top-0 z-40 border-b shadow-sm" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
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
            <div className="max-w-7xl mx-auto p-2 sm:p-3">
                {/* Step Progress Indicator */}
                <div style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} className="rounded-lg shadow p-3 sm:p-4 mb-3 sm:mb-4 border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 style={{ color: 'var(--text)' }} className="text-xs sm:text-sm font-medium">
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
                        <h4 style={{ color: 'var(--text)' }} className="text-base sm:text-lg font-semibold mb-1">
                            {steps[currentStep].title}
                        </h4>
                        <p style={{ color: 'var(--muted)' }} className="text-xs sm:text-sm">
                            {steps[currentStep].description}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_820px] gap-6 items-start">
                    {/* Left: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
                        {/* ✅ FIXED: Step 0 - Title & Design ONLY */}
                        {currentStep === 0 && (
                            <>
                                <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Resume Title</h2>
                                    <Input
                                        value={resumeData.title}
                                        onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                                        placeholder="My Resume"
                                    />
                                </div>

                                <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Design</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                                                Template
                                            </label>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.entries(TEMPLATES).map(([key, config]) => (
                                                    <TemplateIcon
                                                        key={key}
                                                        icon={<span style={{ fontSize: 20 }}>{config.displayName[0]}</span>}
                                                        selected={resumeData.template === key}
                                                        onClick={() => setResumeData({ ...resumeData, template: key as TemplateName })}
                                                        label={config.displayName}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                                                Color Theme
                                            </label>
                                            <div className="flex gap-2 flex-wrap">
                                                {Object.entries(THEMES).map(([key, theme]) => (
                                                    <ColorSwatch
                                                        key={key}
                                                        color={theme.primary}
                                                        selected={resumeData.theme === key}
                                                        onClick={() => setResumeData({ ...resumeData, theme: key as ThemeName })}
                                                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ✅ FIXED: Step 1 - Personal Information ONLY */}
                        {currentStep === 1 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Personal Information</h2>
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
                                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                                            Professional Summary
                                        </label>
                                        <textarea
                                            value={resumeData.personalInfo.summary}
                                            onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                                            placeholder="Write a brief summary about yourself..."
                                            rows={3}
                                            className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ✅ FIXED: Step 2 - Experience ONLY */}
                        {currentStep === 2 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Experience</h2>
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
                                        <div key={exp.id} className="border rounded-lg p-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
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
                                                    placeholder="Leave empty for current"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                                                    Description
                                                </label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                                    placeholder="Brief overview of your role..."
                                                    rows={2}
                                                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                                                    Key Responsibilities
                                                </label>
                                                <textarea
                                                    value={exp.responsibilities || ''}
                                                    onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)}
                                                    placeholder="Main responsibilities and duties..."
                                                    rows={2}
                                                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                                />
                                            </div>
                                            <Input
                                                label="Technologies Used"
                                                value={exp.technologies || ''}
                                                onChange={(e) => updateExperience(exp.id, 'technologies', e.target.value)}
                                                placeholder="e.g. React, Node.js, AWS"
                                            />
                                            <div>
                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                                                    Key Achievements
                                                </label>
                                                <textarea
                                                    value={exp.achievements || ''}
                                                    onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value)}
                                                    placeholder="Measurable achievements and impact..."
                                                    rows={2}
                                                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
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
                        )}

                        {/* ✅ FIXED: Step 3 - Education ONLY */}
                        {currentStep === 3 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Education</h2>
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
                                        <div key={edu.id} className="p-4 border rounded-lg space-y-3" style={{ borderColor: 'var(--border)' }}>
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
                                                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}// Continuing from Step 3 Education section...
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
                        )}

                        {/* ✅ FIXED: Step 4 - Skills ONLY */}
                        {currentStep === 4 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Skills</h2>
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
                                                    <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                                                        Proficiency
                                                    </label>
                                                    <select
                                                        value={skill.proficiency}
                                                        onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                                                        className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                                        style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
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
                        )}

                        {/* Navigation Buttons */}
                        <div style={{ background: 'var(--surface)', borderColor: 'var(--border)' }} className="rounded-lg shadow p-3 sm:p-4 border">
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                                <button
                                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                                    disabled={currentStep === 0}
                                    style={{
                                        background: currentStep === 0 ? 'var(--muted)' : 'var(--primary-600)',
                                        color: '#ffffff',
                                        opacity: currentStep === 0 ? 0.5 : 1,
                                    }}
                                    className="px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-all disabled:cursor-not-allowed order-2 sm:order-1"
                                >
                                    Previous
                                </button>
                                <span style={{ color: 'var(--muted)' }} className="text-xs sm:text-sm text-center order-1 sm:order-2">
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                                <button
                                    onClick={handleFinishOrNext}
                                    style={{
                                        background: 'var(--primary-600)',
                                        color: '#ffffff',
                                    }}
                                    className="px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-all hover:opacity-90 order-3"
                                >
                                    {currentStep === steps.length - 1 ? 'Finish & Save' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* ✅ FIXED: Preview layout - removed sticky, removed max-height, removed internal scroll */}
                    <motion.aside
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="px-2"
                        aria-label="Resume preview"
                    >
                        <div
                            ref={previewRef}
                            className={`a4-sheet mx-auto ${previewStyles.sheet}`}
                            style={{
                                width: '210mm',
                                minHeight: '297mm',
                                background: '#ffffff',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        >
                            <ResumePreview data={resumeData} />
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}