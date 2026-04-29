import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFilter } from 'react-icons/fi';
import {PageTransition} from '../components/layout/PageTransition';

import { usePosts } from '../hooks/usePosts';

export default function Gallery() {
  const { data: postsData, isLoading } = usePosts();
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');

  const posts = postsData?.data || [];

  // Filter for posts that have media
  const galleryMedia = posts.filter(post => post.media && post.media.length > 0).flatMap(post =>
    post.media.map(m => ({
      ...m,
      post_id: post.id,
      author: post.user?.name,
      event: post.content.substring(0, 30) + (post.content.length > 30 ? '...' : '')
    }))
  );

  const filters = ['All']; // Could be dynamically generated if tags existed

  const filteredMedia = filter === 'All'
    ? galleryMedia
    : galleryMedia.filter(item => item.event.includes(filter));

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-end"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-memory-text">Memory Gallery</h1>
            <p className="mt-1 text-memory-muted">A visual archive of our best times.</p>
          </div>

          <div className="flex gap-2 px-4 pb-2 -mx-4 overflow-x-auto scrollbar-hide md:mx-0 md:px-0">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f
                    ? 'bg-amber-warm text-white shadow-warm'
                    : 'bg-white text-memory-muted hover:bg-black/5'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-square bg-cream-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : galleryMedia.length === 0 ? (
          <div className="py-20 text-center border border-dashed bg-white/50 rounded-3xl border-memory-border">
            <p className="text-lg text-memory-muted font-display">No media memories yet.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          >
            <AnimatePresence>
              {filteredMedia.map((item, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={item.id}
                  className="relative overflow-hidden shadow-sm cursor-pointer group aspect-square rounded-2xl"
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.file_path}
                    alt={item.event}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 flex flex-col justify-end p-4 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-100">
                    <p className="text-sm font-medium text-white line-clamp-2">{item.event}</p>
                    <p className="text-xs text-white/80">by {item.author}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            >
              <motion.div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
                onClick={() => setSelectedImage(null)}
              />

              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[60] bg-black/50 rounded-full p-2"
              >
                <FiX className="w-8 h-8" />
              </button>

              <motion.div
                layoutId={`image-${selectedImage.id}`}
                className="relative z-[10] max-w-5xl w-full max-h-full flex flex-col items-center"
              >
                <img
                  src={selectedImage.file_path}
                  alt={selectedImage.event}
                  className="max-h-[80vh] w-auto rounded-xl shadow-2xl object-contain"
                />
                <div className="mt-4 text-center">
                  <p className="text-xl text-white font-display">{selectedImage.event}</p>
                  <p className="text-white/70">Shared by {selectedImage.author}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
