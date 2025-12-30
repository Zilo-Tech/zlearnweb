import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login - Z-Learn',
    description: 'Login to your Z-Learn account',
};

export default function LoginPage() {
    return <LoginForm />;
}
