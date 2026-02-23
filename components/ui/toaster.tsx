'use client';

import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from '@/components/ui/toast';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { removeToast } from '@/lib/store/slices/toast.slice';

export function Toaster() {
    const toasts = useAppSelector((s) => s.toast?.toasts ?? []);
    const dispatch = useAppDispatch();
    return (
        <ToastProvider>
            {toasts.map((t) => (
                <Toast
                    key={t.id}
                    variant={t.variant}
                    onOpenChange={(open) => { if (!open) dispatch(removeToast(t.id)); }}
                >
                    <ToastTitle>{t.title}</ToastTitle>
                    {t.description && <ToastDescription>{t.description}</ToastDescription>}
                    <ToastClose />
                </Toast>
            ))}
            <ToastViewport />
        </ToastProvider>
    );
}
