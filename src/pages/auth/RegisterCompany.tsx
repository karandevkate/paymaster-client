import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select'; // ← Use your Bootstrap Select
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
    adminEmail: '',
    gender: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.gender) {
        toast.error('Please select the admin gender');
        setLoading(false);
        return;
      }

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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="card shadow-lg border-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-5">

          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="fw-bold text-primary fs-1">PayMaster</h2>
            <p className="text-muted">Register your company and admin account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="row g-3">

            {/* Company Fields */}
            <div className="col-12">
              <Input label="Company Name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <Input label="Registration Number" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <Input label="Address" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <Input label="Official Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <Input label="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
            </div>

            {/* Admin Fields */}
            <div className="col-12">
              <Input label="Admin Name" name="adminName" value={formData.adminName} onChange={handleChange} required />
            </div>
            <div className="col-12">
              <Input label="Admin Email" name="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} required />
            </div>

            {/* Gender Select */}
            <div className="col-12">
              <Select
                label="Admin Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={[
                  { value: 'MALE', label: 'Male' },
                  { value: 'FEMALE', label: 'Female' },
                  { value: 'OTHER', label: 'Other' },
                ]}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="col-12">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                block
                className="w-100 py-2"
              >
                {loading ? 'Registering...' : 'Register Company'}
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};