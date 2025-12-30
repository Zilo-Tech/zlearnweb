import { useAppDispatch } from '../store/hooks';
import { addToast, Toast } from '../store/slices/toast.slice';
import { useCallback } from 'react';

export function useToast() {
    const dispatch = useAppDispatch();

    const toast = useCallback(
        (options: Omit<Toast, 'id'>) => {
            dispatch(addToast(options));
        },
        [dispatch]
    );

    const success = useCallback(
        (title: string, description?: string) => {
            toast({ title, description, variant: 'success' });
        },
        [toast]
    );

    const error = useCallback(
        (title: string, description?: string) => {
            toast({ title, description, variant: 'destructive' });
        },
        [toast]
    );

    return { toast, success, error };
}
