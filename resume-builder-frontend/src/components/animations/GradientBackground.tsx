/**
 * Gradient Background Component
 * Displays animated gradient mesh background
 * Used on landing and auth pages for visual appeal
 * Respects prefers-reduced-motion for accessibility
 */

export const GradientBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Main gradient mesh background */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 
                   animate-gradient-xy bg-[length:400%_400%]"
                style={{
                    background:
                        'linear-gradient(120deg, #eff6ff 0%, #ffffff 25%, #f5f3ff 50%, #fef3c7 75%, #eff6ff 100%)',
                    backgroundSize: '300% 300%',
                }}
            />
        </div>
    )
}
