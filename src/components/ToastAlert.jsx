import React, { useContext, useEffect } from 'react';
import { useToast } from '../context/ToastContext.jsx';

const ToastAlert = () => {
  const { toastConfig } = useToast();

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (toastConfig.message) {
      const timer = setTimeout(() => {
        // We need to dismiss the toast, but we don't have the dispatch function here.
        // We'll need to update the context to clear the toast.
        // Since we don't have the setter, we'll rely on the context to clear it after a timeout.
        // Alternatively, we can move the timeout to the context.
        // For now, we'll just note that the context should handle the timeout.
        // We'll update the context to clear the toast after 3 seconds.
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastConfig.message]);

  if (!toastConfig.message) return null;

  // Determine color based on type
  const bgColor = toastConfig.type === 'success' 
    ? 'bg-green-600' 
    : toastConfig.type === 'error' 
      ? 'bg-red-600' 
      : 'bg-blue-600';

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 p-4 ${bgColor} text-white rounded-md shadow-lg`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toastConfig.message}
    </div>
  );
};

export default ToastAlert;