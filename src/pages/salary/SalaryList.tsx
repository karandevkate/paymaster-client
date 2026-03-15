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
  fetchPayrollConfigurationByCompanyId,
  SalaryStructureRequest,
} from '@/src/services/apiService';
import { Employee, CompanySettings, Gender } from '../../types';

export const SalaryList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [basicSalary, setBasicSalary] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(0);
  const [isPfApplicable, setIsPfApplicable] = useState(true);
  const [isEsicApplicable, setIsEsicApplicable] = useState(false);

  const [config, setConfig] = useState<CompanySettings | null>(null);
  const [salaryExists, setSalaryExists] = useState(false);
  const [selectedEmployeeGender, setSelectedEmployeeGender] = useState<Gender>(Gender.MALE);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userJson = localStorage.getItem('user');
  const companyId = userJson ? JSON.parse(userJson).companyId : '';

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

        const payrollConfig = await fetchPayrollConfigurationByCompanyId(companyId);
        setConfig(payrollConfig);

      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [companyId]);

  useEffect(() => {
    if (!selectedEmpId || !companyId || !config) return;

    const fetchSalary = async () => {
      try {
        const data = await getSalaryStructure(selectedEmpId, companyId);
        setBasicSalary(data.basicSalary || 0);
        setSpecialAllowance(data.specialAllowance || 0);
        setBonusAmount(data.bonusAmount || 0);
        setIsPfApplicable(data.isPfApplicable);
        setIsEsicApplicable(data.isEsicApplicable);
        setSalaryExists(true);
      } catch {
        setBasicSalary(0);
        setSpecialAllowance(0);
        setBonusAmount(0);
        setIsPfApplicable(config.isPfApplicable ?? true);
        setIsEsicApplicable(config.isEsicApplicable ?? false);
        setSalaryExists(false);
      }
    };

    const selectedEmp = employees.find(e => e.employeeId === selectedEmpId);
    if (selectedEmp) {
      setSelectedEmployeeGender(selectedEmp.gender || Gender.MALE);
    }

    fetchSalary();
  }, [selectedEmpId, companyId, employees, config]);

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (error) return <div className="alert alert-danger text-center">{error}</div>;
  if (!config) return <div className="alert alert-warning text-center">Payroll configuration missing.</div>;

  // --- PREVIEW CALCULATIONS (Matching Backend) ---

  const hra = config.hraApplicable ? (basicSalary * (config.hraPercentage || 0)) / 100 : 0;
  const conveyance = config.conveyanceApplicable ? (basicSalary * (config.conveyancePercentage || 0)) / 100 : 0;
  const medical = config.medicalApplicable ? config.medicalAllowanceAmount || 0 : 0;

  const gross = basicSalary + hra + conveyance + medical + specialAllowance + bonusAmount;

  // Professional Tax (Maharashtra)
  const calculatePT = (gross: number, gender: Gender, month: number) => {
    if (gross <= 0) return 0;
    const isFemale = gender === Gender.FEMALE;
    const isFeb = month === 2;
    let pt = 0;
    if (isFemale) {
      pt = gross > 25000 ? 200 : 0;
    } else {
      if (gross <= 7500) pt = 0;
      else if (gross <= 10000) pt = 175;
      else pt = 200;
    }
    if (isFeb && pt > 175) pt = 300;
    return pt;
  };

  const currentMonth = new Date().getMonth() + 1;
  const professionalTax = calculatePT(gross, selectedEmployeeGender, currentMonth);

  // PF
  const pfEmployee = isPfApplicable ? Math.round((basicSalary * (config.pfEmployeePercentage || 0)) / 100) : 0;
  const pfEmployer = isPfApplicable ? Math.round((basicSalary * (config.pfEmployerPercentage || 0)) / 100) : 0;

  // ESIC
  const esiEmployee = isEsicApplicable ? Math.round((gross * 0.75) / 100) : 0;
  const esiEmployer = isEsicApplicable ? Math.round((gross * 3.25) / 100) : 0;
  const totalEsicDeduction = esiEmployee + esiEmployer;

  // Income Tax (Simplified Slab Calculation for Preview)
  const calculateMonthlyIncomeTax = (gross: number) => {
    const annualGross = gross * 12;
    let annualTax = 0;
    if (annualGross <= config.taxSlab1Limit) {
      annualTax = (annualGross * config.taxSlab1Rate) / 100;
    } else {
      annualTax += (config.taxSlab1Limit * config.taxSlab1Rate) / 100;
      const remaining1 = annualGross - config.taxSlab1Limit;
      const slab2Width = config.taxSlab2Limit - config.taxSlab1Limit;
      if (remaining1 <= slab2Width) {
        annualTax += (remaining1 * config.taxSlab2Rate) / 100;
      } else {
        annualTax += (slab2Width * config.taxSlab2Rate) / 100;
        const remaining2 = remaining1 - slab2Width;
        annualTax += (remaining2 * config.taxSlab3Rate) / 100;
      }
    }
    return annualTax / 12;
  };

  const incomeTax = calculateMonthlyIncomeTax(gross);

  const totalDeductions = pfEmployee + totalEsicDeduction + professionalTax + incomeTax;
  const netSalary = gross - totalDeductions;

  const handleSave = async () => {
    if (!selectedEmpId) {
      toast.error("Please select an employee");
      return;
    }

    try {
      const payload: SalaryStructureRequest = {
        employeeId: selectedEmpId,
        companyId: companyId,
        basicSalary,
        specialAllowance,
        bonusAmount: bonusAmount || 0,
        isPfApplicable,
        isEsicApplicable
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
      toast.error(err.response?.data?.message || err.message || "Save failed");
    }
  };

  return (
    <div className="container py-4 mb-5">
      <div className="card shadow p-4 border-0">
        <h2 className="fw-bold mb-4">Employee Salary Structure</h2>

        <Select
          label="Select Employee"
          className="mb-4"
          options={employees.map(e => ({
            label: `${e.name} (${e.designation}) - ${e.empcode}`,
            value: e.employeeId
          }))}
          value={selectedEmpId}
          onChange={(e) => setSelectedEmpId(e.target.value)}
        />

        {selectedEmpId && (
          <div className="row g-4">
            {/* LEFT FORM */}
            <div className="col-lg-6">
              <div className="border rounded p-4 bg-light h-100">
                <h5 className="mb-4 text-primary fw-bold">Enter Salary Details</h5>

                <div className="mb-3">
                  <Input label="Basic Salary (₹)" type="number" value={basicSalary} onChange={(e) => setBasicSalary(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="mb-3">
                  <Input label="Special Allowance (₹)" type="number" value={specialAllowance} onChange={(e) => setSpecialAllowance(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="mb-3">
                  <Input label="Bonus Amount (₹)" type="number" value={bonusAmount} onChange={(e) => setBonusAmount(parseFloat(e.target.value) || 0)} />
                </div>

                <div className="mt-4 border-top pt-3">
                  <div className="form-check form-switch mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="pfApplicable"
                      checked={isPfApplicable}
                      onChange={(e) => setIsPfApplicable(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="pfApplicable">
                      PF Applicable
                    </label>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="esicApplicable"
                      checked={isEsicApplicable}
                      onChange={(e) => setIsEsicApplicable(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="esicApplicable">
                      ESIC Applicable
                    </label>
                  </div>
                </div>

                <div className="mt-5">
                  <Button className="w-100 py-2 fs-5" onClick={handleSave}>
                    {salaryExists ? 'Update Salary Structure' : 'Create Salary Structure'}
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT PREVIEW */}
            <div className="col-lg-6">
              <div className="border rounded p-4 bg-white shadow-sm h-100">
                <h5 className="mb-4 text-success fw-bold">Salary Preview (Monthly)</h5>

                <div className="preview-section mb-4">
                  <h6 className="text-muted border-bottom pb-1 mb-3">Earnings</h6>
                  <SummaryRow label="Basic Salary" value={basicSalary} />
                  {config.hraApplicable && <SummaryRow label={`HRA (${config.hraPercentage}%)`} value={hra} />}
                  {config.conveyanceApplicable && <SummaryRow label={`Conveyance (${config.conveyancePercentage}%)`} value={conveyance} />}
                  {config.medicalApplicable && <SummaryRow label="Medical Allowance" value={medical} />}
                  <SummaryRow label="Special Allowance" value={specialAllowance} />
                  <SummaryRow label="Bonus" value={bonusAmount} />
                  <SummaryRow label="Gross Salary" value={gross} bold text="text-dark" />
                </div>

                <div className="preview-section mb-4">
                  <h6 className="text-muted border-bottom pb-1 mb-3">Deductions</h6>
                  {isPfApplicable && pfEmployee > 0 && <SummaryRow label="PF (Employee)" value={-pfEmployee} />}
                  {isEsicApplicable && (
                    <>
                      <SummaryRow label="ESIC (Employee + Employer 4%)" value={-totalEsicDeduction} />
                    </>
                  )}
                  <SummaryRow label="Professional Tax" value={-professionalTax} />
                  <SummaryRow label="Income Tax (Estimated)" value={-incomeTax} />
                  <SummaryRow label="Total Deductions" value={-totalDeductions} bold text="text-danger" />
                </div>

                <div className="pt-3 border-top mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold fs-4">Net Take-Home</span>
                    <span className="fw-bold fs-3 text-success">
                      ₹{Math.round(netSalary).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-end text-muted small mt-1">
                    Annual CTC: ₹{Math.round((gross + pfEmployer + esiEmployer) * 12).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, bold, text }: any) => (
  <div className="d-flex justify-content-between mb-2">
    <span className={bold ? 'fw-bold' : ''}>{label}</span>
    <span className={`${bold ? 'fw-bold' : ''} ${text || ''}`}>
      {value < 0 ? '-' : ''}₹{Math.abs(Math.round(value)).toLocaleString('en-IN')}
    </span>
  </div>
);
