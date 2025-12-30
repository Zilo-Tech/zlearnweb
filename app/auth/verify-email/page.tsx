'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';

const verifySchema = z.object({
    code: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
});

type VerifyFormData = z.infer<typeof verifySchema>;

import { Suspense } from 'react';

function VerifyEmailContent() {
    const { verifyEmail, isLoading } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get('email');

    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyFormData>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        },
    });

    const onSubmit = async (data: VerifyFormData) => {
        try {
            await verifyEmail(data.code);

            toast({
                title: 'Email verified!',
                description: 'Your account has been successfully verified.',
                variant: 'success',
            });

            router.push('/onboarding/country');
        } catch (error: any) {
            toast({
                title: 'Verification failed',
                description: error.message || 'Invalid verification code. Please try again.',
                variant: 'destructive',
            });
        }
    };

    const handleResendCode = async () => {
        if (resendCooldown > 0) return;

        try {
            setResendCooldown(60);
            toast({
                title: 'Code resent',
                description: 'A new verification code has been sent to your email.',
                variant: 'success',
            });
        } catch (error: any) {
            toast({
                title: 'Failed to resend',
                description: error.message || 'Could not resend code. Please try again later.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-[#446D6D]/10 flex items-center justify-center text-[#446D6D]">
                        <Mail className="h-6 w-6" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Check your email</h1>
                <p className="text-sm text-gray-500">
                    We sent a verification code to <span className="font-medium text-gray-900">{email || 'your email'}</span>.
                    Enter the code below to verify your account.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        id="code"
                        type="text"
                        placeholder="123456"
                        label="Verification Code"
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                        error={errors.code?.message}
                        disabled={isLoading}
                        {...register('code')}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify email
                </Button>
            </form>

            <div className="text-center text-sm text-gray-500">
                Didn&apos;t receive the code?{' '}
                <button
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isLoading}
                    className="font-medium text-[#446D6D] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Click to resend'}
                </button>
            </div>

            <div className="text-center">
                <Link href="/auth/login" className="text-sm text-gray-500 hover:text-gray-900">
                    &larr; Back to login
                </Link>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#446D6D]" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
