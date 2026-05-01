import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import eventService from '../services/eventService';

export function useEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: eventService.getEvents,
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eventService.createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Timeline event added');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Could not add timeline event');
        },
    });
}

export function useUpdateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }) => eventService.updateEvent(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Timeline event updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Could not update timeline event');
        },
    });
}

export function useDeleteEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: eventService.deleteEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] });
            toast.success('Timeline event deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Could not delete timeline event');
        },
    });
}
