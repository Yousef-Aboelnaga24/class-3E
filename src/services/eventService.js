import axiosClient from '../api/axiosClient';

const eventService = {
    async getEvents() {
        return await axiosClient.get('/events');
    },
};

export default eventService;
