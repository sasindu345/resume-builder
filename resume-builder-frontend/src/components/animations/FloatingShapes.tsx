/**
 * Floating Shapes Component
 * Renders animated geometric shapes as background decoration
 * Uses Framer Motion for smooth animations
 * Adds depth and visual interest to pages
 */

import { motion } from 'framer-motion'

export const FloatingShapes = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Floating circle 1 - top left */}
            <motion.div
                className="absolute top-20 left-10 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl"
                animate={{
                    y: [0, -30, 0],
                    x: [0, 20, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                aria-hidden="true"
            />

            {/* Floating circle 2 - bottom right */}
            <motion.div
                className="absolute bottom-10 -right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"
                animate={{
                    y: [0, 40, 0],
                    x: [0, -20, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1,
                }}
                aria-hidden="true"
            />

            {/* Floating circle 3 - center */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-100/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                aria-hidden="true"
            />
        </div>
    )
}
