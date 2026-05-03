import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiImage, FiClock, FiPlusSquare, FiShield, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/AuthContext';

const navItems = [
  { path: '/', icon: FiHome },
  { path: '/gallery', icon: FiImage },
  { path: '/create', icon: FiPlusSquare, highlight: true },
  { path: '/timeline', icon: FiClock },
  { path: '/play', icon: FiZap },
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
    <div className="fixed bottom-0 left-0 z-40 flex w-full items-center justify-between border-t border-white/20 bg-[#111A3B]/86 px-6 py-4 shadow-[0_-14px_48px_rgba(37,99,235,0.24)] backdrop-blur-2xl pb-safe md:hidden">
      {visibleNavItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        if (item.highlight) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex items-center justify-center text-white transition-shadow rounded-full chromatic-ring -top-6 h-14 w-14 bg-amber-gradient shadow-warm hover:shadow-memory"
            >
              <Icon className="w-6 h-6" />
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`relative rounded-2xl p-3 transition-colors ${isActive ? 'text-amber-warm' : 'text-indigo hover:text-white'
              }`}
          >
            <Icon className="w-6 h-6" />
            {isActive && (
              <motion.div
                layoutId="mobile-nav-active"
                className="absolute inset-0 -z-10 rounded-2xl bg-white/14 shadow-[0_0_26px_rgba(56,189,248,0.25)]"
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
