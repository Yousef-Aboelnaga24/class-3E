import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import { PageTransition } from '../components/layout/PageTransition';

import { useUsers } from '../hooks/useUsers';

export default function Members() {
  const { data: usersData, isLoading } = useUsers();

  const members = usersData?.data || usersData || [];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-6 mb-10 md:flex-row md:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold font-display text-memory-text">Class of 3E</h1>
            <p className="mt-1 text-memory-muted">Reconnect with your classmates.</p>
          </div>

          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <FiSearch className="text-memory-muted" />
            </div>
            <input
              type="text"
              className="w-full py-3 pr-4 text-sm transition-all bg-white border rounded-full shadow-sm border-memory-border pl-11 focus:outline-none focus:ring-2 focus:ring-amber-warm/50 focus:border-amber-warm text-memory-text"
              placeholder="Search classmates..."
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-6 glass-panel rounded-3xl animate-pulse">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-cream-200"></div>
                <div className="w-2/3 h-5 mx-auto mb-2 rounded bg-cream-200"></div>
                <div className="w-1/2 h-3 mx-auto rounded bg-cream-100"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/profile/${member.id}`} className="block group">
                  <div className="p-6 text-center transition-transform duration-300 glass-panel rounded-3xl hover:-translate-y-2">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-amber-gradient blur-md group-hover:opacity-40"></div>
                      <img
                        src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                        alt={member.name}
                        className="relative object-cover w-full h-full border-4 border-white rounded-full shadow-sm"
                      />
                    </div>

                    <h3 className="mb-1 text-lg font-bold transition-colors text-memory-text font-display group-hover:text-amber-deep">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm text-memory-muted">{member.role || 'Student'}</p>

                    <div className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-black/5 text-memory-text">
                      {member.posts_count || 0} memories
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
