import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getEmployeeById } from '@/src/services/apiService';
import { Employee } from '../../types';

const ViewEmployee: React.FC = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const userRole = user?.userRole || '';
    const loggedInUserId = user?.userId || '';

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

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <div className="mt-3 text-muted">Loading employee details...</div>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="alert alert-danger mt-3">{error || 'Employee not found'}</div>
        );
    }

    const canEdit =
        userRole === 'ADMIN' || employee.employeeId === loggedInUserId;

    return (
        <div className="container py-4 mb-5">
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

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Basic & Employment Information</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th style={{ width: '40%' }}>Employee Code:</th>
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
                                        <th>Gender:</th>
                                        <td>{employee.gender || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Birthdate:</th>
                                        <td>{employee.birthdate || '-'}</td>
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
                                        <th>Location:</th>
                                        <td>{employee.location || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Joining Date:</th>
                                        <td>{employee.joiningDate || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Status:</th>
                                        <td>
                                            <span className={`badge ${employee.employeeStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                                                {employee.employeeStatus}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm h-100">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">Statutory & Bank Information</h5>
                        </div>
                        <div className="card-body">
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <th style={{ width: '40%' }}>PAN:</th>
                                        <td>{employee.pan || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>UAN Number:</th>
                                        <td>{employee.uanNumber || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>ESIC Number:</th>
                                        <td>{employee.esicNumber || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Bank Name:</th>
                                        <td>{employee.bankName || '-'}</td>
                                    </tr>
                                    <tr>
                                        <th>Account Number:</th>
                                        <td>{employee.accountNumber || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

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
    );
};

export default ViewEmployee;
