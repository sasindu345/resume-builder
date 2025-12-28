import React from 'react';

interface TemplateIconProps {
    icon: React.ReactNode;
    selected?: boolean;
    onClick?: () => void;
    label?: string;
}

export const TemplateIcon: React.FC<TemplateIconProps> = ({ icon, selected, onClick, label }) => (
    <button
        type="button"
        aria-label={label}
        onClick={onClick}
        style={{
            border: selected ? '2px solid var(--primary-600)' : '2px solid var(--border)',
            background: 'var(--surface)',
            width: 40,
            height: 40,
            borderRadius: 8,
            margin: 2,
            outline: 'none',
            cursor: 'pointer',
            boxShadow: selected ? '0 0 0 2px var(--primary-600)' : undefined,
            transition: 'box-shadow 0.2s, border 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        {icon}
    </button>
);
