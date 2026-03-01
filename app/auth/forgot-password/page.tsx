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
                    <div className="h-14 w-14 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
                        <KeyRound className="h-7 w-7" />
                    </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900">
                    Forgot password?
                </h1>
                <p className="text-sm text-gray-600 leading-relaxed">
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

                <Button type="submit" className="w-full py-3 rounded-lg font-bold" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send reset link
                </Button>
            </form>

            <div className="text-center">
                <Link href="/auth/login" className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:underline transition">
                    &larr; Back to login
                </Link>
            </div>
        </div>
    );
}
