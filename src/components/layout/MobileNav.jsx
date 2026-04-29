import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiImage, FiClock, FiMessageSquare, FiPlusSquare, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/AuthContext';

const navItems = [
  { path: '/', icon: FiHome },
  { path: '/gallery', icon: FiImage },
  { path: '/create', icon: FiPlusSquare, highlight: true },
  { path: '/timeline', icon: FiClock },
  { path: '/confessions', icon: FiMessageSquare },
];

export default function MobileNav() {
  const location = useLocation();
  const { user } = useAuth();
  const role = String(user?.role || 'user').toLowerCase();
  const canCreate = role === 'student' || role === 'admin';
  const visibleNavItems = [
    navItems[0],
    navItems[1],
    ...(canCreate ? [navItems[2]] : []),
    navItems[3],
    role === 'admin' ? { path: '/admin', icon: FiShield } : navItems[4],
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-memory-border z-40 px-6 py-4 pb-safe flex items-center justify-between shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      {visibleNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        
        if (item.highlight) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative -top-6 w-14 h-14 bg-amber-gradient rounded-full flex items-center justify-center text-white shadow-warm hover:shadow-memory transition-shadow"
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative p-3 rounded-2xl transition-colors ${
              isActive ? 'text-amber-warm' : 'text-memory-muted hover:text-memory-text'
            }`}
          >
            <Icon className="w-6 h-6" />
            {isActive && (
              <motion.div
                layoutId="mobile-nav-active"
                className="absolute inset-0 bg-amber-warm/10 rounded-2xl -z-10"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}
