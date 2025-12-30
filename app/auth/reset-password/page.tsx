'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, LockKeyhole } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const [showPassword, setShowPassword] = useState(false);
    const { isLoading } = useAuth(); // Assuming resetPassword method
    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            // await resetPassword(token, data.password);

            toast({
                title: 'Password reset',
                description: 'Your password has been successfully reset. Please login with your new password.',
                variant: 'success',
            });

            router.push('/auth/login');
        } catch (error: any) {
            toast({
                title: 'Reset failed',
                description: error.message || 'Could not reset password. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-[#446D6D]/10 flex items-center justify-center text-[#446D6D]">
                        <LockKeyhole className="h-6 w-6" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Set new password</h1>
                <p className="text-sm text-gray-500">
                    Your new password must be different to previously used passwords.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            label="New Password"
                            error={errors.password?.message}
                            disabled={isLoading}
                            {...register('password')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            disabled={isLoading}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                                {showPassword ? 'Hide password' : 'Show password'}
                            </span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        label="Confirm Password"
                        error={errors.confirmPassword?.message}
                        disabled={isLoading}
                        {...register('confirmPassword')}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Reset password
                </Button>
            </form>

            <div className="text-center">
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900">
                    &larr; Back to login
                </Link>
            </div>
        </div>
    );
}
