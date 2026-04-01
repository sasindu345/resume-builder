import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDownTrayIcon, PlusIcon, TrashIcon, SparklesIcon, UserCircleIcon, LockClosedIcon, EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ResumePreview } from '@/components/resume-editor/ResumePreview';
import { motion } from 'framer-motion';
import { TemplateName, ThemeName, TEMPLATES, THEMES } from '@/types/template';
import previewStyles from '../styles/editor/ResumePreview.module.css';
import { exportResumePDF } from '@/utils/exportPdf';
import { useAuth } from '@/hooks/useAuth';
import { uploadImageUnsigned } from '@/services/cloudinaryService';

const STORAGE_KEY = 'rb_guest_resume';

export interface GuestResumeData {
    title: string;
    template: TemplateName;
    theme: ThemeName;
    personalInfo: {
        fullName: string;
        jobTitle: string;
        email: string;
        phone: string;
        location: string;
        linkedin: string;
        github: string;
        portfolio: string;
        summary: string;
        profileImage: string;
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
    projects: Array<{
        id: string;
        name: string;
        description: string;
        technologies: string;
        link: string;
        startDate: string;
        endDate: string;
    }>;
    certifications: Array<{
        id: string;
        name: string;
        issuer: string;
        date: string;
        credentialUrl: string;
    }>;
    languages: Array<{
        id: string;
        language: string;
        proficiency: 'Native' | 'Fluent' | 'Intermediate' | 'Basic';
    }>;
}

const defaultResumeData: GuestResumeData = {
    title: 'My Resume',
    template: 'modern',
    theme: 'blue',
    personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        summary: '',
        profileImage: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
};

/**
 * Guest Resume Builder — accessible without sign in.
 * Data is persisted to localStorage. Premium features (AI Review, watermark-free PDF)
 * prompt the user to sign up.
 */
export function GuestResumeBuilder() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [resumeData, setResumeData] = useState<GuestResumeData>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults so old localStorage data missing new fields doesn't crash
                return {
                    ...defaultResumeData,
                    ...parsed,
                    personalInfo: { ...defaultResumeData.personalInfo, ...parsed.personalInfo },
                    projects: parsed.projects || [],
                    certifications: parsed.certifications || [],
                    languages: parsed.languages || [],
                };
            }
            return defaultResumeData;
        } catch {
            return defaultResumeData;
        }
    });

    const [currentStep, setCurrentStep] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const [expandedExperienceId, setExpandedExperienceId] = useState<string | null>(null);
    const [expandedEducationId, setExpandedEducationId] = useState<string | null>(null);
    const [newSkillName, setNewSkillName] = useState('');
    const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
    const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const steps = [
        { title: 'Title & Design', description: 'Choose a title, template, and color' },
        { title: 'Personal Info', description: 'Basic information, links, and summary' },
        { title: 'Experience', description: 'Work history and achievements' },
        { title: 'Education', description: 'Academic background' },
        { title: 'Skills', description: 'Professional skills and proficiency' },
        { title: 'Projects', description: 'Personal or professional projects' },
        { title: 'Additional', description: 'Certifications and languages' },
    ];

    // Auto-save to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
        } catch {
            // Storage full or unavailable
        }
    }, [resumeData]);

    const updatePersonalInfo = (field: keyof GuestResumeData['personalInfo'], value: string) => {
        setResumeData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [field]: value },
        }));
    };

    const addExperience = useCallback(() => {
        setResumeData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                id: Date.now().toString(),
                jobTitle: '', company: '', startDate: '', endDate: '',
                description: '', responsibilities: '', technologies: '', achievements: '',
            }],
        }));
    }, []);

    const updateExperience = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp),
        }));
    };

    const removeExperience = (id: string) => {
        setResumeData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
    };

    const addEducation = useCallback(() => {
        setResumeData(prev => ({
            ...prev,
            education: [...prev.education, {
                id: Date.now().toString(),
                degree: '', institution: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '',
            }],
        }));
    }, []);

    const updateEducation = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu),
        }));
    };

    const removeEducation = (id: string) => {
        setResumeData(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
    };

    const addSkill = useCallback(() => {
        const trimmedName = newSkillName.trim();
        if (!trimmedName) { toast.error('Please enter a skill name'); return; }
        setResumeData(prev => ({
            ...prev,
            skills: [...prev.skills, { id: Date.now().toString(), name: trimmedName, proficiency: newSkillLevel }],
        }));
        setNewSkillName('');
        setNewSkillLevel('Intermediate');
    }, [newSkillName, newSkillLevel]);

    const updateSkill = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s),
        }));
    };

    const removeSkill = (id: string) => {
        setResumeData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));
    };

    // ── Projects CRUD ──
    const addProject = useCallback(() => {
        setResumeData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                id: Date.now().toString(),
                name: '', description: '', technologies: '', link: '', startDate: '', endDate: '',
            }],
        }));
    }, []);

    const updateProject = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p),
        }));
    };

    const removeProject = (id: string) => {
        setResumeData(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
    };

    // ── Certifications CRUD ──
    const addCertification = useCallback(() => {
        setResumeData(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                id: Date.now().toString(),
                name: '', issuer: '', date: '', credentialUrl: '',
            }],
        }));
    }, []);

    const updateCertification = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            certifications: prev.certifications.map(c => c.id === id ? { ...c, [field]: value } : c),
        }));
    };

    const removeCertification = (id: string) => {
        setResumeData(prev => ({ ...prev, certifications: prev.certifications.filter(c => c.id !== id) }));
    };

    // ── Languages CRUD ──
    const addLanguage = useCallback(() => {
        setResumeData(prev => ({
            ...prev,
            languages: [...prev.languages, {
                id: Date.now().toString(),
                language: '', proficiency: 'Intermediate' as const,
            }],
        }));
    }, []);

    const updateLanguage = (id: string, field: string, value: string) => {
        setResumeData(prev => ({
            ...prev,
            languages: prev.languages.map(l => l.id === id ? { ...l, [field]: value } : l),
        }));
    };

    const removeLanguage = (id: string) => {
        setResumeData(prev => ({ ...prev, languages: prev.languages.filter(l => l.id !== id) }));
    };

    // Profile image upload (unsigned Cloudinary)
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image must be less than 5MB');
            return;
        }

        try {
            setIsUploadingImage(true);
            const url = await uploadImageUnsigned(file);
            updatePersonalInfo('profileImage', url);
            toast.success('Profile image uploaded!');
        } catch {
            toast.error('Failed to upload image. Check Cloudinary config.');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const exportToPDF = async () => {
        try {
            setIsExporting(true);
            toast.loading('Preparing PDF...', { id: 'pdf-export' });

            const fileName = resumeData.personalInfo.fullName || resumeData.title || 'resume';
            await exportResumePDF(previewRef, fileName);

            toast.success('Print dialog opened. Save or share it as a PDF.', { id: 'pdf-export' });
        } catch (error) {
            console.error('[PDF Export] Failed:', error);
            const msg = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`PDF export failed: ${msg}`, { id: 'pdf-export' });
        } finally {
            setIsExporting(false);
        }
    };

    const handlePremiumAction = (action: string) => {
        toast((t) => (
            <div className="flex flex-col gap-2">
                <p className="font-medium">🔒 {action} is a premium feature</p>
                <p className="text-sm text-gray-500">Sign up to unlock AI reviews, unlimited resumes, and more.</p>
                <div className="flex gap-2 mt-1">
                    <button
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                        onClick={() => { toast.dismiss(t.id); navigate('/register'); }}
                    >
                        Sign Up Free
                    </button>
                    <button
                        className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Not now
                    </button>
                </div>
            </div>
        ), { duration: 8000 });
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
            {/* Top Bar */}
            <div className="sticky top-0 z-40 border-b shadow-sm" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                            style={{ color: 'var(--text)' }}
                            aria-label="Back to home"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            <span className="hidden sm:inline">Home</span>
                        </button>
                        <span className="px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-semibold rounded-full hidden sm:inline">
                            Guest Mode
                        </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
                        {/* Mobile Preview Toggle */}
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors"
                            style={{ background: showPreview ? 'var(--primary-600)' : 'var(--bg)', color: showPreview ? '#fff' : 'var(--text)', border: '1px solid var(--border)' }}
                        >
                            {showPreview ? <PencilSquareIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            <span className="hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
                        </button>
                        {!isAuthenticated && (
                            <button
                                onClick={() => handlePremiumAction('AI CV Review')}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                            >
                                <SparklesIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">AI Review</span>
                            </button>
                        )}
                        <Button onClick={exportToPDF} disabled={isExporting} variant="primary" className="flex items-center gap-2">
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            <span className="hidden sm:inline">{isExporting ? 'Exporting...' : 'Download PDF'}</span>
                        </Button>
                        {!isAuthenticated && (
                            <button
                                onClick={() => navigate('/register')}
                                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <LockClosedIcon className="h-4 w-4" />
                                Save & Unlock
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-2 sm:p-3">
                {/* Progress Bar */}
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
                                style={{ background: 'var(--primary-600)', width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text)' }} className="text-base sm:text-lg font-semibold mb-1">{steps[currentStep].title}</h4>
                        <p style={{ color: 'var(--muted)' }} className="text-xs sm:text-sm">{steps[currentStep].description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_820px] gap-6 items-start">
                    {/* Editor - hide on mobile when preview is shown */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className={`space-y-4 ${showPreview ? 'hidden lg:block' : ''}`}>
                        {/* Step 0 — Title & Design */}
                        {currentStep === 0 && (
                            <>
                                <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Resume Title</h2>
                                    <Input value={resumeData.title} onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })} placeholder="My Resume" />
                                </div>
                                <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                    <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Design</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Template Style</label>
                                            <select
                                                value={resumeData.template}
                                                onChange={(e) => setResumeData({ ...resumeData, template: e.target.value as TemplateName })}
                                                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                                                style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                            >
                                                {Object.entries(TEMPLATES).map(([key, config]) => (
                                                    <option key={key} value={key}>{config.displayName}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Color Theme</label>
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
                                                    >
                                                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ background: theme.primary }} />
                                                        <span className="text-xs font-medium capitalize" style={{ color: 'var(--text)' }}>{key}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Step 1 — Personal Info with Profile Image */}
                        {currentStep === 1 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Personal Information</h2>
                                <div className="space-y-4">
                                    {/* Profile Image Upload */}
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="relative w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden cursor-pointer hover:border-blue-400 transition-colors"
                                            style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {resumeData.personalInfo.profileImage ? (
                                                <img src={resumeData.personalInfo.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserCircleIcon className="w-10 h-10" style={{ color: 'var(--muted)' }} />
                                            )}
                                            {isUploadingImage && (
                                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                                                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full" />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>Profile Photo</p>
                                            <p className="text-xs" style={{ color: 'var(--muted)' }}>Click to upload (optional, max 5MB)</p>
                                            {resumeData.personalInfo.profileImage && (
                                                <button
                                                    onClick={() => updatePersonalInfo('profileImage', '')}
                                                    className="text-xs text-red-500 hover:text-red-600 mt-1"
                                                >
                                                    Remove photo
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </div>

                                    <Input label="Full Name" value={resumeData.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} placeholder="John Doe" />
                                    <Input label="Professional Title" value={resumeData.personalInfo.jobTitle} onChange={(e) => updatePersonalInfo('jobTitle', e.target.value)} placeholder="e.g. Software Engineer, Product Designer" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="Email" type="email" value={resumeData.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="john@example.com" />
                                        <Input label="Phone" value={resumeData.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="+1 (555) 000-0000" />
                                    </div>
                                    <Input label="Location" value={resumeData.personalInfo.location} onChange={(e) => updatePersonalInfo('location', e.target.value)} placeholder="New York, NY" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Input label="LinkedIn (optional)" value={resumeData.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                                        <Input label="GitHub (optional)" value={resumeData.personalInfo.github} onChange={(e) => updatePersonalInfo('github', e.target.value)} placeholder="github.com/johndoe" />
                                    </div>
                                    <Input label="Portfolio / Website (optional)" value={resumeData.personalInfo.portfolio} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} placeholder="johndoe.com" />
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Professional Summary</label>
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

                        {/* Step 2 — Experience */}
                        {currentStep === 2 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Experience</h2>
                                    <button onClick={addExperience} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                        <PlusIcon className="h-5 w-5" /> Add
                                    </button>
                                </div>
                                <div style={{ maxHeight: '65vh', overflowY: 'auto' }} className="space-y-2 pr-1">
                                    {resumeData.experience.map((exp) => {
                                        const expanded = expandedExperienceId === exp.id;
                                        return (
                                            <div key={exp.id} className="border rounded-lg" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                                <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-blue-50 transition-colors rounded-t-lg"
                                                    style={{ color: 'var(--text)', fontWeight: 500 }}
                                                    onClick={() => setExpandedExperienceId(expanded ? null : exp.id)}>
                                                    <span>{exp.jobTitle || <span className="italic text-slate-400">(No title)</span>} — {exp.company || <span className="italic text-slate-400">(No company)</span>}</span>
                                                    <span className="ml-2 text-xs text-blue-600">{expanded ? 'Collapse' : 'Expand'}</span>
                                                </button>
                                                {expanded && (
                                                    <div className="p-4 space-y-3">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Input label="Job Title" value={exp.jobTitle} onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)} placeholder="Software Engineer" />
                                                            <Input label="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company Name" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Start Date</label>
                                                                <input type="month" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>End Date</label>
                                                                <input type="month" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Description</label>
                                                            <textarea value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="Brief overview of your role..." rows={2} className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                        </div>
                                                        <Input label="Technologies Used" value={exp.technologies || ''} onChange={(e) => updateExperience(exp.id, 'technologies', e.target.value)} placeholder="e.g. React, Node.js, AWS" />
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Key Achievements</label>
                                                            <textarea value={exp.achievements || ''} onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value)} placeholder="Measurable achievements..." rows={2} className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                        </div>
                                                        <button onClick={() => removeExperience(exp.id)} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
                                                            <TrashIcon className="h-4 w-4" /> Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 3 — Education */}
                        {currentStep === 3 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Education</h2>
                                    <button onClick={addEducation} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                        <PlusIcon className="h-5 w-5" /> Add
                                    </button>
                                </div>
                                <div style={{ maxHeight: '65vh', overflowY: 'auto' }} className="space-y-2 pr-1">
                                    {resumeData.education.map((edu) => {
                                        const expanded = expandedEducationId === edu.id;
                                        return (
                                            <div key={edu.id} className="border rounded-lg" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                                <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-blue-50 transition-colors rounded-t-lg"
                                                    style={{ color: 'var(--text)', fontWeight: 500 }}
                                                    onClick={() => setExpandedEducationId(expanded ? null : edu.id)}>
                                                    <span>{edu.degree || <span className="italic text-slate-400">(No degree)</span>} — {edu.institution || <span className="italic text-slate-400">(No institution)</span>}</span>
                                                    <span className="ml-2 text-xs text-blue-600">{expanded ? 'Collapse' : 'Expand'}</span>
                                                </button>
                                                {expanded && (
                                                    <div className="p-4 space-y-3">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <Input label="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} placeholder="Bachelor's" />
                                                            <Input label="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} placeholder="University Name" />
                                                        </div>
                                                        <Input label="Field of Study" value={edu.fieldOfStudy} onChange={(e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Start Date</label>
                                                                <input type="month" value={edu.startDate} onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>End Date</label>
                                                                <input type="month" value={edu.endDate} onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                            </div>
                                                        </div>
                                                        <Input label="GPA (Optional)" value={edu.gpa || ''} onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)} placeholder="3.8" />
                                                        <button onClick={() => removeEducation(edu.id)} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
                                                            <TrashIcon className="h-4 w-4" /> Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 4 — Skills */}
                        {currentStep === 4 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>Skills</h2>
                                <div className="mb-4 p-3 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}>
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        <input type="text" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                            placeholder="Skill name (e.g., JavaScript)"
                                            className="flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                        />
                                        <select value={newSkillLevel} onChange={(e) => setNewSkillLevel(e.target.value as typeof newSkillLevel)}
                                            className="px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
                                            <option value="Beginner">Beginner</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                            <option value="Expert">Expert</option>
                                        </select>
                                        <button onClick={addSkill} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium whitespace-nowrap">
                                            <PlusIcon className="h-4 w-4" /> Add
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {resumeData.skills.map((skill) => {
                                        const isEditing = editingSkillId === skill.id;
                                        if (isEditing) {
                                            return (
                                                <div key={skill.id} className="flex items-center gap-2 bg-blue-50 border-2 border-blue-400 rounded-full px-3 py-1">
                                                    <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                                                        onKeyDown={(e) => { if (e.key === 'Enter') setEditingSkillId(null); if (e.key === 'Escape') setEditingSkillId(null); }}
                                                        className="w-32 px-2 py-0.5 rounded text-sm border-0 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        style={{ background: 'white', color: 'var(--text)' }} autoFocus />
                                                    <select value={skill.proficiency} onChange={(e) => updateSkill(skill.id, 'proficiency', e.target.value)}
                                                        className="text-xs px-1 py-0.5 rounded border-0 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        style={{ background: 'white', color: 'var(--text)' }}>
                                                        <option value="Beginner">Beginner</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                        <option value="Advanced">Advanced</option>
                                                        <option value="Expert">Expert</option>
                                                    </select>
                                                    <button onClick={() => setEditingSkillId(null)} className="text-green-600 hover:text-green-700 text-xs font-medium">✓</button>
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={skill.id} className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1 group hover:bg-slate-200 transition-colors cursor-pointer"
                                                onClick={() => setEditingSkillId(skill.id)}>
                                                <span className="font-medium text-sm" style={{ color: 'var(--text)' }}>{skill.name}</span>
                                                <span className="text-xs text-slate-500">{skill.proficiency}</span>
                                                <button onClick={(e) => { e.stopPropagation(); removeSkill(skill.id); }}
                                                    className="text-red-600 hover:text-red-700 ml-1 opacity-0 group-hover:opacity-100" title="Remove skill">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                {resumeData.skills.length === 0 && (
                                    <p className="text-sm text-slate-400 italic mt-2">No skills added yet.</p>
                                )}
                            </div>
                        )}

                        {/* Step 5 — Projects */}
                        {currentStep === 5 && (
                            <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Projects</h2>
                                    <button onClick={addProject} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                        <PlusIcon className="h-5 w-5" /> Add
                                    </button>
                                </div>
                                <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>Add personal, academic, or professional projects to showcase your practical skills.</p>
                                <div style={{ maxHeight: '65vh', overflowY: 'auto' }} className="space-y-2 pr-1">
                                    {resumeData.projects.map((proj) => {
                                        const expanded = expandedProjectId === proj.id;
                                        return (
                                            <div key={proj.id} className="border rounded-lg" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
                                                <button type="button" className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-blue-50 transition-colors rounded-t-lg"
                                                    style={{ color: 'var(--text)', fontWeight: 500 }}
                                                    onClick={() => setExpandedProjectId(expanded ? null : proj.id)}>
                                                    <span>{proj.name || <span className="italic text-slate-400">(Untitled project)</span>}</span>
                                                    <span className="ml-2 text-xs text-blue-600">{expanded ? 'Collapse' : 'Expand'}</span>
                                                </button>
                                                {expanded && (
                                                    <div className="p-4 space-y-3">
                                                        <Input label="Project Name" value={proj.name} onChange={(e) => updateProject(proj.id, 'name', e.target.value)} placeholder="My Awesome App" />
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Description</label>
                                                            <textarea value={proj.description} onChange={(e) => updateProject(proj.id, 'description', e.target.value)} placeholder="What the project does, your role, impact..." rows={3} className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                        </div>
                                                        <Input label="Technologies" value={proj.technologies} onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)} placeholder="React, Node.js, PostgreSQL" />
                                                        <Input label="Link (optional)" value={proj.link} onChange={(e) => updateProject(proj.id, 'link', e.target.value)} placeholder="github.com/user/project" />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Start Date</label>
                                                                <input type="month" value={proj.startDate} onChange={(e) => updateProject(proj.id, 'startDate', e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>End Date</label>
                                                                <input type="month" value={proj.endDate} onChange={(e) => updateProject(proj.id, 'endDate', e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                            </div>
                                                        </div>
                                                        <button onClick={() => removeProject(proj.id)} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
                                                            <TrashIcon className="h-4 w-4" /> Remove
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {resumeData.projects.length === 0 && (
                                        <p className="text-sm text-slate-400 italic">No projects added yet. Click "Add" to get started.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 6 — Additional (Certifications + Languages) */}
                        {currentStep === 6 && (
                            <div className="space-y-4">
                                {/* Certifications */}
                                <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Certifications</h2>
                                        <button onClick={addCertification} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                            <PlusIcon className="h-5 w-5" /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {resumeData.certifications.map((cert) => (
                                            <div key={cert.id} className="p-3 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    <Input label="Certificate Name" value={cert.name} onChange={(e) => updateCertification(cert.id, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
                                                    <Input label="Issuing Organization" value={cert.issuer} onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 mb-2">
                                                    <div>
                                                        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Date Obtained</label>
                                                        <input type="month" value={cert.date} onChange={(e) => updateCertification(cert.id, 'date', e.target.value)} className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm" style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }} />
                                                    </div>
                                                    <Input label="Credential URL (optional)" value={cert.credentialUrl} onChange={(e) => updateCertification(cert.id, 'credentialUrl', e.target.value)} placeholder="credential.net/abc123" />
                                                </div>
                                                <button onClick={() => removeCertification(cert.id)} className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm">
                                                    <TrashIcon className="h-4 w-4" /> Remove
                                                </button>
                                            </div>
                                        ))}
                                        {resumeData.certifications.length === 0 && (
                                            <p className="text-sm text-slate-400 italic">No certifications added yet.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Languages */}
                                <div className="rounded-lg shadow p-4" style={{ background: 'var(--surface)' }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>Languages</h2>
                                        <button onClick={addLanguage} className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                            <PlusIcon className="h-5 w-5" /> Add
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {resumeData.languages.map((lang) => (
                                            <div key={lang.id} className="flex items-center gap-3 p-2 border rounded-lg" style={{ borderColor: 'var(--border)' }}>
                                                <input type="text" value={lang.language} onChange={(e) => updateLanguage(lang.id, 'language', e.target.value)}
                                                    placeholder="e.g. English, Spanish, Mandarin"
                                                    className="flex-1 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
                                                />
                                                <select value={lang.proficiency} onChange={(e) => updateLanguage(lang.id, 'proficiency', e.target.value)}
                                                    className="px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                                    style={{ borderColor: 'var(--border)', background: 'var(--surface)', color: 'var(--text)' }}>
                                                    <option value="Native">Native</option>
                                                    <option value="Fluent">Fluent</option>
                                                    <option value="Intermediate">Intermediate</option>
                                                    <option value="Basic">Basic</option>
                                                </select>
                                                <button onClick={() => removeLanguage(lang.id)} className="text-red-600 hover:text-red-700">
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        {resumeData.languages.length === 0 && (
                                            <p className="text-sm text-slate-400 italic">No languages added yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
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
                                    onClick={() => {
                                        if (currentStep === steps.length - 1) {
                                            toast.success('Resume saved to your browser!');
                                            if (!isAuthenticated) {
                                                handlePremiumAction('Cloud Save');
                                            }
                                        } else {
                                            setCurrentStep(currentStep + 1);
                                        }
                                    }}
                                    style={{ background: 'var(--primary-600)', color: '#ffffff' }}
                                    className="px-6 py-2.5 sm:py-2 rounded-lg font-medium transition-all hover:opacity-90 order-3"
                                >
                                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Preview - hidden on mobile unless toggled */}
                    <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
                        className={`${showPreview ? '' : 'hidden lg:block'}`}
                        aria-label="Resume preview"
                    >
                        <div className={previewStyles.mobilePreviewWrapper}
                            style={{ '--preview-scale': `${Math.min(1, (window.innerWidth - 16) / 794)}` } as React.CSSProperties}>
                            <div ref={previewRef} className={`a4-sheet ${previewStyles.sheet}`}
                                style={{ width: '794px', minHeight: '1123px', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                <ResumePreview data={resumeData} />
                            </div>
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}
