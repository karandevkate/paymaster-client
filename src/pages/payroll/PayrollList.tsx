import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import {
  downloadPayrollPdf,
  EmployeePayrollResponseDto,
  getPayrollsByCompany,
  getPayrollsByCompanyAndEmployee
} from '@/src/services/apiService';

export const PayrollList: React.FC = () => {
  const [payrolls, setPayrolls] = useState<EmployeePayrollResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const role = localStorage.getItem('userRole');
  const companyId = localStorage.getItem('companyId');
  const employeeId = localStorage.getItem('userId');

  useEffect(() => {
    document.title = "Payroll History - PayMaster";
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    if (!companyId) {
      toast.error("Company not found in session");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = (role === 'ADMIN' || role === 'HR')
        ? await getPayrollsByCompany(companyId)
        : employeeId
          ? await getPayrollsByCompanyAndEmployee(companyId, employeeId)
          : [];

      setPayrolls(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load payroll records");
    } finally {
      setLoading(false);
    }
  };

  const filteredList = payrolls.filter(p => {
    const query = search.toLowerCase();
    return (
      p.employeeName.toLowerCase().includes(query) ||
      p.empCode.toLowerCase().includes(query) ||
      p.employeeID.toLowerCase().includes(query)
    );
  });

  const downloadSlip = async (payroll: EmployeePayrollResponseDto) => {
    try {
      const blob = await downloadPayrollPdf(payroll.payRollId);

      if (!blob || blob.type !== "application/pdf") {
        toast.error("Received invalid file from server");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${payroll.employeeName.replace(/\s+/g, '_')}_Salary_Slip_${payroll.month}_${payroll.year}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Salary slip downloaded!");
    } catch (error) {
      toast.error("Failed to download salary slip");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm p-4">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <h2 className="fw-bold mb-0">Payroll History</h2>

          <div className="d-flex gap-3 flex-wrap">
            {(role === 'ADMIN' || role === 'HR') && (
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
                style={{ maxWidth: '250px' }}
              />
            )}
            <Button onClick={fetchPayrolls}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive rounded border">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-primary text-white">
              <tr>
                <th>Employee</th>
                <th className="text-center">Period</th>
                <th className="text-end">Gross</th>
                <th className="text-end">Deductions</th>
                <th className="text-end">Net Pay</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-border-sm me-2" role="status" />
                    Loading payrolls...
                  </td>
                </tr>
              ) : filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-5 text-muted">
                    {search ? "No matching records found" : "No payroll records available"}
                  </td>
                </tr>
              ) : (
                filteredList.map((p) => (
                  <tr key={p.payRollId}>
                    <td>
                      <div className="fw-semibold">{p.employeeName}</div>
                      <small className="text-muted">{p.empCode}</small>
                    </td>

                    <td className="text-center">
                      <span className="badge bg-info text-dark px-3 py-2">
                        {p.month} {p.year}
                      </span>
                    </td>

                    <td className="text-end text-monospace">
                      ₹{p.grossSalary.toLocaleString('en-IN')}
                    </td>

                    <td className="text-end text-danger">
                      -₹{p.totalDeductions.toLocaleString('en-IN')}
                    </td>

                    <td className="text-end fw-bold text-success fs-5">
                      ₹{p.netSalary.toLocaleString('en-IN')}
                    </td>

                    <td className="text-center">
                      <Button size="sm" onClick={() => downloadSlip(p)}>
                        Download Slip
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        {!loading && payrolls.length > 0 && (
          <div className="mt-3 text-end text-muted small">
            Showing {filteredList.length} of {payrolls.length} records
          </div>
        )}
      </div>
    </div>
  );
};