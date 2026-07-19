import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for initial load

  // Load user from localStorage on init
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse user from localStorage', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate credential validation
    if (userData.email === 'admin@trustgraph.com' && userData.password === 'password123') {
      // In a real app, you would get the user data from the API response
      const returnedUser = { email: userData.email };
      setUser(returnedUser);
      localStorage.setItem('user', JSON.stringify(returnedUser));
      return returnedUser;
    } else {
      throw new Error('Invalid email or password');
    }
  };

  const logout = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    localStorage.removeItem('user');
  };

  // If we are still loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};