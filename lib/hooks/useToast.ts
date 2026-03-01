'use client';

import { useCallback } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToast } from '@/lib/store/slices/toast.slice';

export function useToast() {
  const dispatch = useAppDispatch();
  const toast = useCallback(
    (opts: { title: string; description?: string; variant?: 'default' | 'destructive' | 'success' }) => {
      dispatch(addToast(opts));
    },
    [dispatch]
  );
  return { toast };
}
