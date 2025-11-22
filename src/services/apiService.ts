import axios from 'axios';
import { UUID } from 'crypto';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Employee {
    employeeId: string;
    empcode: string;
    name: string;
    email: string;
    contactNumber: string;
    department: string;
    designation: string;
    employeeStatus: string;
    joiningDate: string;
    companyId: string;
}

export interface EmployeeCreate {
    name: string;
    email: string;
    contactNumber: string;
    department: string;
    birthdate?: string;
    designation: string;
    joiningDate: string;
    password: string;
    companyId: string;
}




export const createEmployee = async (employee: EmployeeCreate) => {
    const response = await api.post('/employees', employee);
    return response.data;
};


export const getEmployeesByCompany = async (companyId: string): Promise<Employee[]> => {
    const response = await api.get<Employee[]>(`/employees/company/${companyId}`);
    return response.data;
};



export interface CompanyRegisterData {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    adminName: string;
    adminEmail: string;
}

export const registerCompany = async (data: CompanyRegisterData) => {
    const response = await api.post('/companies/register', data);
    return response.data;
};



export const setPassword = async (token: string, password: string) => {
    const response = await api.post(
        `/employees/set-password`,
        null, // no request body
        {
            params: {
                token: token,
                newPassword: password   // ← must match @RequestParam name exactly!
            }
        }
    );
    return response.data;
};



export interface PayrollConfigurationRequestDto {
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

export interface PayrollConfigurationResponseDto extends PayrollConfigurationRequestDto {
    payrollConfigurationId: string;
}


export const fetchPayrollConfigurationByCompanyId = async (companyId: string): Promise<PayrollConfigurationResponseDto> => {
    const response = await api.get<PayrollConfigurationResponseDto>(`/payroll-configurations/${companyId}`);
    return response.data;
};

export const addPayrollConfiguration = async (
    payload: PayrollConfigurationRequestDto
): Promise<string> => {
    const response = await api.post<string>('/payroll-configurations', payload);
    return response.data; // This will be the string message
};

export const updatePayrollConfig = async (
    payload: PayrollConfigurationRequestDto
): Promise<PayrollConfigurationResponseDto> => {
    const response = await api.put<PayrollConfigurationResponseDto>('/payroll-configurations', payload);
    return response.data;
};



export interface SalaryStructureRequestDto {
    employeeId: string;
    companyId: string;
    basicSalary: number;
    specialAllowance: number;
}

export interface SalaryStructureResponseDto {
    salaryStructureId: string;
    employeeId: string;
    employeeName: string;
    companyId: string;
    basicSalary: number;
    specialAllowance: number;
}

// Create salary structure
export const createSalaryStructure = async (
    payload: SalaryStructureRequestDto
): Promise<string> => {
    const response = await api.post<string>('/salary-structures', payload);
    return response.data;
};

// Update salary structure
export const updateSalaryStructure = async (
    payload: SalaryStructureRequestDto
): Promise<string> => {
    const response = await api.put<string>('/salary-structures', payload);
    return response.data;
};

export const getSalaryStructure = async (
    employeeId: string,
    companyId: string
): Promise<SalaryStructureResponseDto> => {
    const response = await api.get<SalaryStructureResponseDto>(
        `/salary-structures/${employeeId}/${companyId}`
    );
    return response.data;
};

// Get all salary structures for a company (optional)
export const getSalaryStructuresByCompany = async (
    companyId: string
): Promise<SalaryStructureResponseDto[]> => {
    const response = await api.get<SalaryStructureResponseDto[]>(
        `/salary-structures/company/${companyId}`
    );
    return response.data;
};



export interface PayrollConfiguration {
    payrollConfigurationId: string;
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

export const getPayrollConfiguration = async (companyId: string) => {
    const response = await api.get<PayrollConfiguration>(`/payroll-configurations/${companyId}`);
    console.log("Fetched Payroll Configuration:", response.data);
    return response.data;
};

export interface EmployeePayrollResponseDto {
    payRollId: string;
    employeeID: string;
    employeeName: string;
    employeeEmail: string;
    designation: string;
    empCode: string;
    employeeContactNumber: string;
    companyId: string;
    companyName: string;
    month: string;
    year: number;
    baseSalary: number;
    grossSalary: number;
    hra: number;
    da: number;
    specialAllowance: number;
    pfAmount: number;
    professionalTaxAmount: number;
    incomeTaxAmount: number;
    netSalary: number;
    generatedAt: string;

}

export const getPayrollsByCompany = async (companyId: string): Promise<EmployeePayrollResponseDto[]> => {
    const response = await api.get<EmployeePayrollResponseDto[]>(`/payrolls/company/${companyId}`);
    return response.data;
};

export const getPayrollsByCompanyAndEmployee = async (companyId: string, employeeId: string): Promise<EmployeePayrollResponseDto[]> => {
    const response = await api.get<EmployeePayrollResponseDto[]>(`/payrolls/company/${companyId}/employee/${employeeId}`);
    return response.data;
};



