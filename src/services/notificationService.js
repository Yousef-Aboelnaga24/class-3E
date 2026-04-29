import axiosClient from '../api/axiosClient';

const notificationService = {
    async getNotifications() {
        const response = await axiosClient.get('/notifications');
        return response.data;
    },

    async markAsRead(id) {
        const response = await axiosClient.post(`/notifications/${id}/read`);
        return response.data;
    },

    async markAllAsRead() {
        const response = await axiosClient.post('/notifications/read-all');
        return response.data;
    },
};

export default notificationService;
