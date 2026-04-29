import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiFilter } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';

// Mock Gallery Data
const galleryMedia = [
  { id: 1, type: 'image', url: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800', author: 'Sarah J.', event: 'Graduation Trip' },
  { id: 2, type: 'image', url: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?auto=format&fit=crop&q=80&w=800', author: 'David C.', event: 'Science Fair' },
  { id: 3, type: 'image', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800', author: 'Emma W.', event: 'Prom Night' },
  { id: 4, type: 'image', url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=800', author: 'Mike R.', event: 'Sports Day' },
  { id: 5, type: 'image', url: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=800', author: 'Sarah J.', event: 'Study Group' },
  { id: 6, type: 'image', url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800', author: 'Emma W.', event: 'Last Day of Class' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Graduation Trip', 'Science Fair', 'Prom Night'];

  const filteredMedia = filter === 'All' 
    ? galleryMedia 
    : galleryMedia.filter(item => item.event === filter);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-memory-text">Memory Gallery</h1>
            <p className="text-memory-muted mt-1">A visual archive of our best times.</p>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? 'bg-amber-warm text-white shadow-warm'
                    : 'bg-white text-memory-muted hover:bg-black/5'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Masonry-like Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
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
                className="relative group cursor-pointer aspect-square rounded-2xl overflow-hidden shadow-sm"
                onClick={() => setSelectedImage(item)}
              >
                <img 
                  src={item.url} 
                  alt={item.event} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-medium text-sm">{item.event}</p>
                  <p className="text-white/80 text-xs">by {item.author}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
            >
              {/* Backdrop */}
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
                className="relative z-[60] max-w-5xl w-full max-h-full flex flex-col items-center"
              >
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.event} 
                  className="max-h-[80vh] w-auto rounded-xl shadow-2xl object-contain"
                />
                <div className="mt-4 text-center">
                  <p className="text-white font-display text-xl">{selectedImage.event}</p>
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
