import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { LeaveType } from '../../types';
import { Employee, getEmployeesByCompany } from '@/src/services/apiService';

export const LeaveList: React.FC = () => {

  const [leaves, setLeaves] = useState<any[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [newLeave, setNewLeave] = useState({
    employeeId: '',
    leaveType: LeaveType.CL,
    leaveDate: '',
  });

  // Get role
  const userRole = localStorage.getItem("userRole");
  const isApprover =
    userRole === "Admin" ||
    userRole === "HR" ||
    userRole === "Manager";

  useEffect(() => {
    document.title = "Leave Management - PayMaster";

    const fetchData = async () => {
      try {
        const companyId = localStorage.getItem("companyId");
        if (!companyId) throw new Error("Company ID not found");

        // Get employees
        const emp = await getEmployeesByCompany(companyId);
        setEmployees(emp);

        // For now: fake leave data (because API unavailable)
        const dummyLeaves = [
          {
            id: "1",
            employeeName: "John Doe",
            leaveDate: "2025-01-20",
            leaveType: "CL",
            status: "Pending",
          },
        ];
        setLeaves(dummyLeaves);

      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Submit leave — for now only frontend
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry = {
      id: String(Date.now()),
      employeeName:
        employees.find((e) => e.employeeId === newLeave.employeeId)?.name || "Unknown",
      leaveDate: newLeave.leaveDate,
      leaveType: newLeave.leaveType,
      status: "Pending",
    };

    setLeaves((prev) => [...prev, newEntry]);
    setShowForm(false);
    alert("Leave request added (temp, no API yet)");
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Leave Requests</h2>

        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel Request" : "+ New Leave Request"}
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* NEW LEAVE REQUEST FORM */}
      {showForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border">
          <form onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">

            <Select
              label="Employee"
              options={employees.map(e => ({ label: e.name, value: e.employeeId }))}
              value={newLeave.employeeId}
              onChange={(e) =>
                setNewLeave({ ...newLeave, employeeId: e.target.value })
              }
              required
            />

            <Select
              label="Type"
              options={Object.values(LeaveType).map(t => ({ label: t, value: t }))}
              value={newLeave.leaveType}
              onChange={(e) =>
                setNewLeave({ ...newLeave, leaveType: e.target.value as LeaveType })
              }
            />

            <Input
              label="Date"
              type="date"
              value={newLeave.leaveDate}
              onChange={(e) =>
                setNewLeave({ ...newLeave, leaveDate: e.target.value })
              }
              required
            />

            <div className="mb-4">
              <Button type="submit" className="w-full">Submit Request</Button>
            </div>
          </form>
        </div>
      )}

      {/* LEAVE TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Employee</th>
              <th className="p-3">Date</th>
              <th className="p-3">Type</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : leaves.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No leaves found.</td></tr>
            ) : (
              leaves.map((leave) => (
                <tr key={leave.id} className="border-b">
                  <td className="p-3">{leave.employeeName}</td>
                  <td className="p-3">{leave.leaveDate}</td>
                  <td className="p-3">{leave.leaveType}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${leave.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : leave.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {leave.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {/* Approve buttons visible only for Admin / HR / Manager */}
                    {leave.status === "Pending" && isApprover && (
                      <div className="flex gap-2">
                        <button className="text-green-600 text-sm font-bold" disabled>
                          Approve
                        </button>
                        <button className="text-red-600 text-sm font-bold" disabled>
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
