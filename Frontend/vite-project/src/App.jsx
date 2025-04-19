// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

// Auth pages
import UserLogin from './pages/User/UserLogin';
import UserSignup from './pages/User/UserSignup';
import Home from './pages/Home';

// Admin pages
import AdminDashboard from './pages/Admin/DashBoard';
import Orders from './pages/Admin/Orders';
import Products from './pages/Admin/Products';
import Users from './pages/Admin/Users';

// Admin layout components
import AdminLayout from './components/Admin/AdminLayout';

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard (to be implemented)</div>} />
          <Route path="/profile" element={<div>User Profile (to be implemented)</div>} />
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>

        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </UserProvider>
  );
}

export default App;