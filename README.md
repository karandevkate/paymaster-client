# PayMaster - Multi-Company Payroll Management System

A complete React-based Payroll Management System supporting multi-tenancy via a mock backend.

## Features
- **Company Registration & Auth**: Full onboarding flow for new companies.
- **Employee Management**: CRUD operations for employee data.
- **Dynamic Salary Structure**: Auto-calculated components (HRA, DA, PF) based on company-wide settings.
- **Payroll Processing**: Generation of monthly payrolls with tax and LOP deductions.
- **Leave Management**: Track and approve employee leaves.

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Redux Toolkit (State Management)
- Axios (API Client with Mock Adapter)
- React Router v6 (HashRouter)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```

## Mock Backend
This project uses a local `mockServer` (intercepting Axios requests) to simulate a backend database using browser `localStorage`. This ensures the app is fully functional without a real API server running.
- To reset data, clear your browser's Local Storage.

## Default Login
Register a new company to create your admin credentials.
