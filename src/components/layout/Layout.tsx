import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import './layout.css'; // <-- IMPORT CSS FIX

export const Layout = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex">

      {/* Desktop Sidebar (visible on lg+) */}
      <div
        className="d-none d-lg-block bg-dark text-white position-fixed start-0 top-0 bottom-0 overflow-auto"
        style={{ width: '250px', zIndex: 1030 }}
      >
        <Sidebar showHeader={true} />
      </div>

      {/* MAIN CONTENT - shifts only on large screens */}
      <div className="flex-grow-1 content-shift-lg">

        {/* Navbar */}
        <Navbar>
          {/* Mobile Menu Button */}
          <button
            className="btn btn-outline-primary d-lg-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebarOffcanvas"
            aria-controls="sidebarOffcanvas"
          >
            <i className="bi bi-list fs-4"></i>
          </button>
        </Navbar>

        {/* Page Content */}
        <main className="bg-light min-vh-100">
          <div className="container-fluid px-3 px-md-4 py-4">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar (Offcanvas) */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex={-1}
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
        style={{ width: '260px' }}
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title text-uppercase fw-bold text-secondary">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          />
        </div>

        <div className="offcanvas-body p-0">
          <Sidebar showHeader={false} />
        </div>
      </div>
    </div>
  );
};
