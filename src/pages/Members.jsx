import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';

const mockMembers = [
  { id: 1, name: 'Sarah Jenkins', role: 'Class President', avatar: 'https://i.pravatar.cc/150?u=sarah', memories: 45 },
  { id: 2, name: 'David Chen', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=david', memories: 32 },
  { id: 3, name: 'Emma Wilson', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=emma', memories: 56 },
  { id: 4, name: 'Mike Ross', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=mike', memories: 12 },
  { id: 5, name: 'Jessica Pearson', role: 'Teacher', avatar: 'https://i.pravatar.cc/150?u=jessica', memories: 89 },
  { id: 6, name: 'Harvey Specter', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=harvey', memories: 24 },
  { id: 7, name: 'Rachel Zane', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=rachel', memories: 67 },
  { id: 8, name: 'Louis Litt', role: 'Student', avatar: 'https://i.pravatar.cc/150?u=louis', memories: 19 },
];

export default function Members() {
  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-memory-text">Class of 3E</h1>
            <p className="text-memory-muted mt-1">Reconnect with your classmates.</p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiSearch className="text-memory-muted" />
            </div>
            <input
              type="text"
              className="w-full bg-white border border-memory-border rounded-full pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-warm/50 focus:border-amber-warm transition-all text-sm text-memory-text shadow-sm"
              placeholder="Search classmates..."
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {mockMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/profile/${member.id}`} className="block group">
                <div className="glass-panel p-6 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <div className="absolute inset-0 bg-amber-gradient rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-sm"
                    />
                  </div>
                  
                  <h3 className="text-lg font-bold text-memory-text font-display mb-1 group-hover:text-amber-deep transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sm text-memory-muted mb-3">{member.role}</p>
                  
                  <div className="inline-block px-3 py-1 bg-black/5 rounded-full text-xs font-medium text-memory-text">
                    {member.memories} memories
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
