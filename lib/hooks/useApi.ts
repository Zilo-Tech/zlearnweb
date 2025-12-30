import { useState, useCallback } from 'react';

interface UseApiOptions<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
}

export function useApi<T = any>(
    apiFunction: (...args: any[]) => Promise<T>,
    options?: UseApiOptions<T>
) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(
        async (...args: any[]) => {
            setIsLoading(true);
            setError(null);

            try {
                const result = await apiFunction(...args);
                setData(result);

                if (options?.onSuccess) {
                    options.onSuccess(result);
                }

                return result;
            } catch (err: any) {
                const errorMessage = err.message || 'An error occurred';
                setError(errorMessage);

                if (options?.onError) {
                    options.onError(errorMessage);
                }

                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        [apiFunction, options]
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setIsLoading(false);
    }, []);

    return {
        data,
        isLoading,
        error,
        execute,
        reset,
    };
}
