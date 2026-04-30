import axiosClient from '../api/axiosClient';

const authService = {
    async register(data) {
        const res = await axiosClient.post('/register', data);
        return res;
    },

    async login(data) {
        const res = await axiosClient.post('/login', data);
        return res;
    },

    async logout() {
        const res = await axiosClient.post('/logout');
        return res;
    },

    async getCurrentUser() {
        const res = await axiosClient.get('/user');
        return res;
    },

    async verifyEmail(id) {
        const res = await axiosClient.get(`/email/verify/${id}`);
        return res;
    },

    async resendVerification() {
        const res = await axiosClient.post('/email/resend');
        return res;
    },
};

export default authService;