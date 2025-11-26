import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Login } from '../pages/auth/Login';
import { RegisterCompany } from '../pages/auth/RegisterCompany';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { CompanySettingsPage } from '../pages/settings/CompanySettings';
import { EmployeeList } from '../pages/employees/EmployeeList';
import { EmployeeForm } from '../pages/employees/EmployeeForm';
import { SalaryList } from '../pages/salary/SalaryList';
import { PayrollList } from '../pages/payroll/PayrollList';
import { SetPasswordForm } from '../pages/auth/SetPasswordForm';
import ViewEmployee from '../pages/employees/ViewEmployee';
import UpdateEmployee from '../pages/employees/UpdateEmployee';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register-company" element={<RegisterCompany />} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings/company" element={<CompanySettingsPage />} />

          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/employees/add" element={<EmployeeForm />} />
          <Route path="/employees/:employeeId" element={<ViewEmployee />} />
          <Route path="/employees/:employeeId/edit" element={<UpdateEmployee />} />
          <Route path="/salary" element={<SalaryList />} />

          {/* <Route path="/leaves" element={<LeaveList />} /> */}

          <Route path="/payroll" element={<PayrollList />} />
        </Route>

        <Route path="/set-password" element={<SetPasswordForm />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
