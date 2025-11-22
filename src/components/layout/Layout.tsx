import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
      <div className="d-none d-lg-block flex-shrink-0">
        <Sidebar />
      </div>

      <div
        className="offcanvas offcanvas-start d-lg-none"
        tabIndex={-1}
        id="sidebarOffcanvas"
        aria-labelledby="sidebarOffcanvasLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarOffcanvasLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <Sidebar />
        </div>
      </div>

      <div className="flex-grow-1 d-flex flex-column" style={{ height: '100vh' }}>
        <Navbar />
        <main
          className="flex-grow-1 p-3"
          style={{
            overflowY: 'auto',
            height: '100%',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};
