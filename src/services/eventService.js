import axiosClient from '../api/axiosClient';

const eventService = {
    async getEvents() {
        return await axiosClient.get('/timeline');
    },

    async createEvent(payload) {
        return await axiosClient.post('/timeline', payload);
    },

    async updateEvent(id, payload) {
        return await axiosClient.put(`/timeline/${id}`, payload);
    },

    async deleteEvent(id) {
        return await axiosClient.delete(`/timeline/${id}`);
    },
};

export default eventService;
