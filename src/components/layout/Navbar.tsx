import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUser({ name: storedUser });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="flex items-center text-xl font-bold text-primary-600">
          <img
            src="favicon.png"
            alt="Logo"
            className="h-12 w-auto"
          />
          <span className="ml-2">payMaster</span>
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Welcome, {user?.name || 'Guest'}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
