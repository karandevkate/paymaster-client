import axios from 'axios';
import { 
    User, 
    Company, 
    CompanySettings, 
    Employee, 
    SalaryStructure, 
    PayrollRecord, 
    Gender, 
    EmployeeStatus 
} from '../types';

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const user = localStorage.getItem('user');
    if (user) {
        const { token } = JSON.parse(user);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// --- Auth ---

export interface LoginRequest {
    email: string;
    password: string;
}

export const login = async (data: LoginRequest): Promise<User> => {
    const response = await api.post<User>('/auth/login', data);
    return response.data;
}

// --- Company ---

export interface CompanyRegisterData {
    name: string;
    email: string;
    contactNumber: string;
    address: string;
    registrationNumber: string;
    adminName: string;
    adminEmail: string;
    adminContactNumber: string;
    birthDate: string;
    gender: Gender | '';
}

export const registerCompany = async (data: CompanyRegisterData) => {
    const response = await api.post('/companies/register', data);
    return response.data;
};

export const getCompanyDetails = async (companyId: string): Promise<Company> => {
    const response = await api.get<Company>(`/companies/${companyId}`);
    return response.data;
}

// --- Employee ---

export interface EmployeeCreate {
    name: string;
    email: string;
    contactNumber: string;
    department: string;
    birthdate: string;
    designation: string;
    gender: Gender | '';
    joiningDate: string;
    pan: string;
    bankName: string;
    accountNumber: string;
    esicNumber: string;
    uanNumber: string;
    location: string;
    password?: string;
    companyId: string;
}

export interface EmployeeUpdate {
    name: string;
    email: string;
    contactNumber: string;
    department: string;
    birthdate: string;
    designation: string;
    gender: Gender | '';
    joiningDate: string;
    pan: string;
    bankName: string;
    accountNumber: string;
    esicNumber: string;
    uanNumber: string;
    location: string;
    companyId: string;
}

export const createEmployee = async (employee: EmployeeCreate) => {
    const response = await api.post('/employees', employee);
    return response.data;
};

export const updateEmployee = async (employeeId: string, employee: EmployeeUpdate) => {
    const response = await api.put(`/employees/${employeeId}`, employee);
    return response.data;
};

export const getEmployeesByCompany = async (companyId: string): Promise<Employee[]> => {
    const response = await api.get<Employee[]>(`/employees/company/${companyId}`);
    return response.data;
};

export const getEmployeeById = async (employeeId: string): Promise<Employee> => {
    const response = await api.get<Employee>(`/employees/${employeeId}`);
    return response.data;
};

export const deactivateEmployee = async (employeeId: string): Promise<string> => {
    const response = await api.patch<string>(`/employees/${employeeId}/deactivate`);
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

export const sendSetPasswordEmail = async (employeeId: string): Promise<string> => {
    const response = await api.post<string>(`/send-passwordreset`, null, {
        params: { employeeId }
    });
    return response.data;
};

// --- Payroll Configuration ---

export interface PayrollConfigurationRequest {
    companyId: string;
    hraApplicable: boolean;
    conveyanceApplicable: boolean;
    medicalApplicable: boolean;
    bonusApplicable: boolean;
    hraPercentage: number;
    conveyancePercentage: number;
    medicalAllowanceAmount: number;
    bonusPercentage: number;
    isPfApplicable: boolean;
    isEsicApplicable: boolean;
    pfEmployeePercentage: number;
    pfEmployerPercentage: number;
    esiEmployeePercentage: number;
    esiEmployerPercentage: number;
    professionalTax: number;
    taxSlab1Limit: number;
    taxSlab1Rate: number;
    taxSlab2Limit: number;
    taxSlab2Rate: number;
    taxSlab3Limit: number;
    taxSlab3Rate: number;
    isActive: boolean;
}

export const fetchPayrollConfigurationByCompanyId = async (companyId: string): Promise<CompanySettings | null> => {
    try {
        const response = await api.get<CompanySettings>(`/payroll-configurations/${companyId}`);
        return response.data;
    } catch (err: any) {
        if (err.response?.status === 404) {
            return null;
        }
        throw err;
    }
};

export const addPayrollConfiguration = async (payload: PayrollConfigurationRequest): Promise<string> => {
    const response = await api.post<string>('/payroll-configurations', payload);
    return response.data;
};

export const updatePayrollConfig = async (payload: PayrollConfigurationRequest): Promise<CompanySettings> => {
    const response = await api.put<CompanySettings>('/payroll-configurations', payload);
    return response.data;
};

// --- Salary Structure ---

export interface SalaryStructureRequest {
    employeeId: string;
    companyId: string;
    basicSalary: number;
    specialAllowance: number;
    bonusAmount?: number;
    isPfApplicable?: boolean;
    isEsicApplicable?: boolean;
}

export const createSalaryStructure = async (payload: SalaryStructureRequest): Promise<string> => {
    const response = await api.post<string>('/salary-structures', payload);
    return response.data;
};

export const updateSalaryStructure = async (payload: SalaryStructureRequest): Promise<string> => {
    const response = await api.put<string>('/salary-structures', payload);
    return response.data;
};

export const getSalaryStructure = async (employeeId: string, companyId: string): Promise<SalaryStructure> => {
    const response = await api.get<SalaryStructure>(`/salary-structures/${employeeId}/${companyId}`);
    return response.data;
};

export const getSalaryStructuresByCompany = async (companyId: string): Promise<SalaryStructure[]> => {
    const response = await api.get<SalaryStructure[]>(`/salary-structures/company/${companyId}`);
    return response.data;
};

// --- Payroll ---

export const getPayrollsByCompany = async (companyId: string): Promise<PayrollRecord[]> => {
    const response = await api.get<PayrollRecord[]>(`/payrolls/company/${companyId}`);
    return response.data;
};

export const getPayrollsByCompanyAndEmployee = async (companyId: string, employeeId: string): Promise<PayrollRecord[]> => {
    const response = await api.get<PayrollRecord[]>(`/payrolls/company/${companyId}/employee/${employeeId}`);
    return response.data;
};

export const downloadPayrollPdf = async (payrollId: string): Promise<Blob> => {
    const response = await api.get(`/payrolls/download/${payrollId}`, {
        responseType: "blob"
    });
    return response.data;
};

export default api;
