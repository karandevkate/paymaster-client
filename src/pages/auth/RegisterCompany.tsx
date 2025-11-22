import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { CompanyRegisterData, registerCompany } from '@/src/services/apiService';
import toast from 'react-hot-toast';

export const RegisterCompany: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CompanyRegisterData>({
    name: '',
    email: '',
    contactNumber: '',
    address: '',
    registrationNumber: '',
    adminName: '',
    adminEmail: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerCompany(formData);
      toast.success('Company and Admin registered successfully! Email sent for setting password.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">PayMaster</h2>
          <p className="text-gray-500 mt-2">Register your company and admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Registration Number"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
          />
          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <Input
            label="Official Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />

          {/* Admin fields */}
          <Input
            label="Admin Name"
            name="adminName"
            value={formData.adminName}
            onChange={handleChange}
            required
          />
          <Input
            label="Admin Email"
            name="adminEmail"
            type="email"
            value={formData.adminEmail}
            onChange={handleChange}
            required
          />

          <Button type="submit" className="w-full" isLoading={loading}>
            {loading ? 'Registering...' : 'Register Company'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already registered?{' '}
          <Link to="/login" className="text-primary-600 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};
