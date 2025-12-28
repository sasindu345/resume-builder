import React from 'react';

interface ColorSwatchProps {
    color: string;
    selected?: boolean;
    onClick?: () => void;
    label?: string;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, selected, onClick, label }) => (
    <button
        type="button"
        aria-label={label}
        onClick={onClick}
        style={{
            background: color,
            border: selected ? '2px solid var(--primary-600)' : '2px solid var(--border)',
            width: 32,
            height: 32,
            borderRadius: '50%',
            margin: 2,
            outline: 'none',
            cursor: 'pointer',
            boxShadow: selected ? '0 0 0 2px var(--primary-600)' : undefined,
            transition: 'box-shadow 0.2s, border 0.2s',
        }}
    >
        {selected && (
            <span style={{
                display: 'block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#fff',
                margin: 'auto',
                marginTop: 8,
            }} />
        )}
    </button>
);
