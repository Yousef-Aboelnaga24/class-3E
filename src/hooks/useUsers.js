import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userService from '../services/userService';

export function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
    });
}

export function useUser(id) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => userService.getUser(id),
        enabled: !!id,
    });
}

export function useUserPosts(id, page = 1) {
    return useQuery({
        queryKey: ['userPosts', id, page],
        queryFn: () => userService.getUserPosts(id, page),
        enabled: !!id,
    });
}

/* =========================
   ✏️ Profile Update (SELF)
========================= */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userService.updateProfile,

        onSuccess: (res) => {
            const user = res?.data || res;

            queryClient.setQueryData(['user', user.id], user);

            toast.success('Profile updated successfully');
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message || 'Profile update failed'
            );
        },
    });
}

/* =========================
   👑 Role Update (ADMIN)
========================= */
export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, role }) =>
            userService.updateUserRole(id, role),

        onMutate: async ({ id, role }) => {
            await queryClient.cancelQueries(['users']);

            const previousUsers = queryClient.getQueryData(['users']);

            queryClient.setQueryData(['users'], (old) => {
                const data = old?.data || old;

                const updated = data?.map((u) =>
                    u.id === id ? { ...u, role } : u
                );

                return old?.data
                    ? { ...old, data: updated }
                    : updated;
            });

            return { previousUsers };
        },

        onSuccess: () => {
            toast.success('Role updated successfully');
        },

        onError: (error, _, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }

            toast.error(
                error.response?.data?.message || 'Role update failed'
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries(['users']);
        },
    });
}