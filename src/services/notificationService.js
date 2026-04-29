import axiosClient from '../api/axiosClient';

const notificationService = {
    async getNotifications() {
        return await axiosClient.get('/notifications');
    },

    async markAsRead(id) {
        return await axiosClient.post(`/notifications/${id}/read`);
    },

    async markAllAsRead() {
        return await axiosClient.post('/notifications/read-all');
    },
};

export default notificationService;
