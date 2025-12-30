import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <Loader2 className={cn('animate-spin text-[#446D6D]', sizeClasses[size], className)} />
    );
}

interface LoadingProps {
    fullScreen?: boolean;
    message?: string;
}

export function Loading({ fullScreen = false, message }: LoadingProps) {
    const containerClasses = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-white/80 z-50'
        : 'flex items-center justify-center p-8';

    return (
        <div className={containerClasses}>
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                {message && <p className="text-sm text-gray-600">{message}</p>}
            </div>
        </div>
    );
}

// Skeleton component for loading states
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-gray-200', className)}
            {...props}
        />
    );
}
