import api from './api'

export interface AIReviewRequest {
    targetDomain: string
    resumeData: Record<string, unknown>
}

export interface ReviewItem {
    title: string
    description: string
    priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export interface AIReviewResponse {
    overallScore: number
    summary: string
    criticalIssues: ReviewItem[]
    improvements: ReviewItem[]
    strengths: ReviewItem[]
    structuralSuggestions: ReviewItem[]
    missingKeywords: string[]
    atsTips: string[]
}

/**
 * Submit a resume for AI-powered review.
 * Requires authentication — this is a premium feature.
 *
 * @param targetDomain The domain/industry to evaluate against (e.g., "Software Engineering")
 * @param resumeData The full resume data object
 */
export async function submitAIReview(
    targetDomain: string,
    resumeData: Record<string, unknown>
): Promise<AIReviewResponse> {
    const response = await api.post<AIReviewResponse>('/resume/ai-review', {
        targetDomain,
        resumeData,
    })
    return response.data
}

/**
 * Common target domains for the AI review dropdown.
 */
export const TARGET_DOMAINS = [
    'Software Engineering',
    'Data Science & Analytics',
    'Product Management',
    'UI/UX Design',
    'DevOps & Cloud Engineering',
    'Cybersecurity',
    'Marketing & Growth',
    'Finance & Accounting',
    'Human Resources',
    'Sales & Business Development',
    'Project Management',
    'Healthcare',
    'Education',
    'Legal',
    'Other',
] as const
