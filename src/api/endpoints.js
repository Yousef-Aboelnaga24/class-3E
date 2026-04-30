/**
 * Centralized API Endpoints Configuration
 * All API endpoint paths are defined here for easy maintenance and updates
 */

export const API = {
    // ============================================
    // Authentication
    // ============================================
    AUTH: {
        REGISTER: '/register',
        LOGIN: '/login',
        LOGOUT: '/logout',
        GET_USER: '/user',
        VERIFY_EMAIL: (id) => `/email/verify/${id}`,
        RESEND_VERIFICATION: '/email/resend',
    },

    // ============================================
    // Profile
    // ============================================
    PROFILE: {
        UPDATE: '/profile',
    },

    // ============================================
    // Users
    // ============================================
    USERS: {
        LIST: '/users',
        GET: (id) => `/users/${id}`,
        DELETE: (id) => `/users/${id}`,
        UPDATE_ROLE: (id) => `/users/${id}/role`,
        GET_POSTS: (id, page = 1) => `/users/${id}/posts?page=${page}`,
    },

    // ============================================
    // Posts/Feed
    // ============================================
    POSTS: {
        LIST: (page = 1) => `/posts?page=${page}`,
        GET: (id) => `/posts/${id}`,
        CREATE: '/posts',
        UPDATE: (id) => `/posts/${id}`,
        DELETE: (id) => `/posts/${id}`,
    },

    // ============================================
    // Comments
    // ============================================
    COMMENTS: {
        LIST: (postId) => `/posts/${postId}/comments`,
        CREATE: (postId) => `/posts/${postId}/comments`,
        DELETE: (commentId) => `/comments/${commentId}`,
    },

    // ============================================
    // Reactions
    // ============================================
    REACTIONS: {
        TOGGLE: (postId) => `/posts/${postId}/react`,
    },

    // ============================================
    // Messages
    // ============================================
    MESSAGES: {
        RECEIVED: (page = 1) => `/messages/received?page=${page}`,
        SENT: (page = 1) => `/messages/sent?page=${page}`,
        CREATE: '/messages',
    },

    // ============================================
    // Notifications
    // ============================================
    NOTIFICATIONS: {
        LIST: '/notifications',
        MARK_AS_READ: (id) => `/notifications/${id}/read`,
        MARK_ALL_AS_READ: '/notifications/read-all',
    },

    // ============================================
    // Timeline Events
    // ============================================
    TIMELINE: {
        LIST: '/timeline',
        CREATE: '/timeline',
    },

    // ============================================
    // Confessions
    // ============================================
    CONFESSIONS: {
        LIST: '/confessions',
        CREATE: '/confessions',
    },

    // ============================================
    // Class Codes (Admin)
    // ============================================
    CLASS_CODES: {
        LIST: '/class-codes',
        CREATE: '/class-codes',
        DELETE: (id) => `/class-codes/${id}`,
    },
};

export default API;
