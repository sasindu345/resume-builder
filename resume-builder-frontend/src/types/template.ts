export type TemplateName = 'modern' | 'classic' | 'minimal' | 'professional' | 'creative';

export type ThemeName = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'gray';

export interface ColorTheme {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textLight: string;
    border: string;
    background: string;
}

export interface TemplateConfig {
    name: TemplateName;
    displayName: string;
    description: string;
    thumbnail?: string;
    fontFamily: string;
    headingFont: string;
    spacing: {
        section: string;
        subsection: string;
        line: string;
    };
}

export const THEMES: Record<ThemeName, ColorTheme> = {
    blue: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#3b82f6',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
        background: '#ffffff',
    },
    green: {
        primary: '#059669',
        secondary: '#047857',
        accent: '#10b981',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
        background: '#ffffff',
    },
    purple: {
        primary: '#7c3aed',
        secondary: '#6d28d9',
        accent: '#8b5cf6',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
        background: '#ffffff',
    },
    red: {
        primary: '#dc2626',
        secondary: '#b91c1c',
        accent: '#ef4444',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
        background: '#ffffff',
    },
    orange: {
        primary: '#ea580c',
        secondary: '#c2410c',
        accent: '#f97316',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
        background: '#ffffff',
    },
    gray: {
        primary: '#374151',
        secondary: '#1f2937',
        accent: '#4b5563',
        text: '#1f2937',
        textLight: '#6b7280',
        border: '#e5e7eb',
        background: '#ffffff',
    },
};

export const TEMPLATES: Record<TemplateName, TemplateConfig> = {
    modern: {
        name: 'modern',
        displayName: 'Modern',
        description: 'Clean and contemporary design with bold headings',
        fontFamily: "'Inter', -apple-system, sans-serif",
        headingFont: "'Inter', -apple-system, sans-serif",
        spacing: {
            section: '1.5rem',
            subsection: '1rem',
            line: '1.6',
        },
    },
    classic: {
        name: 'classic',
        displayName: 'Classic',
        description: 'Traditional resume format with serif fonts',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        headingFont: "'Georgia', 'Times New Roman', serif",
        spacing: {
            section: '1.25rem',
            subsection: '0.875rem',
            line: '1.5',
        },
    },
    minimal: {
        name: 'minimal',
        displayName: 'Minimal',
        description: 'Simple and elegant with lots of whitespace',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        headingFont: "'Helvetica Neue', Arial, sans-serif",
        spacing: {
            section: '2rem',
            subsection: '1.25rem',
            line: '1.7',
        },
    },
    professional: {
        name: 'professional',
        displayName: 'Professional',
        description: 'Corporate-friendly format with structured layout',
        fontFamily: "'Calibri', 'Segoe UI', sans-serif",
        headingFont: "'Calibri', 'Segoe UI', sans-serif",
        spacing: {
            section: '1.5rem',
            subsection: '1rem',
            line: '1.5',
        },
    },
    creative: {
        name: 'creative',
        displayName: 'Creative',
        description: 'Eye-catching design for creative professionals',
        fontFamily: "'Poppins', 'Helvetica', sans-serif",
        headingFont: "'Poppins', 'Helvetica', sans-serif",
        spacing: {
            section: '1.75rem',
            subsection: '1.125rem',
            line: '1.65',
        },
    },
};
