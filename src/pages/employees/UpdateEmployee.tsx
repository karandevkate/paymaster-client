import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    getEmployeeById,
    updateEmployee,
    EmployeeResponseDto,
    EmployeeUpdateRequestDto,
} from '@/src/services/apiService';

const UpdateEmployee: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<EmployeeResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<EmployeeUpdateRequestDto>({
        name: '',
        email: '',
        contactNumber: '',
        department: '',
        birthdate: '',
        designation: '',
        gender: 'MALE',
        joiningDate: '',
        companyId: undefined
    });

    // ────────────────────────────────────────────────
    // Fetch employee details
    // ────────────────────────────────────────────────
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
                gender: data.gender || 'MALE',
                joiningDate: data.joiningDate || '',
                companyId: data.companyId
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

    // ────────────────────────────────────────────────
    // Form handlers
    // ────────────────────────────────────────────────
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // ────────────────────────────────────────────────
    // Form submit
    // ────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId) return;

        setSaving(true);

        try {
            const payload: EmployeeUpdateRequestDto = {
                ...form,
                birthdate: form.birthdate || undefined,
                joiningDate: form.joiningDate || undefined
            };

            await updateEmployee(employeeId, payload);

            toast.success('Employee updated successfully!');
            navigate(`/employees/${employeeId}`);
        } catch (err: any) {
            toast.error(err.message || 'Failed to update employee');
        } finally {
            setSaving(false);
        }
    };

    // ────────────────────────────────────────────────
    // UI States
    // ────────────────────────────────────────────────
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

    // ────────────────────────────────────────────────
    // MAIN FORM UI
    // ────────────────────────────────────────────────
    return (
        <div className="container-fluid py-4">
            <h2 className="fw-bold mb-4">Update Employee</h2>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit}>

                        {/* Name */}
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Contact Number */}
                        <div className="mb-3">
                            <label className="form-label">Contact Number</label>
                            <input
                                type="text"
                                name="contactNumber"
                                className="form-control"
                                value={form.contactNumber}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Department */}
                        <div className="mb-3">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                name="department"
                                className="form-control"
                                value={form.department}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Designation */}
                        <div className="mb-3">
                            <label className="form-label">Designation</label>
                            <input
                                type="text"
                                name="designation"
                                className="form-control"
                                value={form.designation}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Gender */}
                        <div className="mb-3">
                            <label className="form-label">Gender</label>
                            <select
                                name="gender"
                                className="form-select"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        {/* Birthdate */}
                        <div className="mb-3">
                            <label className="form-label">Birthdate</label>
                            <input
                                type="date"
                                name="birthdate"
                                className="form-control"
                                value={form.birthdate || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Joining Date */}
                        <div className="mb-3">
                            <label className="form-label">Joining Date</label>
                            <input
                                type="date"
                                name="joiningDate"
                                className="form-control"
                                value={form.joiningDate || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 d-flex gap-2">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Update Employee'}
                            </button>

                            <Link
                                to={`/employees/${employeeId}`}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </Link>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployee;
