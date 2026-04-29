import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import MemoryCard from '../components/MemoryCard';
import { usePosts } from '../hooks/usePosts';

export default function Home() {
  const { data: postsData, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 pt-12">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-panel rounded-3xl p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cream-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-cream-200 rounded"></div>
                <div className="w-20 h-3 bg-cream-200 rounded"></div>
              </div>
            </div>
            <div className="w-full h-24 bg-cream-100 rounded-xl mb-4"></div>
            <div className="w-full h-48 bg-cream-200 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-memory-danger">Failed to load memories. Please try again later.</p>
      </div>
    );
  }

  const posts = postsData?.data || [];

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold font-display text-memory-text">Class Feed</h1>
          <p className="text-memory-muted mt-1">Catch up with the latest memories from 3E.</p>
        </motion.div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <MemoryCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12 bg-white/50 rounded-3xl border border-dashed border-memory-border">
              <p className="text-memory-muted">No memories shared yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
