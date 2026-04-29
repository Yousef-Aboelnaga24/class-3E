import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMessageSquare, FiSend, FiLock, FiGlobe } from 'react-icons/fi';
import toast from 'react-hot-toast';
import PageTransition from '../components/layout/PageTransition';

const confessionSchema = z.object({
  content: z.string().min(10, 'Confession must be at least 10 characters'),
  isAnonymous: z.boolean(),
});

const mockConfessions = [
  { id: 1, content: "I was the one who accidentally broke the projector in sophomore year. Sorry Mr. Davis! 😅", isAnonymous: true, timestamp: "2 hours ago", color: "bg-confession-gradient" },
  { id: 2, content: "To the person who always left notes in library book #402: you made my days brighter.", isAnonymous: true, timestamp: "5 hours ago", color: "bg-sky-gradient" },
  { id: 3, content: "I'm finally going to art school! Thanks to everyone who supported my doodles during math class.", isAnonymous: false, author: "Emma W.", timestamp: "1 day ago", color: "bg-sage-gradient" },
  { id: 4, content: "Does anyone else miss the cafeteria's weird Tuesday tacos? Just me?", isAnonymous: true, timestamp: "2 days ago", color: "bg-amber-gradient" },
];

export default function Confessions() {
  const [confessions, setConfessions] = useState(mockConfessions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(confessionSchema),
    defaultValues: { isAnonymous: true, content: '' }
  });

  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newConfession = {
        id: Date.now(),
        content: data.content,
        isAnonymous: data.isAnonymous,
        author: data.isAnonymous ? null : "Demo User",
        timestamp: "Just now",
        color: "bg-confession-gradient"
      };
      setConfessions([newConfession, ...confessions]);
      toast.success('Your secret is safe with us! 🤫');
      reset();
    } catch (error) {
      toast.error('Failed to post confession.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="w-16 h-16 mx-auto bg-amber-warm/10 text-amber-warm rounded-full flex items-center justify-center mb-4">
            <FiMessageSquare className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold font-display text-memory-text mb-4">Confession Wall</h1>
          <p className="text-memory-muted text-lg">
            Unsaid words, hidden crushes, funny admissions. Share your secrets anonymously or sign your name.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-16"
        >
          <div className="glass-panel p-6 rounded-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <textarea
                {...register('content')}
                rows={4}
                className={`w-full bg-white/50 border ${errors.content ? 'border-memory-danger focus:ring-memory-danger' : 'border-memory-border focus:ring-amber-warm focus:border-amber-warm'} rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 transition-all text-memory-text placeholder:text-memory-muted`}
                placeholder="I have a confession to make..."
              />
              {errors.content && <p className="text-sm text-memory-danger">{errors.content.message}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white/50 rounded-full p-1 border border-memory-border">
                  <button
                    type="button"
                    onClick={() => reset({ ...watch(), isAnonymous: true })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      isAnonymous ? 'bg-amber-warm text-white shadow-sm' : 'text-memory-muted hover:text-memory-text'
                    }`}
                  >
                    <FiLock className="w-4 h-4" /> Anonymous
                  </button>
                  <button
                    type="button"
                    onClick={() => reset({ ...watch(), isAnonymous: false })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      !isAnonymous ? 'bg-amber-warm text-white shadow-sm' : 'text-memory-muted hover:text-memory-text'
                    }`}
                  >
                    <FiGlobe className="w-4 h-4" /> Public
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" /> Post
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Masonry Wall */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {confessions.map((confession, index) => (
              <motion.div
                key={confession.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`break-inside-avoid p-6 rounded-3xl text-white shadow-lg ${confession.color} relative overflow-hidden group`}
              >
                {/* Decorative quote mark */}
                <span className="absolute -top-4 -right-2 text-8xl opacity-20 font-serif leading-none">"</span>
                
                <p className="text-lg font-medium leading-relaxed mb-6 relative z-10">
                  {confession.content}
                </p>
                
                <div className="flex items-center justify-between text-white/80 text-sm relative z-10 font-medium">
                  <span>{confession.isAnonymous ? 'Anonymous' : confession.author}</span>
                  <span>{confession.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
