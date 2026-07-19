import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';

export default function Login({ onSuccess }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 p-4">
      <div className="bg-surface-container/80 rounded-2xl shadow-xl w-full max-w-md p-8 space-y-4">
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">
          TrustGraph AI
          </h1>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">Beta</span>
          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">Secure</span>
          <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">Free Trial</span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter your password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-xs text-center text-on-surface-variant">
          Don't have an account? <span className="text-primary underline">Request access</span>
        </p>
      </div>
    </div>
  );
}