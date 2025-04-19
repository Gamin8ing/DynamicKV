// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider } from './context/UserContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

import Home from './pages/Home.jsx'
import UserLogin from './pages/User/UserLogin.jsx'
import UserSignup from './pages/User/UserSignup.jsx'

import AdminLayout from './components/Admin/AdminLayout.jsx'
//import AdminLogin    from './pages/Admin/AdminLogin.jsx'
import AdminDashboard from './pages/Admin/DashBoard.jsx'
import Products from './pages/Admin/Products.jsx'
import Orders from './pages/Admin/Orders.jsx'
import User from './pages/Admin/Users.jsx'
import Profile from './pages/Admin/Profile.jsx'
import Settings from './pages/Admin/Settings.jsx'
import Notifications from './pages/Admin/Notifications.jsx'


const App = () => (
  <UserProvider>
    <Routes>
      {/* public user routes */}
      <Route path="/" element={<Home />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
      </Route>

      {/* admin login (public) */}
      {/* <Route path="/admin/login" element={<AdminLogin/>} /> */}

      {/* all /admin/* routes share the layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* redirect /admin → /admin/dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<User />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />

        </Route>
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </UserProvider>
)

export default App;