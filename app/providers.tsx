'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/lib/store';
import { Toaster } from '@/components/ui/toaster';
import { Suspense, useEffect, useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Provider store={store}>
                {children}
                <Toaster />
            </Provider>
        );
    }

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Suspense fallback={null}>
                    {children}
                    <Toaster />
                </Suspense>
            </PersistGate>
        </Provider>
    );
}
