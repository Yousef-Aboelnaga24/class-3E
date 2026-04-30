import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { PageTransition } from '../components/layout/PageTransition';
import { usePosts } from '../hooks/usePosts';

export default function Gallery() {
  const { data: postsData, isLoading } = usePosts();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [filter, setFilter] = useState('All');

  const posts = postsData?.data || [];

  const galleryMedia = posts
    .filter(post => post.media && post.media.length > 0)
    .flatMap(post =>
      post.media.map(m => ({
        ...m,
        post_id: post.id,
        author: post.user?.name,
        event:
          post.content.substring(0, 30) +
          (post.content.length > 30 ? '...' : '')
      }))
    );

  const filters = ['All'];

  const filteredMedia =
    filter === 'All'
      ? galleryMedia
      : galleryMedia.filter(item => item.event.includes(filter));

  const isVideo = (file) =>
    file?.match(/\.(mp4|webm|ogg)$/i);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 mb-8 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-memory-text">
              Memory Gallery
            </h1>
            <p className="mt-1 text-memory-muted">
              A visual archive of our best times.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-amber-warm text-white'
                    : 'bg-white text-memory-muted hover:bg-black/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="aspect-square bg-cream-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : galleryMedia.length === 0 ? (
          <div className="py-20 text-center border border-dashed bg-white/50 rounded-3xl">
            <p className="text-lg text-memory-muted">
              No media memories yet.
            </p>
          </div>
        ) : (
          <motion.div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {filteredMedia.map((item, index) => {
                const video = isVideo(item.file_path);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative overflow-hidden cursor-pointer group aspect-square rounded-2xl"
                    onClick={() => setSelectedMedia(item)}
                  >
                    {video ? (
                      <video
                        src={item.file_path}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        muted
                      />
                    ) : (
                      <img
                        src={item.file_path}
                        alt={item.event}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      />
                    )}

                    <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:opacity-100">
                      <p className="text-sm font-medium text-white">
                        {item.event}
                      </p>
                      <p className="text-xs text-white/80">
                        by {item.author}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div
                className="absolute inset-0 bg-black/90"
                onClick={() => setSelectedMedia(null)}
              />

              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute z-50 p-2 text-white rounded-full top-6 right-6 bg-black/50"
              >
                <FiX className="w-8 h-8" />
              </button>

              <div className="relative z-10 max-w-5xl text-center">
                {isVideo(selectedMedia.file_path) ? (
                  <video
                    controls
                    className="max-h-[80vh] rounded-xl shadow-2xl"
                  >
                    <source
                      src={selectedMedia.file_path}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <img
                    src={selectedMedia.file_path}
                    alt={selectedMedia.event}
                    className="max-h-[80vh] rounded-xl shadow-2xl"
                  />
                )}

                <div className="mt-4">
                  <p className="text-xl text-white">
                    {selectedMedia.event}
                  </p>
                  <p className="text-white/70">
                    Shared by {selectedMedia.author}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}