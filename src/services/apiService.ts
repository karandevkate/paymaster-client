import axios from 'axios';
import { UUID } from 'crypto';

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    // baseURL: import.meta.env.VITE_API_BASE_URL,
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
    gender: 'MALE' | 'FEMALE' | 'OTHER';
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
    gender: '' | 'MALE' | 'FEMALE' | 'OTHER';
    password: string;
    companyId: string;
}




export const createEmployee = async (employee: EmployeeCreate) => {
    const response = await api.post('/employees', employee);
    return response.data;
};




export interface LoginResponse {
    token: string;
    userId: string;
    username: string;
    companyId: string;
    userRole: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', data);
    return response.data;
}

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
    gender: string;
}

export const registerCompany = async (data: CompanyRegisterData) => {
    const response = await api.post('/companies/register', data);
    return response.data;
};



export const setPassword = async (token: string, password: string) => {
    const response = await api.post(
        `/employees/set-password`,
        null,
        {
            params: {
                token: token,
                newPassword: password
            }
        }
    );
    return response.data;
};



export interface PayrollConfigurationRequestDto {
    companyId: string;

    hraApplicable?: boolean;
    conveyanceApplicable?: boolean;
    medicalApplicable?: boolean;
    specialAllowanceApplicable?: boolean;
    bonusApplicable?: boolean;

    hraPercentage?: number;
    conveyanceAmount?: number;
    medicalAllowanceAmount?: number;
    specialAllowancePercentage?: number;
    bonusPercentage?: number;

    pfApplicable?: boolean;
    esiApplicable?: boolean;
    pfEmployeePercentage?: number;
    pfEmployerPercentage?: number;
    esiEmployeePercentage?: number;
    esiEmployerPercentage?: number;
    professionalTax?: number;

    taxSlab1Limit?: number;
    taxSlab1Rate?: number;
    taxSlab2Limit?: number;
    taxSlab2Rate?: number;
    taxSlab3Limit?: number;
    taxSlab3Rate?: number;
    isActive?: boolean;
}


export interface PayrollConfigurationResponseDto extends PayrollConfigurationRequestDto {
    payrollConfigurationId: string;
    isActive: boolean;
}

export const fetchPayrollConfigurationByCompanyId = async (companyId: string): Promise<PayrollConfigurationResponseDto | null> => {
    try {
        const response = await api.get<PayrollConfigurationResponseDto>(`/payroll-configurations/${companyId}`);
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            return null; // First time — no config yet
        }
        throw err;
    }
};

export const addPayrollConfiguration = async (
    payload: PayrollConfigurationRequestDto
): Promise<string> => {
    const response = await api.post<string>('/payroll-configurations', payload);
    return response.data;
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
    bonusAmount?: number;
}

export interface SalaryStructureResponseDto {
    salaryStructureId: string;
    employeeId: string;
    employeeName: string;
    companyId: string;

    basicSalary: number;
    hra: number;
    conveyance: number;
    medicalAllowance: number;
    specialAllowance: number;
    bonusAmount: number;

    grossSalary: number;
    ctc: number;

    pfEmployee: number;
    pfEmployer: number;
    esiEmployee: number;
    esiEmployer: number;
    professionalTax: number;
    incomeTax: number;

    netSalary: number;
}

export const createSalaryStructure = async (
    payload: SalaryStructureRequestDto
): Promise<string> => {
    const response = await api.post<string>('/salary-structures', payload);
    return response.data;
};

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
    empCode: string;
    designation: string;
    employeeEmail: string;
    employeeContactNumber: string;
    companyId: string;
    companyName: string;
    month: string;
    year: number;

    basicSalary: number;
    hra: number;
    conveyance: number;
    medicalAllowance: number;
    specialAllowance: number;
    bonusAmount: number;
    grossSalary: number;

    pfEmployeeAmount: number;
    pfEmployerAmount: number;
    esiEmployeeAmount: number;
    esiEmployerAmount: number;
    professionalTaxAmount: number;
    incomeTaxAmount: number;
    totalDeductions: number;

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




export interface CompanyDetails {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
};

export const getCompanyDetails = async (companyId: string): Promise<CompanyDetails> => {
    const response = await api.get<CompanyDetails>(`/companies/${companyId}`);
    return response.data;
}




export const deactivateEmployee = async (employeeId: string): Promise<string> => {
    const response = await api.patch<string>(`/employees/${employeeId}/deactivate`);
    return response.data;
};

export const sendSetPasswordEmail = async (employeeId: string): Promise<string> => {
    const response = await api.post<string>(`/send-passwordreset`, null, {
        params: { employeeId }
    });
    return response.data;
};

export interface EmployeeResponseDto {
    employeeId: string;
    name: string;
    email: string;
    contactNumber: string;
    department: string;
    empcode: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    birthdate?: string;
    designation: string;
    joiningDate: string;
    companyId: string;
    role: 'ADMIN' | 'EMPLOYEE';
    employeeStatus: 'Active' | 'Inactive';
}

export const getEmployeeById = async (employeeId: string) => {
    const response = await api.get<EmployeeResponseDto>(`/employees/${employeeId}`);
    return response.data;
};


export interface EmployeeUpdateRequestDto {
    name: string;
    email: string;
    contactNumber?: string;
    department?: string;
    birthdate?: string;
    designation?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    joiningDate?: string;
    companyId?: string;
}
export const updateEmployee = async (employeeId: string, payload: EmployeeUpdateRequestDto): Promise<string> => {
    const response = await api.put<string>(`/employees/${employeeId}`, payload);
    return response.data;
};


export const downloadPayrollPdf = async (payrollId: string): Promise<Blob> => {
    const response = await api.get(`/payrolls/download/${payrollId}`, {
        responseType: "blob"
    });

    return response.data;
};