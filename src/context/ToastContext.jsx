import React, { createContext, useContext, useState, useRef } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toastConfig, setToastConfig] = useState({ message: '', type: 'info' });
  const timeoutRef = useRef(null);

  const showToast = (message, type = 'info') => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToastConfig({ message, type });

    // Set new timeout to clear the toast
    timeoutRef.current = setTimeout(() => {
      setToastConfig({ message: '', type: 'info' });
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toastConfig, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};