/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'selector',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
            },
            animation: {
                'gradient-xy': 'gradient-xy 18s ease infinite',
                float: 'float 8s ease-in-out infinite',
            },
            keyframes: {
                'gradient-xy': {
                    '0%, 100%': { backgroundPosition: '0% 0%' },
                    '25%': { backgroundPosition: '100% 0%' },
                    '50%': { backgroundPosition: '100% 100%' },
                    '75%': { backgroundPosition: '0% 100%' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            },
        },
    },
    plugins: [],
}
