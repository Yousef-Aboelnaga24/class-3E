import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import confessionService from '../services/confessionService';
import toast from 'react-hot-toast';

export function useConfessions() {
    return useQuery({
        queryKey: ['confessions'],
        queryFn: confessionService.getConfessions,
    });
}

export function useCreateConfession() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => confessionService.createConfession(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['confessions'] });
            toast.success('Your secret is safe with us! 🤫');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to post confession.');
        },
    });
}
