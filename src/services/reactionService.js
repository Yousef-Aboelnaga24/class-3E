import axiosClient from '../api/axiosClient';

const reactionService = {
    async toggleReaction(postId, type = 'like') {
        const response = await axiosClient.post(`/posts/${postId}/react`, { type });
        return response.data;
    },
};

export default reactionService;
