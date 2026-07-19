import React from 'react';
import { render, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Helper component to consume the context
const TestWrapper = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

const UseAuth = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  return { user, login, logout, isAuthenticated };
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  test('should initialize with no user', () => {
    const { result } = render(<UseAuth />, { wrapper: TestWrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should login user with valid credentials', async () => {
    const { result } = render(<UseAuth />, { wrapper: TestWrapper });
    await act(async () => {
      await result.current.login({ email: 'admin@trustgraph.com', password: 'password123' });
    });
    expect(result.current.user).toEqual({ email: 'admin@trustgraph.com' });
    expect(result.current.isAuthenticated).toBe(true);
    // Check localStorage
    expect(window.localStorage.getItem('user')).toBe('{"email":"admin@trustgraph.com"}');
  });

  test('should not login with invalid credentials', async () => {
    const { result } = render(<UseAuth />, { wrapper: TestWrapper });
    await act(async () => {
      try {
        await result.current.login({ email: 'wrong@example.com', password: 'wrong' });
      } catch (e) {
        // Expected to throw
      }
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem('user')).toBeNull();
  });

  test('should logout user', async () => {
    const { result } = render(<UseAuth />, { wrapper: TestWrapper });
    // First login
    await act(async () => {
      await result.current.login({ email: 'admin@trustgraph.com', password: 'password123' });
    });
    expect(result.current.user).toEqual({ email: 'admin@trustgraph.com' });
    // Then logout
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(window.localStorage.getItem('user')).toBeNull();
  });
});