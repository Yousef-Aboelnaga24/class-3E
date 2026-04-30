import axiosClient from '../api/axiosClient';

const userService = {
    async getUsers() {
        return await axiosClient.get('/users');
    },

    async getUser(id) {
        return await axiosClient.get(`/users/${id}`);
    },

    async getUserPosts(id, page = 1) {
        return await axiosClient.get(`/users/${id}/posts?page=${page}`);
    },

    async updateProfile(formData) {
        return await axiosClient.post('/profile', formData);
    },

    async updateUserRole(id, role) {
        return await axiosClient.post(`/users/${id}/role`, { role });
    },
};

export default userService;