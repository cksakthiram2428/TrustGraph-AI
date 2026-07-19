import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext.jsx';
import Layout from './components/Layout.jsx';
import RequireAuth from './components/RequireAuth.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes with Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
            </Route>
            
            {/* Login page without Layout */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes - Single Dashboard page with all sections */}
            <Route 
              element={
                <RequireAuth>
                  <Layout><Outlet /></Layout>
                </RequireAuth>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;