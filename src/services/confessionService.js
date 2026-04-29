import axiosClient from '../api/axiosClient';

const confessionService = {
    async getConfessions() {
        return await axiosClient.get('/confessions');
    },

    async createConfession(data) {
        return await axiosClient.post('/confessions', data);
    },
};

export default confessionService;
