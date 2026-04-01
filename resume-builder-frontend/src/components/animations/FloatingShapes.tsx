/**
 * Floating Shapes Component
 * Uses pure CSS animations instead of framer-motion for better performance.
 * Renders lightweight background decoration with GPU-accelerated transforms.
 */

export const FloatingShapes = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
            <div
                className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float-1"
                style={{ background: 'rgba(147, 197, 253, 0.15)', willChange: 'transform' }}
            />
            <div
                className="absolute bottom-10 -right-20 w-96 h-96 rounded-full blur-3xl animate-float-2"
                style={{ background: 'rgba(191, 219, 254, 0.1)', willChange: 'transform' }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-float-3"
                style={{ background: 'rgba(196, 181, 253, 0.08)', willChange: 'transform' }}
            />
        </div>
    )
}
