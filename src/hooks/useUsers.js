import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import userService from '../services/userService';

function getNextPageParam(lastPage) {
    const payload = lastPage?.data || lastPage;
    const meta = payload?.meta || payload;

    if (meta?.current_page && meta?.last_page && meta.current_page < meta.last_page) {
        return meta.current_page + 1;
    }

    if (payload?.next_page_url || meta?.next_page_url) {
        return (meta?.current_page || payload?.current_page || 1) + 1;
    }

    return undefined;
}

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
    return useInfiniteQuery({
        queryKey: ['userPosts', id, page],
        queryFn: ({ pageParam = page }) => userService.getUserPosts(id, pageParam),
        initialPageParam: page,
        getNextPageParam,
        enabled: !!id,
    });
}

/* =========================
   ✏️ Profile Update (SELF)
========================= */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ formData }) => userService.updateProfile(formData),

        onSuccess: (res) => {
            const user = res?.user || res?.data?.user || res?.data || res;

            if (user?.id) {
                queryClient.setQueryData(['user', user.id], user);
            }

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
            await queryClient.cancelQueries({ queryKey: ['users'] });

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
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

/* =========================
   User Delete (ADMIN)
========================= */
export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => userService.deleteUser(id),

        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['users'] });

            const previousUsers = queryClient.getQueryData(['users']);

            queryClient.setQueryData(['users'], (old) => {
                const data = old?.data || old;
                const filtered = Array.isArray(data)
                    ? data.filter((u) => u.id !== id)
                    : data;

                return old?.data
                    ? { ...old, data: filtered }
                    : filtered;
            });

            return { previousUsers };
        },

        onSuccess: () => {
            toast.success('User removed successfully');
        },

        onError: (error, _, context) => {
            if (context?.previousUsers) {
                queryClient.setQueryData(['users'], context.previousUsers);
            }

            toast.error(
                error.response?.data?.message || 'User delete failed'
            );
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}
