import { RegisterForm } from '@/components/auth/register-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register - Z-Learn',
    description: 'Create your Z-Learn account',
};

export default function RegisterPage() {
    return <RegisterForm />;
}
