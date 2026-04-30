import axiosClient from '../api/axiosClient';

const eventService = {
    async getEvents() {
        return await axiosClient.get('/timeline');
    },
};

export default eventService;
