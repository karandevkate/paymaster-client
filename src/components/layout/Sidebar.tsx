// Sidebar.tsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const allLinks = [
  { name: 'Dashboard', path: '/dashboard', roles: ['admin', 'employee'] },
  { name: 'Payroll Configuration', path: '/settings/company', roles: ['admin'] },
  { name: 'Employees', path: '/employees', roles: ['admin', 'employee'] },
  { name: 'Salary Structure', path: '/salary', roles: ['admin'] },
  { name: 'Payroll', path: '/payroll', roles: ['admin', 'employee'] },
];

interface SidebarProps {
  showHeader?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ showHeader = true }) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const role = (user?.userRole || localStorage.getItem('userRole') || 'employee').toLowerCase();
  
  const links = allLinks.filter(link => link.roles.includes(role));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white" style={{ width: '250px', height: '100vh' }}>
      {showHeader && (
        <div className="border-bottom border-secondary pb-3 mb-3 text-center">
          <h2 className="fw-bold text-primary mb-0">PayMaster</h2>
          <small className="text-muted text-uppercase fw-bold">Menu</small>
        </div>
      )}

      <ul className="nav nav-pills flex-column mb-auto ">
        {links.map(link => (
          <li className="nav-item mb-2" key={link.path}>
            <NavLink
              to={link.path}
              end
              className={({ isActive }) =>
                `nav-link text-white ${isActive ? 'active bg-primary' : ''}`
              }
            >
              <i className={`bi bi-${getIcon(link.name)} me-2`}></i>
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="border-top border-secondary pt-3 ">
        <div className="mb-3 px-3">
            <small className="text-muted d-block text-truncate">{user?.email}</small>
            <span className="badge bg-secondary text-uppercase" style={{ fontSize: '0.7rem' }}>{role}</span>
        </div>
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

const getIcon = (name: string) => {
    switch(name) {
        case 'Dashboard': return 'speedometer2';
        case 'Payroll Configuration': return 'gear-fill';
        case 'Employees': return 'people-fill';
        case 'Salary Structure': return 'cash-stack';
        case 'Payroll': return 'file-earmark-text-fill';
        default: return 'circle';
    }
}
