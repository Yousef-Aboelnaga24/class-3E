import { motion } from 'framer-motion';
import {PageTransition} from '../components/layout/PageTransition';
import MemoryCard from '../components/MemoryCard';
import { usePosts } from '../hooks/usePosts';

export default function Home() {
  const { data: postsData, isLoading, error } = usePosts();

  if (isLoading) {
    return (
      <div className="max-w-2xl pt-12 mx-auto space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="p-6 glass-panel rounded-3xl animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-cream-200"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 rounded bg-cream-200"></div>
                <div className="w-20 h-3 rounded bg-cream-200"></div>
              </div>
            </div>
            <div className="w-full h-24 mb-4 bg-cream-100 rounded-xl"></div>
            <div className="w-full h-48 bg-cream-200 rounded-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
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
          <p className="mt-1 text-memory-muted">Catch up with the latest memories from 3E.</p>
        </motion.div>

        <div className="space-y-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <MemoryCard key={post.id} post={post} />
            ))
          ) : (
            <div className="py-12 text-center border border-dashed bg-white/50 rounded-3xl border-memory-border">
              <p className="text-memory-muted">No memories shared yet. Be the first!</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
