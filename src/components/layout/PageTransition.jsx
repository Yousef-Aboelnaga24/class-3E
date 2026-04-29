import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 22, filter: 'blur(12px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)' },
  out: { opacity: 0, y: -18, filter: 'blur(10px)' }
};

const pageTransition = {
  type: 'spring',
  stiffness: 120,
  damping: 24,
  mass: 0.7
};

export function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
