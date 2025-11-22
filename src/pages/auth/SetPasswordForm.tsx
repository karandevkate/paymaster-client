import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { setPassword } from '@/src/services/apiService';

export const SetPasswordForm: React.FC = () => {
    const [password, setPasswordValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return toast.error('Invalid token');

        setLoading(true);
        try {
            await setPassword(token, password);
            toast.success('Password set successfully!');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Set Your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPasswordValue(e.target.value)}
                        required
                    />
                    <Button type="submit" className="w-full" isLoading={loading}>
                        Set Password
                    </Button>
                </form>
            </div>
        </div>
    );
};
