import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { createEmployee, EmployeeCreate } from '@/src/services/apiService';
import toast from 'react-hot-toast';

export const EmployeeForm: React.FC = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const companyId = localStorage.getItem('companyId') || '';

  const [formData, setFormData] = useState<EmployeeCreate>({
    name: '',
    email: '',
    contactNumber: '',
    department: '',
    designation: '',
    joiningDate: today,
    birthdate: '',
    password: '',
    companyId
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createEmployee(formData);
      toast.success('Employee created successfully! Set-password email sent.');
      navigate('/employees');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    document.title = "Add Employee - PayMaster";
  })

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Employee</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <Input label="Mobile Number" name="contactNumber" type="tel" value={formData.contactNumber} maxLength={10} onChange={handleChange} required />
        <Input label="Department" name="department" value={formData.department} onChange={handleChange} required />
        <Input label="Designation" name="designation" value={formData.designation} onChange={handleChange} required />
        <Input label="Joining Date" name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} required />
        <Input label="Birthdate" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} />
        <div className="col-span-1 md:col-span-2 flex justify-end gap-4 mt-4">
          <Button type="button" variant="outline" onClick={() => navigate('/employees')}>Cancel</Button>
          <Button type="submit" isLoading={loading}>Save Employee</Button>
        </div>
      </form>
    </div>
  );
};
