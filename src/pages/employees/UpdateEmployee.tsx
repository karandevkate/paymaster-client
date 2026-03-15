import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    getEmployeeById,
    updateEmployee,
    EmployeeUpdate,
} from '@/src/services/apiService';
import { Employee, Gender } from '../../types';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const UpdateEmployee: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<EmployeeUpdate>({
        name: '',
        email: '',
        contactNumber: '',
        department: '',
        birthdate: '',
        designation: '',
        gender: Gender.MALE,
        joiningDate: '',
        pan: '',
        bankName: '',
        accountNumber: '',
        esicNumber: '',
        uanNumber: '',
        location: '',
        companyId: ''
    });

    const fetchEmployee = async () => {
        if (!employeeId) return;

        try {
            setLoading(true);
            const data = await getEmployeeById(employeeId);
            setEmployee(data);

            setForm({
                name: data.name || '',
                email: data.email || '',
                contactNumber: data.contactNumber || '',
                department: data.department || '',
                birthdate: data.birthdate || '',
                designation: data.designation || '',
                gender: data.gender || Gender.MALE,
                joiningDate: data.joiningDate || '',
                pan: data.pan || '',
                bankName: data.bankName || '',
                accountNumber: data.accountNumber || '',
                esicNumber: data.esicNumber || '',
                uanNumber: data.uanNumber || '',
                location: data.location || '',
                companyId: data.companyId || ''
            });
        } catch (err: any) {
            const msg = err.message || 'Failed to fetch employee';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [employeeId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId) return;

        setSaving(true);

        try {
            await updateEmployee(employeeId, form);
            toast.success('Employee updated successfully!');
            navigate(`/employees/${employeeId}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message || err.message || 'Failed to update employee');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 text-muted">Loading employee details...</p>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="alert alert-danger mt-3">
                {error || 'Employee not found'}
            </div>
        );
    }

    return (
        <div className="container py-4 mb-5">
            <h2 className="fw-bold mb-4">Update Employee</h2>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-12">
                            <h5 className="border-bottom pb-2 mb-3 text-primary">Basic Information</h5>
                        </div>

                        <div className="col-md-6">
                            <Input label="Name" name="name" value={form.name} onChange={handleChange} required />
                        </div>

                        <div className="col-md-6">
                            <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                        </div>

                        <div className="col-md-4">
                            <Input label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} required />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Gender</label>
                            <select name="gender" className="form-select" value={form.gender} onChange={handleChange} required>
                                <option value={Gender.MALE}>Male</option>
                                <option value={Gender.FEMALE}>Female</option>
                                <option value={Gender.OTHER}>Other</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <Input label="Birthdate" name="birthdate" type="date" value={form.birthdate} onChange={handleChange} required />
                        </div>

                        <div className="col-12 mt-4">
                            <h5 className="border-bottom pb-2 mb-3 text-primary">Employment Details</h5>
                        </div>

                        <div className="col-md-4">
                            <Input label="Department" name="department" value={form.department} onChange={handleChange} required />
                        </div>

                        <div className="col-md-4">
                            <Input label="Designation" name="designation" value={form.designation} onChange={handleChange} required />
                        </div>

                        <div className="col-md-4">
                            <Input label="Joining Date" name="joiningDate" type="date" value={form.joiningDate} onChange={handleChange} required />
                        </div>

                        <div className="col-md-4">
                            <Input label="Location" name="location" value={form.location} onChange={handleChange} required />
                        </div>

                        <div className="col-12 mt-4">
                            <h5 className="border-bottom pb-2 mb-3 text-primary">Statutory & Bank Details</h5>
                        </div>

                        <div className="col-md-4">
                            <Input label="PAN" name="pan" value={form.pan} onChange={handleChange} required />
                        </div>

                        <div className="col-md-4">
                            <Input label="UAN Number" name="uanNumber" value={form.uanNumber} onChange={handleChange} />
                        </div>

                        <div className="col-md-4">
                            <Input label="ESIC Number" name="esicNumber" value={form.esicNumber} onChange={handleChange} />
                        </div>

                        <div className="col-md-6">
                            <Input label="Bank Name" name="bankName" value={form.bankName} onChange={handleChange} required />
                        </div>

                        <div className="col-md-6">
                            <Input label="Account Number" name="accountNumber" value={form.accountNumber} onChange={handleChange} required />
                        </div>

                        <div className="mt-4 d-flex gap-2 justify-content-end">
                            <Button type="button" variant="secondary" onClick={() => navigate(`/employees/${employeeId}`)}>
                                Cancel
                            </Button>
                            <Button type="submit" isLoading={saving}>
                                Update Employee
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployee;
