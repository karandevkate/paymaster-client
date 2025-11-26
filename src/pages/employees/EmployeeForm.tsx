import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
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
    gender: '' as 'MALE' | 'FEMALE' | 'OTHER' | '',
    password: '',
    companyId
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // NOTE: We need to ensure the gender is a valid type before API call if initialized as ''.
      if (!formData.gender) {
        toast.error('Please select the employee gender.');
        setLoading(false);
        return;
      }

      // Cast the gender back to the expected type for the API call
      await createEmployee(formData as EmployeeCreate);
      toast.success('Employee created successfully! Set-password email sent.');
      navigate('/employees');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Add Employee - PayMaster';
  }, []);

  return (
    <div className="container mt-4">
      <div className="p-4 bg-white border rounded shadow-sm">
        <h2 className="h4 fw-bold mb-4">Add New Employee</h2>

        <form onSubmit={handleSubmit} className="row g-3">

          <div className="col-md-6">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Mobile Number"
              name="contactNumber"
              type="tel"
              maxLength={10}
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />
          </div>

          {/* UPDATED GENDER FIELD */}
          <div className="col-md-6">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
              id="gender"
              name="gender"
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              {/* FIX: Added default placeholder option */}
              <option value="" disabled>Select Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          {/* END GENDER FIELD */}

          <div className="col-md-6">
            <Input
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Joining Date"
              name="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <Input
              label="Birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
            />
          </div>

          {/* BUTTONS */}
          <div className="col-12 d-flex justify-content-end gap-2 mt-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </Button>

            <Button type="submit" isLoading={loading}>
              Save Employee
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};