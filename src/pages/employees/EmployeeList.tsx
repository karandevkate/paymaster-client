import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Employee, getEmployeesByCompany } from '@/src/services/apiService';
import toast from 'react-hot-toast';

export const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const companyId = localStorage.getItem('companyId');
      if (!companyId) throw new Error('Company ID not found');

      const data = await getEmployeesByCompany(companyId);
      setEmployees(data);
      toast.success('Employee list refreshed');
    } catch (err: any) {
      setError(err.message || 'Failed to load employees');
      toast.error(err.message || 'Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Employees - PayMaster";
    fetchEmployees();
  }, []);

  const filteredList = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.empcode.toLowerCase().includes(search.toLowerCase())
  );

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
            ></i>
          </button>
        </div>
        <Link to="/employees/add">
          <button className="btn btn-primary shadow-sm">
            <i className="bi bi-plus-lg me-2"></i>Add Employee
          </button>
        </Link>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {/* Search */}
          <div className="mb-4">
            <div className="input-group" style={{ maxWidth: '400px' }}>
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
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
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {/* Employee Table */}
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '90px' }}>Code</th>
                  <th style={{ width: '130px' }}>Name</th>
                  <th style={{ width: '120px' }}>Department</th>
                  <th style={{ width: '120px' }}>Mobile No. </th>
                  <th style={{ width: '120px' }}>Email</th>
                  <th style={{ width: '40px' }}>Designation</th>
                  <th className="text-center" style={{ width: '85px' }}>Status</th>
                  <th className="text-center" style={{ width: '135px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5">
                      <div className="spinner-border text-primary" role="status" />
                      <div className="mt-3 text-muted">Loading employees...</div>
                    </td>
                  </tr>
                ) : filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-muted">
                      <i className="bi bi-inbox display-4 text-muted d-block mb-3"></i>
                      <p className="mb-0">No employees found</p>
                      {search && <small>Try adjusting your search term</small>}
                    </td>
                  </tr>
                ) : (
                  filteredList.map((emp) => (
                    <tr key={emp.employeeId}>
                      <td className="font-monospace text-secondary fw-semibold">{emp.empcode}</td>
                      <td className="fw-medium text-truncate" style={{ maxWidth: '130px' }} title={emp.name}>
                        {emp.name}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={emp.department}>
                        {emp.department || '-'}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={emp.contactNumber}>
                        {emp.contactNumber || '-'}
                      </td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }} title={emp.email}>
                        {emp.email || '-'}
                      </td>

                      <td className="text-truncate" style={{ maxWidth: '40px' }} title={emp.designation}>
                        {emp.designation || '-'}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill px-2 py-1 fw-medium text-white ${emp.employeeStatus === 'Active' ? 'bg-success' : 'bg-secondary'
                            }`}
                          style={{ fontSize: '0.7rem', minWidth: '85px' }}
                        >
                          {emp.employeeStatus === 'Active' ? 'ACTIVE' : emp.employeeStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1">
                          <Link to={`/employees/${emp.employeeId}`} className="btn btn-sm btn-primary" title="View">
                            <i className="bi bi-eye-fill"></i>
                          </Link>
                          <Link to={`/employees/${emp.employeeId}/edit`} className="btn btn-sm btn-warning text-white" title="Edit">
                            <i className="bi bi-pencil-fill"></i>
                          </Link>
                          <Link
                            to={`/salary`}
                            className="btn btn-sm btn-info text-white"
                            style={{ fontSize: '0.75rem' }}
                          >
                            Salary
                          </Link>
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
              Showing {filteredList.length} of {employees.length} employee{employees.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
