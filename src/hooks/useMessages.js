import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import messageService from '../services/messageService';
import toast from 'react-hot-toast';

export function useReceivedMessages(page = 1) {
    return useQuery({
        queryKey: ['messages', 'received', page],
        queryFn: () => messageService.getReceivedMessages(page),
        keepPreviousData: true,
    });
}

export function useSentMessages(page = 1) {
    return useQuery({
        queryKey: ['messages', 'sent', page],
        queryFn: () => messageService.getSentMessages(page),
        keepPreviousData: true,
    });
}

export function useSendMessage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ receiverId, content, isAnonymous }) =>
            messageService.sendMessage(receiverId, content, isAnonymous),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'sent'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'received'] });
            toast.success('Message sent successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to send message.');
        },
    });
}
