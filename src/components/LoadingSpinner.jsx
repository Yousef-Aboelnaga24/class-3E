import { motion } from 'framer-motion';

export default function LoadingSpinner({ size = 'md', fullPage = false }) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
    };

    const spinner = (
        <motion.div
            className={`${sizeClasses[size]} rounded-full border-3 border-cream-200 border-t-amber-warm`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
            }}
        />
    );

    if (fullPage) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cream-50 to-amber-50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    {spinner}
                    <p className="mt-4 text-memory-muted font-medium">Loading...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-8">
            {spinner}
        </div>
    );
}
