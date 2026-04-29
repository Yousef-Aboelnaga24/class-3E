import axiosClient from '../api/axiosClient';

const reactionService = {
    async toggleReaction(postId, type = 'like') {
        return await axiosClient.post(`/posts/${postId}/react`, { type });
    },
};

export default reactionService;
