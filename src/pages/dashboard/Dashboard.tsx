import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCompanyDetails, getEmployeesByCompany } from '@/src/services/apiService';

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color}`}>
    <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
  </div>
);

export const Dashboard: React.FC = () => {
  const [company, setCompany] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [role, setRole] = useState<string | null>(null); // role from localStorage or API

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().toLocaleString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title = "Dashboard - PayMaster";

    const fetchData = async () => {
      try {
        setLoading(true);
        const companyId = localStorage.getItem('companyId');
        const userRole = localStorage.getItem('userRole');
        setRole(userRole);

        if (!companyId) throw new Error('Company ID not found');

        const [companyRes, employeesRes] = await Promise.all([
          getCompanyDetails(companyId),
          getEmployeesByCompany(companyId),
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
  if (error) return <p className="text-red-500">{error}</p>;

  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;
  const totalPayroll = payrolls.reduce((acc, curr) => acc + (curr.netSalary || 0), 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

        {/* Digital Watch-Style Clock Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-6 py-4">
          <div className="text-center">
            <div className="font-mono text-3xl font-semibold text-gray-800 tracking-tight">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Company Details */}
      {company && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
          <p>Email: {company.email}</p>
          <p>Contact: {company.contactNumber}</p>
          <p>Address: {company.address}</p>
          <p>Registration Number: {company.registrationNumber}</p>
        </div>
      )}

      {/* Only show these cards if role is not EMPLOYEE */}
      {role !== 'EMPLOYEE' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Employees" value={employees.length} color="border-blue-500" />
            <StatCard title="Total Payroll Generated" value={`$${totalPayroll.toLocaleString()}`} color="border-green-500" />
            {/* <StatCard title="Pending Leave Requests" value={pendingLeaves} color="border-yellow-500" /> */}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <a href="/employees/add" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100">Add Employee</a>
              <a href="/payroll" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100">Generate Payroll</a>
              {/* <a href="/leaves" className="px-4 py-2 bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100">Review Leaves</a> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
};