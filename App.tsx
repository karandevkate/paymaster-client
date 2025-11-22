import React from 'react';
import { AppRoutes } from './src/routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Toaster position="top-right" />
      <AppRoutes />
    </div>
  );
};

export default App;
