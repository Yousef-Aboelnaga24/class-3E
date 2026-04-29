import axiosClient from '../api/axiosClient';

const authService = {
    async register(data) {
        return await axiosClient.post('/register', data);
    },

    async login(data) {
        return await axiosClient.post('/login', data);
    },

    async logout() {
        return await axiosClient.post('/logout');
    },

    async getCurrentUser() {
        return await axiosClient.get('/user');
    },

    async verifyEmail(id, hash) {
        return await axiosClient.get(`/email/verify/${id}/${hash}`);
    },

    async resendVerification() {
        return await axiosClient.post('/email/resend');
    },
};

export default authService;