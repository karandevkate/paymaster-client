import React, { useEffect, useState } from 'react';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

import {
  createSalaryStructure,
  updateSalaryStructure,
  getEmployeesByCompany,
  getSalaryStructure,
  PayrollConfiguration,
  getPayrollConfiguration,
} from '@/src/services/apiService';

import toast from 'react-hot-toast';

export const SalaryList: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [salaryExists, setSalaryExists] = useState(false);

  const [payrollConfig, setPayrollConfig] = useState<PayrollConfiguration | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    document.title = "Salary Structure - PayMaster";

    const loadData = async () => {
      try {
        const companyId = localStorage.getItem('companyId');
        if (!companyId) throw new Error("Company ID missing");

        const empData = await getEmployeesByCompany(companyId);
        setEmployees(empData);

        const config = await getPayrollConfiguration(companyId);
        if (config === null) {
          toast.error("Payroll configuration not set. Please set it up first.");
        }
        setPayrollConfig(config);

      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    fetchSalaryStructure();
  }, [selectedEmpId]);

  const fetchSalaryStructure = async () => {
    if (!selectedEmpId) return;

    try {
      const companyId = localStorage.getItem("companyId");
      if (!companyId) throw new Error("Company ID missing");

      const data = await getSalaryStructure(selectedEmpId, companyId);

      setBasicSalary(data.basicSalary);
      setAllowance(data.specialAllowance);
      setSalaryExists(true);

      toast.success(`Loaded salary structure for ${data.employeeName}`);
    } catch (err) {
      setBasicSalary(0);
      setAllowance(0);
      setSalaryExists(false);
    }
  };



  const hra = payrollConfig ? (basicSalary * payrollConfig.hraPercentage) / 100 : 0;
  const da = payrollConfig ? (basicSalary * payrollConfig.daPercentage) / 100 : 0;
  const pf = payrollConfig ? (basicSalary * payrollConfig.pfPercentage) / 100 : 0;
  console.log(hra, da, pf);
  const gross = basicSalary + hra + da + allowance;


  const handleSave = async () => {
    try {
      const companyId = localStorage.getItem("companyId");

      const payload = {
        employeeId: selectedEmpId,
        companyId,
        basicSalary,
        grossSalary: gross,
        specialAllowance: allowance
      };

      await createSalaryStructure(payload);
      toast.success("Salary structure created");
      setSalaryExists(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    }
  };

  const handleUpdate = async () => {
    try {
      const companyId = localStorage.getItem("companyId");

      const payload = {
        employeeId: selectedEmpId,
        companyId,
        basicSalary,
        specialAllowance: allowance
      };

      await updateSalaryStructure(payload);
      toast.success("Salary structure updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!payrollConfig) return <p className="text-center mt-10">Payroll configuration missing!</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Manage Salary Structure</h2>

      <Select
        label="Employee"
        options={employees.map((e) => ({ label: e.name, value: e.employeeId }))}
        value={selectedEmpId}
        onChange={(e) => setSelectedEmpId(e.target.value)}
        className="mb-8"
      />

      {selectedEmpId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT SIDE FORM */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <Input
              label="Basic Salary"
              type="number"
              value={basicSalary}
              onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Special Allowance"
              type="number"
              value={allowance}
              onChange={(e) => setAllowance(parseFloat(e.target.value) || 0)}
            />

            {!salaryExists ? (
              <Button onClick={handleSave} className="w-full mt-4">Save Structure</Button>
            ) : (
              <Button onClick={handleUpdate} className="w-full mt-4">Update Structure</Button>
            )}
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
            <SummaryRow label="Basic Salary" value={basicSalary} />

            <SummaryRow label={`HRA (${payrollConfig.hraPercentage}%)`} value={hra} />
            <SummaryRow label={`DA (${payrollConfig.daPercentage}%)`} value={da} />

            <SummaryRow label="Special Allowance" value={allowance} />

            <div className="border-t border-blue-200 pt-2 font-bold flex justify-between text-blue-900">
              <span>Gross Salary:</span>
              <span>{gross.toFixed(2)}</span>
            </div>

            <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between text-red-600">
              <span>PF Deduction ({payrollConfig.pfPercentage}%):</span>
              <span>-{pf.toFixed(2)}</span>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};


const SummaryRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between">
    <span>{label}:</span>
    <span>{value.toFixed(2)}</span>
  </div>
);
