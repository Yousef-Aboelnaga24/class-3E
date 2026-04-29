import axiosClient from '../api/axiosClient';

const postService = {
    async getPosts(page = 1) {
        return await axiosClient.get(`/posts?page=${page}`);
    },

    async getPost(id) {
        return await axiosClient.get(`/posts/${id}`);
    },

    async createPost(formData) {
        return await axiosClient.post('/posts', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    async updatePost(id, data) {
        return await axiosClient.put(`/posts/${id}`, data);
    },

    async deletePost(id) {
        return await axiosClient.delete(`/posts/${id}`);
    },
};

export default postService;
