import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { FiHome, FiImage, FiClock, FiUsers, FiMessageSquare, FiPlusSquare, FiLogOut } from 'react-icons/fi';
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

  return (
    <div className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-memory-border bg-white/50 backdrop-blur-xl z-40 px-6 py-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-xl bg-amber-gradient flex items-center justify-center text-white font-bold text-xl shadow-warm">
          3E
        </div>
        <span className="font-display text-xl font-bold text-memory-text tracking-wide">
          Class Memories
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all relative ${
                isActive 
                  ? 'text-amber-warm font-semibold bg-amber-warm/10' 
                  : 'text-memory-muted hover:text-memory-text hover:bg-black/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-0 w-1 h-full bg-amber-warm rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link 
          to="/create" 
          className="btn-primary w-full flex items-center justify-center gap-2 mb-8 shadow-warm hover:shadow-memory"
        >
          <FiPlusSquare className="w-5 h-5" />
          <span>New Memory</span>
        </Link>
        
        <div className="pt-6 border-t border-memory-border">
          <Link to={`/profile/${user?.id}`} className="flex items-center gap-3 mb-6 p-2 rounded-2xl hover:bg-black/5 transition-colors">
            <img 
              src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
              alt={user?.name} 
              className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-memory-text truncate">{user?.name}</p>
              <p className="text-xs text-memory-muted truncate">View Profile</p>
            </div>
          </Link>
          
          <button 
            onClick={logout}
            className="flex items-center gap-4 px-4 py-3 w-full text-left rounded-2xl text-memory-danger hover:bg-memory-danger/10 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
