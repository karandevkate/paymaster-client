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
        if (!token) {
            toast.error('Invalid or missing token');
            return;
        }

        setLoading(true);
        try {
            await setPassword(token, password);
            toast.success('Password set successfully! You can now log in.');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
            <div className="card shadow-lg border-0" style={{ maxWidth: '450px', width: '100%' }}>
                <div className="card-body p-5">

                    {/* Title */}
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-primary fs-3">Set Your Password</h2>
                        <p className="text-muted">Create a secure password for your admin account</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-12">
                            <Input
                                label="New Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPasswordValue(e.target.value)}
                                placeholder="Enter a strong password"
                                required
                            />
                        </div>

                        <div className="col-12">
                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                block
                                className="w-100 py-2"
                            >
                                {loading ? 'Setting Password...' : 'Set Password'}
                            </Button>
                        </div>
                    </form>

                    {/* Optional: Back to Login */}
                    <div className="text-center mt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-muted text-decoration-none btn btn-link"
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};