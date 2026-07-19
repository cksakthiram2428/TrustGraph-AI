import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      {/* Toast container will be placed in App.js */}
      <main className="flex-1">
        <div className="px-4 pt-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;