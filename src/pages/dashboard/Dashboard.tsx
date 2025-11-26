import React, { useEffect, useState } from 'react';
import { getCompanyDetails, getEmployeesByCompany } from '@/src/services/apiService';

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className={`bg-white p-4 rounded shadow-sm border-start border-4 ${color}`}>
    <h6 className="text-muted text-uppercase fw-semibold mb-1">{title}</h6>
    <h2 className="fw-bold">{value}</h2>
  </div>
);

export const Dashboard: React.FC = () => {
  const [company, setCompany] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves] = useState<any[]>([]);
  const [payrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Dashboard - PayMaster';
    const userRole = localStorage.getItem('userRole');
    setRole(userRole);

    const fetchData = async () => {
      try {
        setLoading(true);
        const companyId = localStorage.getItem('companyId');
        if (!companyId) throw new Error('Company ID not found');

        const [companyRes, employeesRes] = await Promise.all([
          getCompanyDetails(companyId),
          getEmployeesByCompany(companyId)
        ]);

        setCompany(companyRes);
        setEmployees(employeesRes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const totalPayroll = payrolls.reduce((acc, curr) => acc + (curr?.netSalary || 0), 0);

  return (
    <div className="container-fluid py-3">

      {/* Title + Clock */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Dashboard</h2>

        <div className="bg-white border rounded px-4 py-2 shadow-sm text-center">
          <h3 className="fw-bold fs-3 mb-0">
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </h3>
          <small className="text-muted">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </small>
        </div>
      </div>

      {/* Company Details */}
      {company && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-semibold">{company.name}</h5>
            <p className="mb-1"><strong>Email:</strong> {company.email}</p>
            <p className="mb-1"><strong>Contact:</strong> {company.contactNumber}</p>
            <p className="mb-1"><strong>Address:</strong> {company.address}</p>
            <p className="mb-0"><strong>Registration Number:</strong> {company.registrationNumber}</p>
          </div>
        </div>
      )}

      {/* Admin/Manager View Only */}
      {role !== 'EMPLOYEE' && (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <StatCard title="Total Employees" value={employees.length} color="border-primary" />
            </div>
            <div className="col-md-4">
              <StatCard title="Total Payroll Generated" value={`₹${totalPayroll.toLocaleString()}`} color="border-success" />
            </div>
            {/* <div className="col-md-4">
              <StatCard title="Pending Leaves" value={pendingLeaves} color="border-warning" />
            </div> */}
          </div>

          {/* Quick Actions */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Quick Actions</h5>

              <div className="d-flex gap-3">
                <a href="/employees/add" className="btn btn-outline-primary">Add Employee</a>
                <a href="/payroll" className="btn btn-outline-primary">Generate Payroll</a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
