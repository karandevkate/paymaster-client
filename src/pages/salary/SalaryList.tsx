import React, { useEffect, useState } from 'react';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';
import {
  createSalaryStructure,
  updateSalaryStructure,
  getEmployeesByCompany,
  getSalaryStructure,
  getPayrollConfiguration,
  PayrollConfigurationResponseDto,
  Employee
} from '@/src/services/apiService';



export const SalaryList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [basicSalary, setBasicSalary] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);

  const [config, setConfig] = useState<PayrollConfigurationResponseDto | null>(null);
  const [salaryExists, setSalaryExists] = useState(false);
  const [selectedEmployeeGender, setSelectedEmployeeGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    document.title = "Salary Structure - PayMaster";

    const loadInitialData = async () => {
      if (!companyId) {
        setError("Company not found.");
        setLoading(false);
        return;
      }

      try {
        const empData = await getEmployeesByCompany(companyId);
        setEmployees(empData);

        const payrollConfig = await getPayrollConfiguration(companyId);
        setConfig({ ...payrollConfig, isActive: true });

      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedEmpId || !companyId) return;

    const fetchSalary = async () => {
      try {
        const data = await getSalaryStructure(selectedEmpId, companyId);
        setBasicSalary(data.basicSalary || 0);
        setSpecialAllowance(data.specialAllowance || 0);
        setBonusAmount(data.bonusAmount || 0);
        setSalaryExists(true);
      } catch {
        setBasicSalary(0);
        setSpecialAllowance(0);
        setBonusAmount(0);
        setSalaryExists(false);
      }
    };

    const selectedEmp = employees.find(e => e.employeeId === selectedEmpId);
    if (selectedEmp) {
      setSelectedEmployeeGender(selectedEmp.gender || 'MALE');
    }

    fetchSalary();
  }, [selectedEmpId, companyId, employees]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;
  if (!config) return <div className="alert alert-warning text-center">Payroll configuration missing.</div>;

  const hra = config.hraApplicable ? (basicSalary * (config.hraPercentage || 0)) / 100 : 0;
  const conveyance = config.conveyanceApplicable ? config.conveyanceAmount || 0 : 0;
  const medical = config.medicalApplicable ? config.medicalAllowanceAmount || 0 : 0;

  const gross = basicSalary + hra + conveyance + medical + specialAllowance + bonusAmount;


  const calculatePT = (gross: number, gender: string, month: number = 2) => {
    if (gross <= 0) return 0;

    const isFemale = gender === 'FEMALE';
    const isFeb = month === 2;
    let pt = 0;

    if (isFemale) {
      pt = gross > 25000 ? 200 : 0;
    }
    else {
      if (gross <= 7500) pt = 0;
      else if (gross <= 10000) pt = 175;
      else pt = 200;
    }
    if (isFeb && pt > 175) pt = 300;
    return pt;
  };

  const currentMonth = new Date().getMonth() + 1;
  const professionalTax = calculatePT(gross, selectedEmployeeGender, currentMonth === 2 ? 2 : 1);

  const pfEmployee = config.pfApplicable ? (basicSalary * (config.pfEmployeePercentage || 0)) / 100 : 0;
  const esiEmployee = config.esiApplicable && gross <= 21000
    ? (gross * (config.esiEmployeePercentage)) / 100
    : 0;

  const totalDeductions = pfEmployee + esiEmployee + professionalTax;
  const netSalary = gross - totalDeductions;

  const handleSave = async () => {
    if (!selectedEmpId) {
      toast.error("Please select an employee");
      return;
    }

    try {
      const payload = {
        employeeId: selectedEmpId,
        companyId: companyId!,
        basicSalary,
        specialAllowance,
        bonusAmount: bonusAmount || 0
      };

      if (salaryExists) {
        await updateSalaryStructure(payload);
        toast.success("Salary structure updated!");
      } else {
        await createSalaryStructure(payload);
        toast.success("Salary structure created!");
      }
      setSalaryExists(true);
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    }
  };

  return (
    <div className="container py-4">
      <div className="card shadow p-4">
        <h2 className="fw-bold mb-4">Employee Salary Structure</h2>

        <Select
          label="Select Employee"
          className="mb-4"
          options={employees.map(e => ({
            label: `${e.name} (${e.designation}) - ${e.gender}`,
            value: e.employeeId
          }))}
          value={selectedEmpId}
          onChange={(e) => setSelectedEmpId(e.target.value)}
        />

        {selectedEmpId && (
          <div className="row g-4">
            {/* LEFT FORM */}
            <div className="col-lg-6">
              <div className="border rounded p-4 bg-light">
                <h5 className="mb-3">Enter Salary Details</h5>

                <Input label="Basic Salary (₹)" type="text" value={basicSalary} onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)} />
                <Input label="Special Allowance (₹)" type="text" value={specialAllowance} onChange={(e) => setSpecialAllowance(parseFloat(e.target.value) || 0)} />
                <Input label="Bonus Amount (₹)" type="text" value={bonusAmount} onChange={(e) => setBonusAmount(parseFloat(e.target.value) || 0)} />

                <div className="mt-4">
                  <Button className="w-100" onClick={handleSave}>
                    {salaryExists ? 'Update Salary Structure' : 'Create Salary Structure'}
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT PREVIEW */}
            <div className="col-lg-6">
              <div className="border rounded p-4 bg-primary bg-opacity-10">
                <h5 className="mb-3 text-primary">Salary Preview (Current Month)</h5>

                <SummaryRow label="Basic Salary" value={basicSalary} />
                {config.hraApplicable && <SummaryRow label={`HRA (${config.hraPercentage}%)`} value={hra} />}
                {config.conveyanceApplicable && <SummaryRow label="Conveyance" value={conveyance} />}
                {config.medicalApplicable && <SummaryRow label="Medical Allowance" value={medical} />}
                <SummaryRow label="Special Allowance" value={specialAllowance} />
                <SummaryRow label="Bonus" value={bonusAmount} />

                <hr />
                <SummaryRow label="Gross Salary" value={gross} bold />

                <hr />
                {pfEmployee > 0 && <SummaryRow label="PF (Employee)" value={-pfEmployee} />}
                {esiEmployee > 0 && <SummaryRow label="ESI (Employee)" value={-esiEmployee} />}
                <SummaryRow label="Professional Tax" value={-professionalTax} />

                <hr />
                <SummaryRow label="Net Take-Home" value={netSalary} bold large text="text-success" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, bold, large, text }: any) => (
  <div className="d-flex justify-content-between mb-2">
    <span className={bold ? 'fw-bold' : ''}>{label}</span>
    <span className={`${bold ? 'fw-bold' : ''} ${large ? 'fs-4' : ''} ${text || ''}`}>
      ₹{Math.round(value).toLocaleString('en-IN')}
    </span>
  </div>
);