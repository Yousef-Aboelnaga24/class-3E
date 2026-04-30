import { motion } from 'framer-motion';
import { FiInbox, FiArrowRight } from 'react-icons/fi';

export default function EmptyState({
    icon: Icon = FiInbox,
    title = 'Nothing here yet',
    description = 'No items to display',
    action = null,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 px-6 text-center rounded-3xl border-2 border-dashed border-memory-border bg-white/50"
        >
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-warm/10">
                <Icon className="w-8 h-8 text-amber-warm" />
            </div>

            <h3 className="mb-2 text-xl font-bold text-memory-text">{title}</h3>
            <p className="text-memory-muted mb-6">{description}</p>

            {action && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={action.onClick}
                    className="inline-flex items-center gap-2 btn-primary"
                >
                    {action.label}
                    <FiArrowRight className="w-4 h-4" />
                </motion.button>
            )}
        </motion.div>
    );
}
