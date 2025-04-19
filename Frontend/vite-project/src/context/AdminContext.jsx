import React, { createContext, useState, useEffect } from 'react';

export const AdminDataContext = createContext();

const AdminContext = ({ children }) => {
  const [user, setUser] = useState({
    email: '',
    fullName: {
      firstName: '',
      lastName: '',
    },
  });
  const [token, setToken] = useState(null);

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser({
      email: '',
      fullName: {
        firstName: '',
        lastName: '',
      },
    });
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AdminDataContext.Provider
      value={{ user, setUser, token, setToken, login, logout }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};

export default AdminContext;
