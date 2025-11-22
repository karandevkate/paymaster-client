import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const PayrollGenerate: React.FC = () => {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [currentSalary, setCurrentSalary] = useState<any>(null);

  const [selectedEmpId, setSelectedEmpId] = useState('');
  const [monthYear, setMonthYear] = useState(new Date().toISOString().slice(0, 7));
  // const [lopDays, setLopDays] = useState(0);
  // const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    document.title = "Generate Payroll - PayMaster";

  }, []);



  const calculatePayroll = () => {
    if (!currentSalary || !settings) return null;

    const { basicSalary, specialAllowance } = currentSalary;
    const hra = (basicSalary * settings.hraPercentage) / 100;
    const da = (basicSalary * settings.daPercentage) / 100;
    const pf = (basicSalary * settings.pfPercentage) / 100;
    const gross = basicSalary + hra + da + specialAllowance;

    // const lopDeduction = (gross / 30) * lopDays;

    let tax = 0;
    if (gross * 12 > settings.taxSlab2Limit) {
      tax = (gross * settings.taxSlab2Percentage) / 100;
    } else if (gross * 12 > settings.taxSlab1Limit) {
      tax = (gross * settings.taxSlab1Percentage) / 100;
    }

    const professionalTax = 200; // hardcoded or from settings
    const totalDeductions = pf + professionalTax + tax; // + lopDeduction;
    const net = gross - totalDeductions;

    return {
      basic: basicSalary,
      hra,
      da,
      specialAllowance,
      grossSalary: gross,
      pfDeduction: pf,
      professionalTax,
      incomeTax: tax,
      // lopDeduction,
      netSalary: net
    };
  };

  const calculated = calculatePayroll();
  const employee = employees.find(e => e.id === selectedEmpId);

  const handleGenerate = async () => {
    if (!calculated || !employee) return;
    try {
      await axios.post('/payroll/generate', {
        employeeId: selectedEmpId,
        employeeName: employee.name,
        monthYear,
        ...calculated
      });
      navigate('/payroll');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate payroll');
    }
  };

  // if (loading) return <p className="text-center mt-10">Loading...</p>;
  // if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Payroll</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Select
          label="Select Employee"
          options={employees.map(e => ({ label: e.name, value: e.id }))}
          value={selectedEmpId}
          onChange={(e) => setSelectedEmpId(e.target.value)}
        />
        <Input
          label="Month"
          type="month"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
        />
        {/* <Input
          label="Loss of Pay (Days)"
          type="number"
          value={lopDays}
          onChange={(e) => setLopDays(parseInt(e.target.value) || 0)}
        /> */}
      </div>

      {calculated && (
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-6">
          <h3 className="font-bold text-blue-800 mb-4">Payroll Preview</h3>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
            <span>Gross Salary:</span> <span className="font-bold">{calculated.grossSalary.toFixed(2)}</span>
            <span>PF Deduction:</span> <span className="text-red-600">-{calculated.pfDeduction.toFixed(2)}</span>
            {/* <span>LOP Deduction:</span> <span className="text-red-600">-{calculated.lopDeduction.toFixed(2)}</span> */}
            <span>Income Tax:</span> <span className="text-red-600">-{calculated.incomeTax.toFixed(2)}</span>
            <span>Prof. Tax:</span> <span className="text-red-600">-{calculated.professionalTax.toFixed(2)}</span>
            <div className="col-span-2 border-t pt-2 mt-2 flex justify-between text-lg font-bold text-gray-900">
              <span>Net Salary:</span>
              <span>{calculated.netSalary.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button disabled={!calculated} onClick={handleGenerate}>Confirm & Generate</Button>
      </div>
    </div>
  );
};
