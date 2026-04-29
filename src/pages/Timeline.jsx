import { motion } from 'framer-motion';
import { FiStar, FiAward, FiBook, FiHeart } from 'react-icons/fi';
import {PageTransition} from '../components/layout/PageTransition';

import { useEvents } from '../hooks/useEvents';

export default function Timeline() {
  const { data: eventsData, isLoading } = useEvents();

  const timelineEvents = eventsData?.data || eventsData || [];

  const getIcon = (type) => {
    switch (type) {
      case 'award': return FiAward;
      case 'book': return FiBook;
      case 'heart': return FiHeart;
      default: return FiStar;
    }
  };

  const getColor = (color) => {
    switch (color) {
      case 'red': return 'bg-memory-danger';
      case 'blue': return 'bg-sky-soft';
      case 'green': return 'bg-sage-soft';
      default: return 'bg-amber-warm';
    }
  };

  return (
    <PageTransition>
      <div className="max-w-3xl px-4 py-8 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold font-display text-memory-text">Our Journey</h1>
          <p className="text-lg text-memory-muted">A timeline of the moments that made 3E unforgettable.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-memory-border -translate-x-1/2" />

          {isLoading ? (
            <div className="space-y-12">
              {[1, 2].map(i => (
                <div key={i} className="relative flex items-center animate-pulse">
                  <div className="absolute z-10 w-10 h-10 -translate-x-1/2 rounded-full left-4 md:left-1/2 bg-cream-200" />
                  <div className="ml-12 md:ml-0 md:w-1/2 md:pr-12">
                    <div className="w-full h-32 p-6 glass-panel rounded-3xl bg-cream-50" />
                  </div>
                </div>
              ))}
            </div>
          ) : timelineEvents.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-memory-muted">No journey events recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {timelineEvents.map((event, index) => {
                const Icon = getIcon(event.icon_type);
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className={`relative flex items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    <div className={`absolute left-4 md:left-1/2 w-10 h-10 -translate-x-1/2 rounded-full border-4 border-cream-50 ${getColor(event.color)} flex items-center justify-center text-white shadow-md z-10`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                      <div className="relative p-6 glass-panel rounded-3xl">
                        <div className={`hidden md:block absolute top-6 w-4 h-4 bg-white border-t border-r border-white/40 transform ${isEven ? '-left-2 -rotate-135' : '-right-2 rotate-45'}`} />
                        
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase rounded-full bg-amber-warm/10 text-amber-deep">
                          {event.date_label}
                        </span>
                        <h3 className="mb-2 text-xl font-bold font-display text-memory-text">{event.title}</h3>
                        <p className="leading-relaxed text-memory-muted">{event.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
