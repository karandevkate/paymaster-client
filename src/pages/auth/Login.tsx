import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '@/src/services/apiService';
import toast from 'react-hot-toast';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

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
      const userData = await login(formData);

      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Compatibility for older components if any still use these directly
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('username', userData.username);
      localStorage.setItem('companyId', userData.companyId);
      localStorage.setItem('userRole', userData.userRole);

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
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary display-4">PayMaster</h2>
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

            <div className="col-12 mt-4">
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
