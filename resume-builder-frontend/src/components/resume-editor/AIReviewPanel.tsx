import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/services/api';
import toast from 'react-hot-toast';
import { Brain, Sparkles, AlertTriangle, Lightbulb, Target, Tag, ChevronRight, RefreshCw } from 'lucide-react';
import { ResumeData } from '@/pages/ResumeEditor';
import { getApiErrorMessage } from '@/utils/apiError';

interface ReviewItem {
    title: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface AIReviewResult {
    overallScore: number;
    summary: string;
    criticalIssues: ReviewItem[];
    improvements: ReviewItem[];
    strengths: ReviewItem[];
    structuralSuggestions: ReviewItem[];
    missingKeywords: string[];
    atsTips: string[];
}

interface AIReviewPanelProps {
    resumeData: ResumeData;
}

const DOMAINS = [
    'Software Engineering', 'Product Management', 'Data Science',
    'Marketing', 'Finance', 'Design/UX', 'Healthcare', 'Sales', 'General',
];

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    HIGH:   { label: 'High',   color: '#dc2626', bg: '#fef2f2' },
    MEDIUM: { label: 'Medium', color: '#d97706', bg: '#fffbeb' },
    LOW:    { label: 'Low',    color: '#059669', bg: '#f0fdf4' },
};

function PriorityBadge({ priority }: { priority: string }) {
    const cfg = priorityConfig[priority] || priorityConfig.LOW;
    return (
        <span
            className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ color: cfg.color, background: cfg.bg }}
        >
            {cfg.label}
        </span>
    );
}

function ScoreGauge({ score }: { score: number }) {
    const pct = (score / 10) * 100;
    const color = score >= 8 ? '#059669' : score >= 6 ? '#d97706' : '#dc2626';
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (pct / 100) * circumference;
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border)" strokeWidth="8" />
                    <motion.circle
                        cx="50" cy="50" r="40" fill="none"
                        stroke={color} strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold" style={{ color, letterSpacing: '-0.04em' }}>{score}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>/10</span>
                </div>
            </div>
            <div className="text-xs font-semibold" style={{ color }}>
                {score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : 'Needs Work'}
            </div>
        </div>
    );
}

const tabs = [
    { key: 'improvements',         label: 'Improvements',    icon: Lightbulb,       color: '#2563eb' },
    { key: 'criticalIssues',       label: 'Critical Issues', icon: AlertTriangle,   color: '#dc2626' },
    { key: 'atsTips',              label: 'ATS Tips',        icon: Target,          color: '#7c3aed' },
    { key: 'missingKeywords',      label: 'Keywords',        icon: Tag,             color: '#059669' },
] as const;

type TabKey = typeof tabs[number]['key'];

export function AIReviewPanel({ resumeData }: AIReviewPanelProps) {
    const [domain, setDomain] = useState('Software Engineering');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<AIReviewResult | null>(null);
    const [activeTab, setActiveTab] = useState<TabKey>('improvements');

    const runReview = async () => {
        try {
            setIsLoading(true);
            setResult(null);
            const response = await api.post('/resume/ai-review', {
                resumeData,
                targetDomain: domain,
            }, {
                timeout: 120000,
            });
            setResult(response.data.data || response.data);
            toast.success('AI review complete!');
        } catch (error: unknown) {
            console.error('[ai-review] request failed', error);
            toast.error(getApiErrorMessage(error, 'AI review failed. Please try again.'), {
                duration: 6000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Domain Selector + Run Button */}
            <div className="rounded-2xl p-5 border space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text)' }}>AI Resume Reviewer</h3>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>Powered by GPT — domain-specific analysis</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--muted)' }}>
                        Target Industry / Domain
                    </label>
                    <select
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        style={{ background: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    >
                        {DOMAINS.map((d) => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={runReview}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm btn-gradient disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Analysing Resume...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4" />
                            {result ? 'Re-run AI Review' : 'Run AI Review'}
                        </>
                    )}
                </button>
            </div>

            {/* Loading Skeleton */}
            {isLoading && (
                <div className="rounded-2xl p-5 border space-y-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                    {[80, 60, 90, 50].map((w, i) => (
                        <div key={i} className="skeleton h-4 rounded-full" style={{ width: `${w}%` }} />
                    ))}
                </div>
            )}

            {/* Results */}
            <AnimatePresence>
                {result && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4"
                    >
                        {/* Score + Summary Card */}
                        <div className="rounded-2xl p-5 border" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                                <ScoreGauge score={result.overallScore} />
                                <div className="flex-1 text-center sm:text-left">
                                    <h4 className="font-bold mb-1.5" style={{ color: 'var(--text)' }}>Overall Assessment</h4>
                                    <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                                        {result.summary}
                                    </p>
                                    {/* Strengths inline */}
                                    {result.strengths?.[0] && (
                                        <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                            <span className="text-green-600 text-sm">✓</span>
                                            <p className="text-xs text-green-800 font-medium">{result.strengths[0].title}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                            {/* Tab Strip */}
                            <div className="flex border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
                                {tabs.map(({ key, label, icon: Icon, color }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                                            activeTab === key ? 'border-b-2' : 'border-transparent'
                                        }`}
                                        style={{
                                            color: activeTab === key ? color : 'var(--muted)',
                                            borderBottomColor: activeTab === key ? color : 'transparent',
                                            background: activeTab === key ? `${color}08` : 'transparent',
                                        }}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                        {key === 'criticalIssues' && result.criticalIssues?.length > 0 && (
                                            <span className="ml-1 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{ background: '#dc2626', fontSize: '9px' }}>
                                                {result.criticalIssues.length}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, x: 8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-2"
                                    >
                                        {/* Improvements */}
                                        {activeTab === 'improvements' && result.improvements?.map((item, i) => (
                                            <div key={i} className="flex gap-3 p-3 rounded-xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                                                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{item.title}</span>
                                                        <PriorityBadge priority={item.priority} />
                                                    </div>
                                                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{item.description}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Critical Issues */}
                                        {activeTab === 'criticalIssues' && (result.criticalIssues?.length > 0 ? result.criticalIssues.map((item, i) => (
                                            <div key={i} className="flex gap-3 p-3 rounded-xl border" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                                                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-xs font-bold text-red-700">{item.title}</span>
                                                        <PriorityBadge priority={item.priority} />
                                                    </div>
                                                    <p className="text-xs leading-relaxed text-red-600">{item.description}</p>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-xs text-green-600 font-medium text-center py-4">✓ No critical issues found — great work!</p>
                                        ))}

                                        {/* ATS Tips */}
                                        {activeTab === 'atsTips' && result.atsTips?.map((tip, i) => (
                                            <div key={i} className="flex gap-3 p-3 rounded-xl border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
                                                <Target className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#7c3aed' }} />
                                                <p className="text-xs leading-relaxed" style={{ color: 'var(--text)' }}>{tip}</p>
                                            </div>
                                        ))}

                                        {/* Missing Keywords */}
                                        {activeTab === 'missingKeywords' && (
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {result.missingKeywords?.map((kw, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1.5 rounded-full text-xs font-semibold border"
                                                        style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#059669' }}
                                                    >
                                                        + {kw}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
