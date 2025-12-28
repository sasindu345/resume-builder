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
    const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
    const [expandedEducationId, setExpandedEducationId] = useState<string | null>(null);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
    const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

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

    const steps = [
        { title: 'Title & Design', description: 'Choose a title, template, and color' },
        { title: 'Personal Info', description: 'Basic information and summary' },
        { title: 'Experience', description: 'Work history and details' },
        { title: 'Education', description: 'Academic background' },
        { title: 'Skills', description: 'Professional skills and proficiency' },
    ];

    const addSkill = useCallback(() => {
        const trimmedName = newSkillName.trim();
        if (!trimmedName) {
            toast.error('Please enter a skill name');
            return;
        }

        const newSkill = {
            id: Date.now().toString(),
            name: trimmedName,
            proficiency: newSkillLevel,
        };

        setResumeData((prev) => ({
            ...prev,
            skills: [...prev.skills, newSkill],
        }));

        setNewSkillName('');
        setNewSkillLevel('Intermediate');
    }, [newSkillName, newSkillLevel]);

    const addEducation = useCallback(() => {
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
    }, []);

    const addExperience = useCallback(() => {
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
    }, []);

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
    }, [addEducation, addExperience, addSkill]);

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

            const imgWidth = 210;
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

    const handleFinishOrNext = async () => {
        if (currentStep === steps.length - 1) {
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

            <div className="max-w-7xl mx-auto p-2 sm:p-3">
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
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                    >
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
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                                                Template Style
                                            </label>
                                            <select
                                                value={resumeData.template}
                                                onChange={(e) => setResumeData({ ...resumeData, template: e.target.value as TemplateName })}
                                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                            >
                                                {Object.entries(TEMPLATES).map(([key, config]) => (
                                                    <option key={key} value={key}>
                                                        {config.displayName}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
                                                Choose a layout style that best suits your professional profile
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>
                                                Color Theme
                                            </label>
                                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                                {Object.entries(THEMES).map(([key, theme]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => setResumeData({ ...resumeData, theme: key as ThemeName })}
                                                        className="flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all hover:scale-105"
                                                        style={{
                                                            borderColor: resumeData.theme === key ? theme.primary : 'var(--border)',
                                                            background: resumeData.theme === key ? `${theme.primary}10` : 'var(--surface)',
                                                        }}
                                                        title={key.charAt(0).toUpperCase() + key.slice(1)}
                                                    >
                                                        <div
                                                            className="w-8 h-8 rounded-full shadow-sm"
                                                            style={{ background: theme.primary }}
                                                        />
                                                        <span className="text-xs font-medium capitalize" style={{ color: 'var(--text)' }}>
                                                            {key}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                            <p className="text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
                                                Select a color scheme to personalize your resume
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

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
                                <div style={{ maxHeight: '65vh', overflowY: 'auto' }} className="space-y-2 pr-1">
                                    {resumeData.experience.map((exp) => {
                                        const expanded = expandedExperienceId === exp.id;
                                        return (
                                            <div key={exp.id} className="border rounded-lg" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                                <button
                                                    type="button"
                                                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-t-lg"
                                                    style={{ color: 'var(--text)', fontWeight: 500, outline: 'none', borderBottom: expanded ? '1px solid var(--border)' : 'none' }}
                                                    onClick={() => setExpandedExperienceId(expanded ? null : exp.id)}
                                                >
                                                    <span>
                                                        {exp.jobTitle || <span className="italic text-slate-400">(No title)</span>} — {exp.company || <span className="italic text-slate-400">(No company)</span>}
                                                        <span className="ml-2 text-xs text-slate-500">{exp.startDate} - {exp.endDate || 'Present'}</span>
                                                    </span>
                                                    <span className="ml-2 text-xs text-blue-600">{expanded ? 'Collapse' : 'Expand'}</span>
                                                </button>
                                                {expanded && (
                                                    <div className="p-4 space-y-3">
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
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Start Date</label>
                                                                <input
                                                                    type="month"
                                                                    value={exp.startDate}
                                                                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>End Date</label>
                                                                <input
                                                                    type="month"
                                                                    value={exp.endDate}
                                                                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                                                    placeholder="Leave empty for current"
                                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                                                />
                                                            </div>
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
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

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
                                <div style={{ maxHeight: '65vh', overflowY: 'auto' }} className="space-y-2 pr-1">
                                    {resumeData.education.map((edu) => {
                                        const expanded = expandedEducationId === edu.id;
                                        return (
                                            <div key={edu.id} className="border rounded-lg" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                                <button
                                                    type="button"
                                                    className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 transition-colors rounded-t-lg"
                                                    style={{ color: 'var(--text)', fontWeight: 500, outline: 'none', borderBottom: expanded ? '1px solid var(--border)' : 'none' }}
                                                    onClick={() => setExpandedEducationId(expanded ? null : edu.id)}
                                                >
                                                    <span>
                                                        {edu.degree || <span className="italic text-slate-400">(No degree)</span>} — {edu.institution || <span className="italic text-slate-400">(No institution)</span>}
                                                        <span className="ml-2 text-xs text-slate-500">{edu.startDate} - {edu.endDate || 'Present'}</span>
                                                    </span>
                                                    <span className="ml-2 text-xs text-blue-600">{expanded ? 'Collapse' : 'Expand'}</span>
                                                </button>
                                                {expanded && (
                                                    <div className="p-4 space-y-3">
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
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Start Date</label>
                                                                <input
                                                                    type="month"
                                                                    value={edu.startDate}
                                                                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>End Date</label>
                                                                <input
                                                                    type="month"
                                                                    value={edu.endDate}
                                                                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                                                />
                                                            </div>
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
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Skills</h2>

                                <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input
                                            type="text"
                                            value={newSkillName}
                                            onChange={(e) => setNewSkillName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addSkill();
                                                }
                                            }}
                                            placeholder="Skill name (e.g., JavaScript)"
                                            className="flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                        />
                                        <select
                                            value={newSkillLevel}
                                            onChange={(e) => setNewSkillLevel(e.target.value as typeof newSkillLevel)}
                                            className="px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                        <button
                                            onClick={addSkill}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills.map((skill) => {
                                        const isEditing = editingSkillId === skill.id;

                                        if (isEditing) {
                                            return (
                                                <div key={skill.id} className="flex items-center gap-2 bg-blue-50 border-2 border-blue-400 rounded-full px-3 py-1">
                                                    <input
                                                        type="text"
                                                        value={skill.name}
                                                        onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                setEditingSkillId(null);
                                                            }
                                                            if (e.key === 'Escape') {
                                                                setEditingSkillId(null);
                                                            }
                                                        }}
                                                        className="w-32 px-2 py-0.5 rounded text-sm border-0 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        style={{ background: 'white', color: 'var(--text)' }}
                                                        autoFocus
                                                    />
                                                    <select
                                                        value={skill.proficiency}
                                                        onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                                                        className="text-xs px-1 py-0.5 rounded border-0 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        style={{ background: 'white', color: 'var(--text)' }}
                                                    >
                                                        <option value="Beginner">Beginner</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                        <option value="Advanced">Advanced</option>
                                                        <option value="Expert">Expert</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setEditingSkillId(null)}
                                                        className="text-green-600 hover:text-green-700 transition-colors text-xs font-medium"
                                                        title="Done editing"
                                                    >
                                                        ✓
                                                    </button>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div
                                                key={skill.id}
                                                className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 group hover:bg-slate-200 transition-colors cursor-pointer"
                                                onClick={() => setEditingSkillId(skill.id)}
                                                title="Click to edit"
                                            >
                                                <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>
                                                    {skill.name}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    {skill.proficiency}
                                                </span>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeSkill(skill.id);
                                                    }}
                                                    className="text-red-600 hover:text-red-700 transition-colors ml-1 opacity-0 group-hover:opacity-100"
                                                    style={{ lineHeight: 1 }}
                                                    title="Remove skill"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {resumeData.skills.length === 0 && (
                                    <p className="text-sm text-slate-400 italic mt-2">
                                        No skills added yet. Use the form above to add your first skill.
                                    </p>
                                )}
                            </div>
                        )}

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