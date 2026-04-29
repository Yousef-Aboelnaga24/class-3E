import { motion } from 'framer-motion';
import { FiStar, FiAward, FiBook, FiHeart } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';

const timelineEvents = [
  {
    id: 1,
    date: 'June 2024',
    title: 'Graduation Day',
    description: 'The day we finally threw our caps in the air! A bittersweet end to an amazing journey.',
    icon: FiStar,
    color: 'bg-amber-warm',
  },
  {
    id: 2,
    date: 'April 2024',
    title: 'Prom Night',
    description: 'Dancing under the stars. The theme was "Enchanted Forest" and everyone looked stunning.',
    icon: FiHeart,
    color: 'bg-memory-danger',
  },
  {
    id: 3,
    date: 'December 2023',
    title: 'Winter Festival',
    description: 'Our class booth sold out of hot chocolate in the first two hours!',
    icon: FiAward,
    color: 'bg-sky-soft',
  },
  {
    id: 4,
    date: 'September 2023',
    title: 'First Day of Senior Year',
    description: 'Walking into the classroom knowing it was our last "first day".',
    icon: FiBook,
    color: 'bg-sage-soft',
  },
];

export default function Timeline() {
  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold font-display text-memory-text mb-4">Our Journey</h1>
          <p className="text-memory-muted text-lg">A timeline of the moments that made 3E unforgettable.</p>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-memory-border -translate-x-1/2" />

          <div className="space-y-12">
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
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
                  {/* Icon Marker */}
                  <div className={`absolute left-4 md:left-1/2 w-10 h-10 -translate-x-1/2 rounded-full border-4 border-cream-50 ${event.color} flex items-center justify-center text-white shadow-md z-10`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Content Box */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12'}`}>
                    <div className="glass-panel p-6 rounded-3xl relative">
                      {/* Arrow pointer for desktop */}
                      <div className={`hidden md:block absolute top-6 w-4 h-4 bg-white border-t border-r border-white/40 transform ${isEven ? '-left-2 -rotate-135' : '-right-2 rotate-45'}`} />
                      
                      <span className="inline-block px-3 py-1 bg-amber-warm/10 text-amber-deep rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                        {event.date}
                      </span>
                      <h3 className="text-xl font-display font-bold text-memory-text mb-2">{event.title}</h3>
                      <p className="text-memory-muted leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
