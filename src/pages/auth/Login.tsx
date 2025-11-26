import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@/src/services/apiService';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';   // ← Your Bootstrap Input
import { Button } from '../../components/ui/Button';   // ← Your Bootstrap Button

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, userId, username, companyId, userRole } = await login(formData);

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('companyId', companyId);
      localStorage.setItem('userRole', userRole);

      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-3">
      <div className="card shadow-lg border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body p-5">

          {/* Logo */}
          <div className="  mb-4">
            <img
              src="/logo.png"
              alt="payMaster Logo"
              className="img-fluid justify-content-center align-items-center"
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
          </div>

          {/* Title */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">Welcome Back</h2>
            <p className="text-muted">Sign in to manage your payroll</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-12">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="col-12">
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
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
                Login
              </Button>
            </div>
          </form>

          {/* Register Link */}
          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Need to register a company?{' '}
              <Link to="/register-company" className="text-primary fw-semibold text-decoration-none">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};