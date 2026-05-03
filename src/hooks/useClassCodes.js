import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import classCodeService from '../services/classCodeService';

export function useClassCodes(enabled = true) {
  return useQuery({
    queryKey: ['class-codes'],
    queryFn: classCodeService.getClassCodes,
    enabled,
  });
}

export function useCreateClassCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classCodeService.createClassCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-codes'] });
      toast.success('Class code created');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not create class code');
    },
  });
}

export function useDeleteClassCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: classCodeService.deleteClassCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-codes'] });
      toast.success('Class code deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Could not delete class code');
    },
  });
}
