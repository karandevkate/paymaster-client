import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

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
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      const { token, userId, username, companyId, userRole } = response.data;

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
      <div className="card shadow-lg p-4" style={{ maxWidth: '420px', width: '100%', position: 'relative' }}>

        <div className="text-center">
          <img
            src="logo.png"
            alt="Logo"
            className="mx-auto d-block"
            style={{ width: '80px', height: '80px', objectFit: 'contain' }}
          />
        </div>

        <div className="text-center  mb-4">
          <h2 className="fw-bold">Welcome Back</h2>
          <p className="text-muted">Sign in to manage your payroll</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="d-grid gap-3">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button type="submit" isLoading={loading} className="btn btn-primary w-100">
            Login
          </Button>
        </form>

        <p className="text-center mt-3 text-muted">
          Need to register a company?{' '}
          <Link to="/register-company" className="fw-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
