'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/lib/hooks/useToast';
import { SocialAuth } from './social-auth';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().default(false),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [backendError, setBackendError] = useState<string | null>(null);
    const { login, isLoading, error } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setBackendError(null);
        try {
            await login({
                email: data.email,
                password: data.password,
            });

            toast({
                title: 'Welcome back!',
                description: 'You have successfully logged in.',
                variant: 'success',
            });

            router.push('/app/dashboard');
        } catch (error: any) {
            const errorMessage = error.message || error || 'Please check your credentials and try again.';
            setBackendError(errorMessage);
            toast({
                title: 'Login failed',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    // Clear backend error when user starts typing
    useEffect(() => {
        if (backendError) {
            setBackendError(null);
        }
    }, []);

    return (
        <Card className="border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1 px-0 lg:px-6">
                <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">Welcome back</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    Enter your credentials to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0 lg:px-6">
                {backendError && (
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-red-800">Login Failed</h3>
                            <p className="text-sm text-red-700 mt-1">{backendError}</p>
                        </div>
                    </div>
                )}
                <SocialAuth isLoading={isLoading} />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
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

                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                label="Password"
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

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="rememberMe"
                                {...register('rememberMe')}
                                disabled={isLoading}
                            />
                            <label
                                htmlFor="rememberMe"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Remember me
                            </label>
                        </div>
                        <Link
                            href="/auth/forgot-password"
                            className="text-sm font-medium text-[#446D6D] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign in
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-wrap items-center justify-center gap-1 px-0 lg:px-6">
                <span className="text-sm text-gray-500">Don&apos;t have an account?</span>
                <Link href="/auth/register" className="text-sm font-medium text-[#446D6D] hover:underline">
                    Sign up
                </Link>
            </CardFooter>
        </Card>
    );
}
