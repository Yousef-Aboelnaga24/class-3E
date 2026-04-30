import axiosClient from '../api/axiosClient';

const messageService = {
    async getReceivedMessages(page = 1) {
        return await axiosClient.get(`/messages/received?page=${page}`);
    },

    async getSentMessages(page = 1) {
        return await axiosClient.get(`/messages/sent?page=${page}`);
    },

    async sendMessage(receiverId, content, isAnonymous = false) {
        return await axiosClient.post('/messages', {
            receiver_id: receiverId,
            content,
            is_anonymous: isAnonymous,
        });
    },
};

export default messageService;
