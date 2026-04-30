import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiSearchLine, RiNotification3Line, RiAddCircleLine,
  RiHome4Line, RiImageLine, RiTimeLine, RiGroupLine, RiLockPasswordLine,
  RiMenuLine, RiCloseLine, RiLogoutBoxLine,
} from 'react-icons/ri'
import { useAuth } from '../../auth/AuthContext'
import Avatar from '../ui/Avatar'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationList from '../notifications/NotificationList'

export default function Topbar() {
  const { user, logout } = useAuth()
  const { data: notificationsData } = useNotifications()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const unreadCount = notificationsData?.unread_count || 0

  const NAV_ITEMS = [
    { to: '/', label: 'Feed', icon: RiHome4Line },
    { to: '/gallery', label: 'Gallery', icon: RiImageLine },
    { to: '/timeline', label: 'Timeline', icon: RiTimeLine },
    { to: '/members', label: 'Members', icon: RiGroupLine },
    { to: '/confessions', label: 'Confessions', icon: RiLockPasswordLine },
  ]

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-memory-border">
        <div className="flex items-center justify-between px-4 lg:px-6 h-16 gap-4">
          {/* Logo (mobile) */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-amber-gradient flex items-center justify-center shadow-warm">
              <span className="text-white text-sm">📸</span>
            </div>
            <span className="font-display font-bold text-memory-text">Class 3E</span>
          </div>

          {/* Search */}
          <div className={`hidden sm:flex flex-1 max-w-xs transition-all duration-200 ${searchFocused ? 'max-w-sm' : ''}`}>
            <div className="relative w-full">
              <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-memory-muted" />
              <input
                type="text"
                placeholder="Search memories..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="input pl-9 py-2 text-sm"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/create')}
              className="hidden sm:flex btn-primary text-sm items-center gap-1.5 px-4 py-2"
            >
              <RiAddCircleLine size={16} />
              Memory
            </motion.button>

            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl hover:bg-cream-100 transition-all text-memory-muted"
            >
              <RiNotification3Line size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-warm text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className="relative">
              <NotificationList 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
              />
            </div>

            <NavLink to="/profile">
              <Avatar name={user?.name} src={user?.avatar} size="xs" className="cursor-pointer" />
            </NavLink>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-cream-100 transition-all text-memory-muted"
            >
              {mobileMenuOpen ? <RiCloseLine size={22} /> : <RiMenuLine size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-gradient flex items-center justify-center shadow-warm">
                    <span className="text-white text-lg">📸</span>
                  </div>
                  <div>
                    <h1 className="font-display font-bold text-memory-text">Class 3E</h1>
                    <p className="text-xs text-memory-muted">Memory Album</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-xl hover:bg-cream-100">
                  <RiCloseLine size={20} className="text-memory-muted" />
                </button>
              </div>

              {/* Mobile search */}
              <div className="px-4 pb-4">
                <div className="relative">
                  <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-memory-muted" />
                  <input type="text" placeholder="Search memories..." className="input pl-9 py-2 text-sm" />
                </div>
              </div>

              <nav className="flex-1 px-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {({ isActive }) => (
                      <div className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all
                        ${isActive ? 'bg-amber-warm/10 text-amber-warm font-semibold' : 'text-memory-muted hover:bg-cream-100'}`}>
                        <item.icon size={20} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                    )}
                  </NavLink>
                ))}
                <button
                  onClick={() => { navigate('/create'); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-amber-warm hover:bg-amber-warm/10 transition-all"
                >
                  <RiAddCircleLine size={20} />
                  <span className="text-sm font-semibold">Add Memory</span>
                </button>
              </nav>

              {/* User */}
              {user && (
                <div className="p-4 border-t border-memory-border">
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-100 transition-all cursor-pointer">
                      <Avatar name={user.name} src={user.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-memory-text truncate">{user.name}</p>
                        <p className="text-xs text-memory-muted truncate">@{user.username}</p>
                      </div>
                    </div>
                  </NavLink>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false) }}
                    className="mt-1 w-full flex items-center gap-2 px-3 py-2 text-sm text-memory-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <RiLogoutBoxLine size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
