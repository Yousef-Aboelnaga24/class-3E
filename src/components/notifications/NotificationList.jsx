import { motion, AnimatePresence } from 'framer-motion';
import { RiNotification3Line, RiCheckDoubleLine, RiCloseLine } from 'react-icons/ri';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '../../hooks/useNotifications';
import Avatar from '../ui/Avatar';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationList({ isOpen, onClose }) {
    const { data: notificationsData, isLoading } = useNotifications();
    const { mutate: markAsRead } = useMarkNotificationAsRead();
    const { mutate: markAllAsRead } = useMarkAllNotificationsAsRead();

    const notifications = notificationsData?.notifications || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={onClose} />
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-card border border-memory-border z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-memory-border flex items-center justify-between bg-cream-50/50">
                            <h3 className="font-display font-bold text-memory-text flex items-center gap-2">
                                <RiNotification3Line className="text-amber-warm" />
                                Notifications
                            </h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => markAllAsRead()}
                                    className="p-1.5 text-memory-muted hover:text-amber-warm transition-colors rounded-lg hover:bg-white"
                                    title="Mark all as read"
                                >
                                    <RiCheckDoubleLine size={18} />
                                </button>
                                <button onClick={onClose} className="p-1.5 text-memory-muted hover:text-memory-text transition-colors rounded-lg hover:bg-white">
                                    <RiCloseLine size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {isLoading ? (
                                <div className="p-8 text-center">
                                    <div className="w-8 h-8 border-2 border-amber-warm border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-sm text-memory-muted">Loading...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="p-12 text-center">
                                    <RiNotification3Line size={48} className="mx-auto text-cream-200 mb-3" />
                                    <p className="text-memory-muted">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-memory-border">
                                    {notifications.map((notification) => (
                                        <div 
                                            key={notification.id}
                                            onClick={() => {
                                                if (!notification.read_at) markAsRead(notification.id);
                                            }}
                                            className={`p-4 flex gap-3 hover:bg-cream-50 transition-colors cursor-pointer ${!notification.read_at ? 'bg-amber-warm/5' : ''}`}
                                        >
                                            <Avatar name={notification.data.user_name} src={notification.data.user_avatar} size="xs" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-memory-text">
                                                    <span className="font-bold">{notification.data.user_name}</span> {notification.data.message}
                                                </p>
                                                <p className="text-[11px] text-memory-muted mt-1">
                                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                </p>
                                            </div>
                                            {!notification.read_at && (
                                                <div className="w-2 h-2 rounded-full bg-amber-warm mt-1.5 flex-shrink-0"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-3 text-center border-t border-memory-border bg-cream-50/30">
                            <button className="text-xs font-semibold text-amber-deep hover:text-amber-warm transition-colors">
                                View all activity
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
