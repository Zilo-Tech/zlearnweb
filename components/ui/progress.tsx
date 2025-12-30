import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
        ref={ref}
        className={cn(
            'relative h-2 w-full overflow-hidden rounded-full bg-gray-200',
            className
        )}
        {...props}
    >
        <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-[#446D6D] transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
    </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

// Progress with percentage display
interface ProgressWithLabelProps {
    value: number;
    label?: string;
    showPercentage?: boolean;
    className?: string;
}

export function ProgressWithLabel({
    value,
    label,
    showPercentage = true,
    className,
}: ProgressWithLabelProps) {
    return (
        <div className={cn('w-full space-y-2', className)}>
            {(label || showPercentage) && (
                <div className="flex justify-between text-sm">
                    {label && <span className="text-gray-700">{label}</span>}
                    {showPercentage && <span className="text-gray-500">{value}%</span>}
                </div>
            )}
            <Progress value={value} />
        </div>
    );
}

export { Progress };
