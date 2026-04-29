import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import postService from '../services/postService';
import toast from 'react-hot-toast';

export function usePosts(page = 1) {
    return useQuery({
        queryKey: ['posts', page],
        queryFn: () => postService.getPosts(page),
        keepPreviousData: true,
    });
}

export function usePost(id) {
    return useQuery({
        queryKey: ['post', id],
        queryFn: () => postService.getPost(id),
        enabled: !!id,
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData) => postService.createPost(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Memory shared successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to share memory.');
        },
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => postService.deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Memory deleted.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete memory.');
        },
    });
}

export function useUpdatePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => postService.updatePost(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Memory updated.');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update memory.');
        },
    });
}
