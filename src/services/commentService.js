import axiosClient from '../api/axiosClient';

const commentService = {
    async getComments(postId) {
        const response = await axiosClient.get(`/posts/${postId}/comments`);
        return response.data;
    },

    async createComment(postId, content) {
        const response = await axiosClient.post(`/posts/${postId}/comments`, { content });
        return response.data;
    },

    async deleteComment(commentId) {
        const response = await axiosClient.delete(`/comments/${commentId}`);
        return response.data;
    },
};

export default commentService;
