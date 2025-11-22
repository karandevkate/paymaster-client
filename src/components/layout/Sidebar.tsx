import React from 'react';
import { NavLink } from 'react-router-dom';

// Define all links with role access
const allLinks = [
  { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'hr', 'manager', 'employee'] },
  { name: 'Employees', path: '/employees', roles: ['admin', 'hr'] },
  { name: 'Salary Structure', path: '/salary', roles: ['admin', 'hr'] },
  { name: 'Payroll', path: '/payroll', roles: ['admin', 'hr', 'manager', 'employee'] },
  { name: 'Company Settings', path: '/settings/company', roles: ['admin', 'hr'] },
];

export const Sidebar: React.FC = () => {
  // Get the user role from localStorage
  const role = localStorage.getItem('userRole'); // default to 'employee' if not set
  const lowerRole = role.toLowerCase();
  // Filter links based on the role
  const links = allLinks.filter(link => link.roles.includes(lowerRole));

  return (
    <aside
      className="bg-dark text-light vh-100 d-flex flex-column"
      style={{ width: '250px', minWidth: '250px' }}
    >
      {/* Menu Header */}
      <div className="d-flex align-items-center justify-content-center border-bottom" style={{ height: '80px' }}>
        <span className="text-uppercase fw-bold small text-secondary">Menu</span>
      </div>

      {/* Navigation Links */}
      <nav className="nav flex-column p-2 flex-grow-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `nav-link rounded ${isActive ? 'active bg-primary text-white' : 'text-light'}`
            }
            style={{ height: '60px', lineHeight: '60px' }}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
