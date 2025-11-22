export interface User {
  id: string;
  email: string;
  name: string;
  companyId: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface Company {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
  address: string;
}

export interface CompanySettings {
  id?: string;
  companyId: string;
  hraPercentage: number;
  daPercentage: number;
  pfPercentage: number;
  taxSlab1Limit: number;
  taxSlab1Percentage: number;
  taxSlab2Limit: number;
  taxSlab2Percentage: number;
  taxSlab3Percentage: number;
}

export enum EmployeeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_LEAVE = 'On Leave'
}

export interface Employee {
  id: string;
  companyId: string;
  empCode: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: EmployeeStatus;
}

export interface SalaryStructure {
  id: string;
  employeeId: string;
  basicSalary: number;
  specialAllowance: number;
  // Calculated fields often returned by backend, but we might calculate on frontend for form
  grossSalary?: number; 
}

export enum LeaveType {
  CL = 'Casual Leave',
  SL = 'Sick Leave',
  EL = 'Earned Leave',
  LOP = 'Loss of Pay'
}

export enum LeaveStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName?: string; // Joined data
  leaveType: LeaveType;
  leaveDate: string;
  status: LeaveStatus;
  reason?: string;
}

export interface PayrollRecord {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  monthYear: string; // YYYY-MM
  basic: number;
  hra: number;
  da: number;
  specialAllowance: number;
  grossSalary: number;
  pfDeduction: number;
  professionalTax: number;
  incomeTax: number;
  lopDeduction: number;
  netSalary: number;
  generatedAt: string;
}
