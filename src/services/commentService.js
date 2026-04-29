import axiosClient from '../api/axiosClient';

const commentService = {
    async getComments(postId) {
        return await axiosClient.get(`/posts/${postId}/comments`);
    },

    async createComment(postId, content) {
        return await axiosClient.post(`/posts/${postId}/comments`, { content });
    },

    async deleteComment(commentId) {
        return await axiosClient.delete(`/comments/${commentId}`);
    },
};

export default commentService;
