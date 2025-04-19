// src/context/UserContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const UserContext = createContext(null);

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedUser = localStorage.getItem('dynamicKV_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        setError('Failed to restore authentication session');
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Debug: log whenever context value changes
  useEffect(() => {
    console.log('🧩 [UserContext] value changed:', {
      user,
      loading,
      error,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    });
  }, [user, loading, error]);

  // Login function
  const login = async (email, password, isAdmin = false, remember = false) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1000));
      const userData = {
        id: '12345',
        name: isAdmin ? 'Admin User' : 'Regular User',
        email,
        role: isAdmin ? 'admin' : 'user',
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
      };
      setUser(userData);
      if (remember) {
        localStorage.setItem('dynamicKV_user', JSON.stringify(userData));
      }
      return { success: true, user: userData };
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Failed to login');
      return { success: false, error: err.message || 'Failed to login' };
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 1000));
      const newUser = {
        id: 'new-' + Math.random().toString(36).substring(2),
        name: userData.name,
        email: userData.email,
        role: 'user',
        token: 'mock-jwt-token-' + Math.random().toString(36).substring(2)
      };
      return { success: true, user: newUser };
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Failed to register');
      return { success: false, error: err.message || 'Failed to register' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('dynamicKV_user');
  };

  // Helpers
  const isAuthenticated = () => !!user;
  const isAdmin = () => user?.role === 'admin';

  return (
    <UserContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </UserContext.Provider>
  );
};
