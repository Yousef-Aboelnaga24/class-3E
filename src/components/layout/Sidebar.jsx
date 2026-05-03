import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { FiHome, FiImage, FiClock, FiUsers, FiMessageSquare, FiPlusSquare, FiLogOut, FiShield, FiZap } from 'react-icons/fi';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Feed', icon: FiHome },
  { path: '/gallery', label: 'Gallery', icon: FiImage },
  { path: '/timeline', label: 'Timeline', icon: FiClock },
  { path: '/members', label: 'Members', icon: FiUsers },
  { path: '/play', label: 'Play', icon: FiZap },
  { path: '/confessions', label: 'Confessions', icon: FiMessageSquare },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const role = String(user?.role || 'user').toLowerCase();
  const canCreate = role === 'student' || role === 'admin';
  const visibleNavItems = role === 'admin'
    ? [...navItems, { path: '/admin', label: 'Admin', icon: FiShield }]
    : navItems;

  return (
    <div className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col overflow-y-auto border-r border-white/20 cosmic-panel px-6 py-8 text-white shadow-[18px_0_70px_rgba(37,99,235,0.22)] md:flex">
      <div className="flex items-center gap-3 mb-12">
        <div className="chromatic-ring flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-gradient text-xl font-black text-white shadow-warm">
          3E
        </div>
        <span className="neon-text text-xl font-bold tracking-wide text-white font-display">
          Class Memories
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {visibleNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex items-center gap-4 rounded-2xl px-4 py-3 transition-all ${isActive
                ? 'bg-white/16 font-semibold text-white shadow-[0_12px_34px_rgba(124,58,237,0.24)]'
                : 'text-indigo-100/72 hover:bg-white/10 hover:text-white'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-sky-soft shadow-[0_0_18px_rgba(56,189,248,0.9)]"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        {canCreate && (
          <Link
            to="/create"
            className="mb-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-gradient px-5 py-3 font-bold text-white shadow-warm transition-all hover:-translate-y-0.5 hover:shadow-memory"
          >
            <FiPlusSquare className="w-5 h-5" />
            <span>New Memory</span>
          </Link>
        )}

        <div className="border-t border-white/15 pt-6">
          <Link to={`/profile/${user?.id}`} className="mb-6 flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-white/10">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              alt={user?.name}
              className="h-10 w-10 rounded-full border-2 border-sky-soft/70 object-cover shadow-[0_0_24px_rgba(56,189,248,0.35)]"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-indigo-100/70">View Profile</p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-rose-200 transition-colors hover:bg-rose-500/14"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      {/* { console.log(user.avatar) } */}
    </div>
  );
}
