import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { FiHome, FiImage, FiClock, FiUsers, FiMessageSquare, FiPlusSquare, FiLogOut, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Feed', icon: FiHome },
  { path: '/gallery', label: 'Gallery', icon: FiImage },
  { path: '/timeline', label: 'Timeline', icon: FiClock },
  { path: '/members', label: 'Members', icon: FiUsers },
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
    <div className="fixed top-0 left-0 z-40 flex-col hidden w-64 h-screen px-6 py-8 overflow-y-auto border-r md:flex border-memory-border bg-white/50 backdrop-blur-xl">
      <div className="flex items-center gap-3 mb-12">
        <div className="flex items-center justify-center w-10 h-10 text-xl font-bold text-white rounded-xl bg-amber-gradient shadow-warm">
          3E
        </div>
        <span className="text-xl font-bold tracking-wide font-display text-memory-text">
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
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative ${isActive
                ? 'text-amber-warm font-semibold bg-amber-warm/10'
                : 'text-memory-muted hover:text-memory-text hover:bg-black/5'
                }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute top-0 left-0 w-1 h-full rounded-r-full bg-amber-warm"
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
            className="flex items-center justify-center w-full gap-2 mb-8 btn-primary shadow-warm hover:shadow-memory"
          >
            <FiPlusSquare className="w-5 h-5" />
            <span>New Memory</span>
          </Link>
        )}

        <div className="pt-6 border-t border-memory-border">
          <Link to={`/profile/${user?.id}`} className="flex items-center gap-3 p-2 mb-6 transition-colors rounded-2xl hover:bg-black/5">
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`}
              alt={user?.name}
              className="object-cover w-10 h-10 border-2 border-white rounded-full shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-memory-text">{user?.name}</p>
              <p className="text-xs truncate text-memory-muted">View Profile</p>
            </div>
          </Link>

          <button
            onClick={logout}
            className="flex items-center w-full gap-4 px-4 py-3 text-left transition-colors rounded-2xl text-memory-danger hover:bg-memory-danger/10"
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
