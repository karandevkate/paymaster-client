// Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const allLinks = [
  { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'hr', 'manager', 'employee'] },
  { name: 'Payroll Configuration', path: '/settings/company', roles: ['admin', 'hr'] },
  { name: 'Employees', path: '/employees', roles: ['admin', 'hr', 'employee'] },
  { name: 'Salary Structure', path: '/salary', roles: ['admin', 'hr'] },
  { name: 'Payroll', path: '/payroll', roles: ['admin', 'hr', 'manager', 'employee'] },
];

interface SidebarProps {
  showHeader?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ showHeader = true }) => {
  const navigate = useNavigate();
  const role = (localStorage.getItem('userRole') || 'employee').toLowerCase();
  const links = allLinks.filter(link => link.roles.includes(role));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    // FIX: Added height: '100vh' to ensure the component takes full vertical space.
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: '250px', height: '100vh' }}>
      {showHeader && (
        <div className="border-bottom border-secondary pb-3 mb-3 text-center">
          <h6 className="text-uppercase fw-bold text-light mb-0">MENU</h6>
        </div>
      )}

      {/* The mb-auto class here pushes the element below it (the logout div) to the bottom */}
      <ul className="nav nav-pills flex-column mb-auto ">
        {links.map(link => (
          <li className="nav-item mb-3" key={link.path}>
            <NavLink
              to={link.path}
              end
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* This section is naturally pushed to the bottom by the mb-auto on the ul */}
      <div className="border-top border-secondary pt-3 ">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
        >
          <i className="bi bi-box-arrow-right"></i>
          Logout
        </button>
      </div>
    </div>
  );
};