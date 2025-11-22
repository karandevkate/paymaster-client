import React, { useEffect, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { EmployeePayrollResponseDto, getPayrollsByCompany, getPayrollsByCompanyAndEmployee } from '@/src/services/apiService';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const PayrollList: React.FC = () => {
  const [payrolls, setPayrolls] = useState<EmployeePayrollResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Read role, companyId, employeeId from localStorage
  const role = localStorage.getItem('role'); // 'ADMIN', 'HR', 'USER', 'MANAGER'
  const companyId = localStorage.getItem('companyId');
  const employeeId = localStorage.getItem('userId');

  useEffect(() => {
    document.title = "Payroll History - PayMaster";
    fetchPayrolls();
  }, []);

  const fetchPayrolls = async () => {
    setLoading(true);
    try {
      if (!companyId) throw new Error('Company ID not found');

      let data: EmployeePayrollResponseDto[] = [];

      if (role === 'ADMIN' || role === 'HR') {
        // Admin/HR can see all payrolls for the company
        data = await getPayrollsByCompany(companyId);
      } else {
        // User/Manager can see only their own payroll
        if (!employeeId) throw new Error('Employee ID not found');
        data = await getPayrollsByCompanyAndEmployee(companyId, employeeId);
      }

      setPayrolls(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load payrolls');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = payrolls.filter((p) =>
    p.employeeName.toLowerCase().includes(search.toLowerCase()) ||
    p.employeeID.toLowerCase().includes(search.toLowerCase())
  );

  const downloadSlip = (p: EmployeePayrollResponseDto) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const monthNum = getMonthNumber(p.month);
    const yearNum = Number(p.year);

    const basicSalary = p.baseSalary;
    const specialAllowance = Math.round((p.specialAllowance / 100) * p.baseSalary);
    const totalDeduction = p.pfAmount + p.professionalTaxAmount + p.incomeTaxAmount;

    // Header
    doc.setFillColor(0, 74, 173);
    doc.rect(0, 0, pageWidth, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(p.companyName || "Company Name", pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Generated Salary Slip', pageWidth / 2, 30, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.text('SALARY SLIP', pageWidth / 2, 55, { align: 'center' });

    // Employee Info
    doc.setFillColor(245, 245, 245);
    doc.rect(15, 65, pageWidth - 30, 30, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Employee Name: ${p.employeeName}`, 20, 75);
    doc.text(`Employee Code: ${p.empCode}`, 20, 85);
    doc.text(`Month & Year: ${getMonthName(monthNum)} ${yearNum}`, 110, 75);
    doc.text(`Designation: ${p.designation || 'N/A'}`, 110, 85);

    autoTable(doc, {
      startY: 105,
      head: [
        [
          { content: 'EARNINGS', styles: { fillColor: [0, 74, 173], textColor: 255, fontStyle: 'bold' } },
          { content: 'AMOUNT (Rs.)', styles: { fillColor: [0, 74, 173], textColor: 255, fontStyle: 'bold' } },
          { content: 'DEDUCTIONS', styles: { fillColor: [192, 57, 43], textColor: 255, fontStyle: 'bold' } },
          { content: 'AMOUNT (Rs.)', styles: { fillColor: [192, 57, 43], textColor: 255, fontStyle: 'bold' } },
        ]
      ],
      body: [
        ['Basic Salary', basicSalary.toLocaleString('en-IN'), 'PF', p.pfAmount.toLocaleString('en-IN')],
        ['HRA', p.hra.toLocaleString('en-IN'), 'Professional Tax', p.professionalTaxAmount.toLocaleString('en-IN')],
        ['DA', p.da.toLocaleString('en-IN'), 'Income Tax', p.incomeTaxAmount.toLocaleString('en-IN')],
        ['Special Allowance', specialAllowance.toLocaleString('en-IN'), '', ''],
        ['', '', '', ''],
        [
          { content: 'Gross Earnings', styles: { fontStyle: 'bold', fillColor: [240, 248, 255] } },
          { content: p.grossSalary.toLocaleString('en-IN'), styles: { fontStyle: 'bold', halign: 'right', fillColor: [240, 248, 255] } },
          { content: 'Total Deductions', styles: { fontStyle: 'bold', fillColor: [255, 240, 240] } },
          { content: totalDeduction.toLocaleString('en-IN'), styles: { fontStyle: 'bold', halign: 'right', fillColor: [255, 240, 240] } },
        ],
      ],
      theme: 'grid',
      styles: { fontSize: 11, cellPadding: 7 },
      columnStyles: {
        0: { cellWidth: 55 },
        1: { cellWidth: 35, halign: 'right' },
        2: { cellWidth: 55 },
        3: { cellWidth: 35, halign: 'right' },
      },
      headStyles: { fillColor: false },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 25;
    doc.setFillColor(0, 128, 0);
    doc.rect(15, finalY, pageWidth - 30, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(`NET PAY : Rs. ${p.netSalary.toLocaleString('en-IN')}`, pageWidth / 2, finalY + 13, { align: 'center' });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.text(`Rupees ${numberToWords(Math.round(p.netSalary))} Only`, pageWidth / 2, finalY + 22, { align: 'center' });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated payslip. No signature required.', pageWidth / 2, finalY + 40, { align: 'center' });
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, finalY + 47, { align: 'center' });

    const safeName = p.employeeName.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${safeName}_Salary_Slip_${getMonthName(monthNum)}_${yearNum}.pdf`;
    doc.save(fileName);
    toast.success(`Downloaded: ${fileName}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Payroll History</h2>
          {role === 'ADMIN' || role === 'HR' ? (
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search employee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-5 py-3 border rounded-lg focus:ring-4 focus:ring-blue-100 outline-none"
              />
              <Button onClick={fetchPayrolls}>Refresh</Button>
            </div>
          ) : (
            <Button onClick={fetchPayrolls}>Refresh</Button>
          )}
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left">Employee</th>
                <th className="px-6 py-4 text-center">Period</th>
                <th className="px-6 py-4 text-right">Gross</th>
                <th className="px-6 py-4 text-right">Deductions</th>
                <th className="px-6 py-4 text-right">Net Pay</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-500">Loading...</td></tr>
              ) : filteredList.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-gray-500">No records found</td></tr>
              ) : (
                filteredList.map((p) => {
                  const totalDeduction = p.pfAmount + p.professionalTaxAmount + p.incomeTaxAmount;
                  return (
                    <tr key={p.payRollId} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <div className="font-semibold">{p.employeeName}</div>
                        <div className="text-sm text-gray-500">{p.empCode}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {p.month}/{p.year}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-medium">₹{p.grossSalary.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-5 text-right text-red-600">-₹{totalDeduction.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-5 text-right text-2xl font-bold text-green-600">₹{p.netSalary.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-5 text-center">
                        <Button onClick={() => downloadSlip(p)}>Download Slip</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// === HELPERS ===
const getMonthName = (m: number) =>
  ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][m] || "Month";

const getMonthNumber = (month: string) => {
  const months: Record<string, number> = {
    JANUARY: 1, FEBRUARY: 2, MARCH: 3, APRIL: 4, MAY: 5, JUNE: 6,
    JULY: 7, AUGUST: 8, SEPTEMBER: 9, OCTOBER: 10, NOVEMBER: 11, DECEMBER: 12
  };
  return months[month.toUpperCase()] || 0;
};

const numberToWords = (num: number): string => {
  if (num === 0) return "Zero";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (num < 20) return ones[num];
  if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + numberToWords(num % 100) : "");
  if (num < 100000) return numberToWords(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + numberToWords(num % 1000) : "");
  if (num < 10000000) return numberToWords(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + numberToWords(num % 100000) : "");
  return numberToWords(Math.floor(num / 10000000)) + " Crore" + (num % 10000000 ? " " + numberToWords(num % 10000000) : "");
};
