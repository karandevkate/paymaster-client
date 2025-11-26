// Navbar.tsx
import React, { useState, useEffect, ReactNode } from 'react';

interface NavbarProps {
  children?: ReactNode;
}

export const Navbar = ({ children }: NavbarProps) => {
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser({ name: storedUser });
    }
  }, []);

  const displayName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase()
    : 'Guest';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div className="container-fluid px-4 px-lg-5">

        {/* Left Side: Mobile Toggle + Logo */}
        <div className="d-flex align-items-center">

          {/* Mobile Menu Button (passed from Layout) */}
          {children}

          {/* Logo + App Name */}
          <div className="d-flex align-items-center">
            <img
              src="/favicon.png"
              alt="payMaster Logo"
              className="me-3"
              style={{ height: '40px' }}
            />
            <span className="navbar-brand mb-0 h1 fw-bold text-primary">payMaster</span>
          </div>
        </div>

        {/* Right Side: User Info */}
        <div className="d-flex align-items-center ms-auto">

          <div className="text-end me-4">
            <small className="text-muted d-block">Welcome back</small>
            <span className="fw-semibold text-dark">{displayName}</span>
          </div>

          {/* Optional: User Avatar */}
          <div className="me-3">
            <div
              className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{ width: '38px', height: '38px', fontSize: '14px' }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};