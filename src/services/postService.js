import axiosClient from '../api/axiosClient';

const postService = {
    async getPosts(page = 1) {
        const response = await axiosClient.get(`/posts?page=${page}`);
        return response.data;
    },

    async getPost(id) {
        const response = await axiosClient.get(`/posts/${id}`);
        return response.data;
    },

    async createPost(formData) {
        const response = await axiosClient.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async updatePost(id, data) {
        const response = await axiosClient.put(`/posts/${id}`, data);
        return response.data;
    },

    async deletePost(id) {
        const response = await axiosClient.delete(`/posts/${id}`);
        return response.data;
    },
};

export default postService;
