import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Employee,
  getEmployeesByCompany,
  deactivateEmployee,
  sendSetPasswordEmail,
} from '@/src/services/apiService';

export const EmployeeList: React.FC = () => {
  const userRole = localStorage.getItem('userRole') || '';
  const loggedInUserId = localStorage.getItem('userId') || '';
  const companyId = localStorage.getItem('companyId');

  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // ────────────────────────────────────────────────
  // Fetch Employees
  // ────────────────────────────────────────────────
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!companyId) throw new Error('Company ID not found');

      if (userRole !== 'EMPLOYEE') {
        const data = await getEmployeesByCompany(companyId);
        setEmployees(data);
      }

      toast.success('Employee list refreshed');
    } catch (err: any) {
      const msg = err.message || 'Failed to load employees';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  // Redirect employee to self profile
  // ────────────────────────────────────────────────
  useEffect(() => {
    document.title = 'Employees - PayMaster';

    if (userRole.toUpperCase() === 'EMPLOYEE' && loggedInUserId) {
      navigate(`/employees/${loggedInUserId}`);
      return;
    }

    fetchEmployees();
  }, []);

  // ────────────────────────────────────────────────
  // Actions
  // ────────────────────────────────────────────────
  const handleDeactivate = async (employeeId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this employee?')) return;

    try {
      await deactivateEmployee(employeeId);
      toast.success('Employee deactivated successfully');
      fetchEmployees();
    } catch (err: any) {
      toast.error(err.message || 'Failed to deactivate');
    }
  };

  const handleSendSetPasswordEmail = async (employeeId: string) => {
    try {
      await sendSetPasswordEmail(employeeId);
      toast.success('Set-password email sent successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send email');
    }
  };

  // ────────────────────────────────────────────────
  // Filter
  // ────────────────────────────────────────────────
  const filteredList = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.empcode.toLowerCase().includes(search.toLowerCase())
  );

  // ────────────────────────────────────────────────
  // ROLE-BASED BUTTON LOGIC (Corrected)
  // ────────────────────────────────────────────────

  const canEdit = (emp: Employee) =>
    userRole === 'ADMIN' || userRole === 'HR' || emp.employeeId === loggedInUserId;

  const canToggleStatus = userRole === 'ADMIN';

  const canSendPasswordEmail = userRole !== 'ADMIN';

  // ────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <h2 className="mb-0 fw-bold text-dark">Employees</h2>

          <button
            onClick={fetchEmployees}
            className="btn btn-outline-secondary btn-sm d-flex align-items-center p-1"
            title="Refresh"
            disabled={loading}
          >
            <i
              className={`bi bi-arrow-clockwise ${loading ? 'bi-spin' : ''}`}
              style={{ fontSize: '1.25rem' }}
            />
          </button>
        </div>

        <Link to="/employees/add">
          <button className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-lg me-2" />
            Add Employee
          </button>
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {/* Search */}
          <div className="mb-4">
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted" />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search by Name or Code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2" />
              {error}
            </div>
          )}

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Designation</th>
                  <th className="text-center">Status</th>
                  <th className="text-center" style={{ width: '240px' }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5">
                      <div className="spinner-border text-primary" role="status" />
                      <div className="mt-3 text-muted">Loading employees...</div>
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-5 text-muted">
                      <i className="bi bi-inbox display-4 mb-3" />
                      <p className="mb-0">No employees found</p>
                      {search && <small>Try adjusting your search</small>}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((emp) => (
                    <tr key={emp.employeeId}>
                      <td className="font-monospace text-secondary fw-semibold">
                        {emp.empcode}
                      </td>

                      <td title={emp.name}>{emp.name}</td>

                      <td title={emp.department}>{emp.department || '-'}</td>

                      <td title={emp.contactNumber}>{emp.contactNumber || '-'}</td>

                      <td title={emp.email}>{emp.email || '-'}</td>

                      <td title={emp.designation}>{emp.designation || '-'}</td>

                      <td className="text-center">
                        <span
                          className={`badge rounded-pill px-2 py-1 text-white ${emp.employeeStatus === 'Active' ? 'bg-success' : 'bg-secondary'
                            }`}
                        >
                          {emp.employeeStatus.toUpperCase()}
                        </span>
                      </td>

                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1 flex-wrap">
                          {/* View */}
                          <Link
                            to={`/employees/${emp.employeeId}`}
                            className="btn btn-sm btn-primary"
                            title="View"
                          >
                            <i className="bi bi-eye-fill" />
                          </Link>

                          {/* Edit — fixed logic */}
                          {canEdit(emp) && (
                            <Link
                              to={`/employees/${emp.employeeId}/edit`}
                              className="btn btn-sm btn-warning text-white"
                              title="Edit"
                            >
                              <i className="bi bi-pencil-fill" />
                            </Link>
                          )}

                          {/* Activate / Deactivate */}
                          {canToggleStatus && (
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeactivate(emp.employeeId)}
                              title={
                                emp.employeeStatus === 'Active'
                                  ? 'Deactivate'
                                  : 'Activate'
                              }
                            >
                              <i className="bi bi-person-x-fill" />
                            </button>
                          )}

                          {/* Send Password Email */}
                          {canSendPasswordEmail && (
                            <button
                              className="btn btn-sm btn-info text-white"
                              title="Send Set Password Email"
                              onClick={() => handleSendSetPasswordEmail(emp.employeeId)}
                            >
                              <i className="bi bi-envelope-fill" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {!loading && employees.length > 0 && (
            <div className="mt-3 text-muted small">
              Showing {filteredList.length} of {employees.length} employee
              {employees.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
