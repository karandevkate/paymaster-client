export interface User {
  userId: string;
  username: string;
  email: string;
  companyId: string;
  userRole: 'ADMIN' | 'EMPLOYEE';
  token: string;
}

export interface Company {
  companyId: string;
  name: string;
  email: string;
  contactNumber: string;
  registrationNumber: string;
  address: string;
}

export interface CompanySettings {
  payrollConfigurationId?: string;
  companyId: string;
  
  // Allowance Applicability
  hraApplicable: boolean;
  conveyanceApplicable: boolean;
  medicalApplicable: boolean;
  bonusApplicable: boolean;

  // Allowance Values
  hraPercentage: number;
  conveyancePercentage: number;
  medicalAllowanceAmount: number;
  bonusPercentage: number;

  // PF / ESI
  isPfApplicable: boolean;
  isEsicApplicable: boolean;
  pfEmployeePercentage: number;
  pfEmployerPercentage: number;
  esiEmployeePercentage: number;
  esiEmployerPercentage: number;
  professionalTax: number;

  // Tax Slabs
  taxSlab1Limit: number;
  taxSlab1Rate: number;
  taxSlab2Limit: number;
  taxSlab2Rate: number;
  taxSlab3Limit: number;
  taxSlab3Rate: number;
  
  isActive: boolean;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RESIGNED = 'RESIGNED',
  TERMINATED = 'TERMINATED',
  ON_LEAVE = 'ON_LEAVE'
}

export interface Employee {
  employeeId: string;
  companyId: string;
  empcode: string;
  name: string;
  email: string;
  contactNumber: string;
  department: string;
  designation: string;
  gender: Gender;
  birthdate: string;
  joiningDate: string;
  employeeStatus: EmployeeStatus;
  pan: string;
  bankName: string;
  accountNumber: string;
  esicNumber: string;
  uanNumber: string;
  location: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface SalaryStructure {
  salaryStructureId: string;
  employeeId: string;
  employeeName: string;
  companyId: string;

  // EARNINGS
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllowance: number;
  specialAllowance: number;
  bonusAmount: number;

  isPfApplicable: boolean;
  isEsicApplicable: boolean;

  // Critical Payslip Fields
  grossEarnings: number;
  grossMonthlyCtcBase: number;

  // STATUTORY CONTRIBUTIONS
  pfEmployee: number;
  pfEmployer: number;
  employeeEsicContribution: number;
  employerEsicContribution: number;
  totalEsicDeduction: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;

  // FINAL
  netSalary: number;
  ctc: number;
}

export enum LeaveType {
  CASUAL_LEAVE = 'CASUAL_LEAVE',
  SICK_LEAVE = 'SICK_LEAVE',
  EARNED_LEAVE = 'EARNED_LEAVE',
  LOP = 'LOP'
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  employeeName?: string;
  leaveType: LeaveType;
  leaveDate: string;
  status: LeaveStatus;
  reason?: string;
}

export interface PayrollRecord {
  payRollId: string;
  companyId: string;
  companyName: string;
  employeeID: string;
  employeeName: string;
  empCode: string;
  designation: string;
  employeeEmail: string;
  employeeContactNumber: string;
  
  month: string;
  year: number;

  // EARNINGS
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllowance: number;
  specialAllowance: number;
  bonusAmount: number;
  grossSalary: number;

  // DEDUCTIONS
  pfEmployeeAmount: number;
  pfEmployerAmount: number;
  employeeEsicContribution: number;
  employerEsicContribution: number;
  totalEsicDeduction: number;
  professionalTaxAmount: number;
  incomeTaxAmount: number;
  totalDeductions: number;

  // FINAL
  netSalary: number;
  daysPaid: number;
  generatedAt: string;
}
