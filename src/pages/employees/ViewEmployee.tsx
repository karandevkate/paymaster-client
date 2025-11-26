import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getEmployeeById, EmployeeResponseDto } from '@/src/services/apiService';

const ViewEmployee: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const [employee, setEmployee] = useState<EmployeeResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userRole = localStorage.getItem('userRole');
    const loggedInUserId = localStorage.getItem('userId');

    const fetchEmployee = async () => {
        if (!employeeId) {
            toast.error('Employee ID is missing');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await getEmployeeById(employeeId);
            setEmployee(data);

        } catch (err: any) {
            const msg = err.message || 'Failed to fetch employee';
            setError(msg);
            toast.error(msg);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = 'View Employee - PayMaster';
        fetchEmployee();
    }, [employeeId]);

    // ────────────────────────────────
    // Loading State
    // ────────────────────────────────
    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <div className="mt-3 text-muted">Loading employee details...</div>
            </div>
        );
    }

    // ────────────────────────────────
    // Error state
    // ────────────────────────────────
    if (error || !employee) {
        return (
            <div className="alert alert-danger mt-3">{error || 'Employee not found'}</div>
        );
    }

    // ────────────────────────────────
    // Allow edit only if:
    // ADMIN → always
    // EMPLOYEE → only their own record
    // ────────────────────────────────
    const canEdit =
        userRole === 'ADMIN' || employee.employeeId === loggedInUserId;

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold mb-0">Employee Details</h2>

                <button
                    onClick={fetchEmployee}
                    className="btn btn-outline-secondary btn-sm"
                    title="Refresh"
                >
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
            </div>

            <div className="card shadow-sm">
                <div className="card-body p-4">

                    <table className="table table-borderless mb-0">
                        <tbody>
                            <tr>
                                <th>Employee Code:</th>
                                <td>{employee.empcode}</td>
                            </tr>
                            <tr>
                                <th>Name:</th>
                                <td>{employee.name}</td>
                            </tr>
                            <tr>
                                <th>Email:</th>
                                <td>{employee.email}</td>
                            </tr>
                            <tr>
                                <th>Contact Number:</th>
                                <td>{employee.contactNumber || '-'}</td>
                            </tr>
                            <tr>
                                <th>Department:</th>
                                <td>{employee.department || '-'}</td>
                            </tr>
                            <tr>
                                <th>Designation:</th>
                                <td>{employee.designation || '-'}</td>
                            </tr>
                            <tr>
                                <th>Role:</th>
                                <td>{employee.role}</td>
                            </tr>
                            <tr>
                                <th>Status:</th>
                                <td>{employee.employeeStatus}</td>
                            </tr>
                            <tr>
                                <th>Joining Date:</th>
                                <td>{employee.joiningDate || '-'}</td>
                            </tr>
                            <tr>
                                <th>Birthdate:</th>
                                <td>{employee.birthdate || '-'}</td>
                            </tr>
                            <tr>
                                <th>Gender:</th>
                                <td>{employee.gender || '-'}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <Link to="/employees" className="btn btn-secondary me-2">
                            Back to List
                        </Link>

                        {canEdit && (
                            <Link
                                to={`/employees/${employee.employeeId}/edit`}
                                className="btn btn-warning text-white"
                            >
                                Edit
                            </Link>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ViewEmployee;
