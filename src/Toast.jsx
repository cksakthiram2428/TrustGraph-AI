import React, { useContext } from 'react';
import { useToast } from './context/ToastContext.jsx';

const ToastAlert = () => {
  const { toastConfig } = useToast();
  if (!toastConfig.message) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 p-4">
      <div 
        className={`px-4 py-2 rounded 
          ${toastConfig.type === 'success' ? 'bg-green-600' : 
            toastConfig.type === 'error' ? 'bg-red-600' : 
            'bg-blue-600'} 
          text-white`}
      >
        {toastConfig.message}
      </div>
    </div>
  );
};

export default ToastAlert;