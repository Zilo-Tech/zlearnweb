'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { Loader2, KeyRound } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const { isLoading } = useAuth(); // Assuming we might add a forgotPassword method to useAuth later
    const { toast } = useToast();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            // await forgotPassword(data.email);

            toast({
                title: 'Reset link sent',
                description: 'If an account exists with this email, you will receive a password reset link.',
                variant: 'success',
            });

        } catch (error: any) {
            toast({
                title: 'Request failed',
                description: error.message || 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-[#446D6D]/10 flex items-center justify-center text-[#446D6D]">
                        <KeyRound className="h-6 w-6" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Forgot password?</h1>
                <p className="text-sm text-gray-500">
                    No worries, we&apos;ll send you reset instructions.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        label="Email"
                        error={errors.email?.message}
                        disabled={isLoading}
                        {...register('email')}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send reset link
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
