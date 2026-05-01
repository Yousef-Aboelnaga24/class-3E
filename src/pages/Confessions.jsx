import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMessageSquare, FiSend, FiLock, FiGlobe } from 'react-icons/fi';
import { PageTransition } from '../components/layout/PageTransition';
import { useConfessions, useCreateConfession } from '../hooks/useConfessions';

const confessionSchema = z.object({
  content: z.string().min(10, 'Confession must be at least 10 characters'),
  is_anonymous: z.boolean(),
});

export default function Confessions() {
  const { data: confessionsData, isLoading } = useConfessions();
  const createConfession = useCreateConfession();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(confessionSchema),
    defaultValues: { is_anonymous: true, content: '' }
  });

  const isAnonymous = useWatch({ control, name: 'is_anonymous' });

  const onSubmit = async (data) => {
    createConfession.mutate({
      content: data.content,
      is_anonymous: data.is_anonymous,
    }, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const confessions = confessionsData?.data || [];

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-12 text-center"
        >
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-amber-warm/10 text-amber-warm">
            <FiMessageSquare className="w-8 h-8" />
          </div>
          <h1 className="mb-4 text-4xl font-bold font-display text-memory-text">Confession Wall</h1>
          <p className="text-lg text-memory-muted">
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
          <div className="p-6 glass-panel rounded-3xl">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <textarea
                {...register('content')}
                rows={4}
                className={`w-full bg-white/50 border ${errors.content ? 'border-memory-danger focus:ring-memory-danger' : 'border-memory-border focus:ring-amber-warm focus:border-amber-warm'} rounded-2xl p-4 resize-none focus:outline-none focus:ring-2 transition-all text-memory-text placeholder:text-memory-muted`}
                placeholder="I have a confession to make..."
              />
              {errors.content && <p className="text-sm text-memory-danger">{errors.content.message}</p>}

              <div className="flex items-center justify-between">
                <div className="flex items-center p-1 border rounded-full bg-white/50 border-memory-border">
                  <button
                    type="button"
                    onClick={() => setValue('is_anonymous', true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${isAnonymous ? 'bg-amber-warm text-white shadow-sm' : 'text-memory-muted hover:text-memory-text'
                      }`}
                  >
                    <FiLock className="w-4 h-4" /> Anonymous
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('is_anonymous', false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${!isAnonymous ? 'bg-amber-warm text-white shadow-sm' : 'text-memory-muted hover:text-memory-text'
                      }`}
                  >
                    <FiGlobe className="w-4 h-4" /> Public
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={createConfession.isPending}
                  className="flex items-center gap-2 btn-primary"
                >
                  {createConfession.isPending ? (
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
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
        <div className="gap-6 space-y-6 columns-1 sm:columns-2 lg:columns-3">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 p-6 rounded-3xl bg-cream-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <AnimatePresence>
              {confessions.length > 0 ? (
                confessions.map((confession, index) => (
                  <motion.div
                    key={confession.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className={`relative break-inside-avoid p-6 rounded-3xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${confession.color}`}
                  >
                    {/* Decorative quote mark */}
                    <span className="absolute font-serif leading-none -top-4 -right-2 text-8xl opacity-20">"</span>

                    <p className="relative z-10 mb-6 text-base font-medium leading-relaxed tracking-normal break-words whitespace-pre-wrap sm:text-lg text-black/90">
                      {confession.content}
                    </p>

                    <div className="relative z-10 flex items-center justify-between text-sm font-medium text-memory-muted">
                      <span>{confession.is_anonymous ? 'Anonymous' : confession.author}</span>
                      <span>{confession.timestamp}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-12 text-center col-span-full">
                  <p className="text-memory-muted">No confessions yet. Be the first to share!</p>
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
