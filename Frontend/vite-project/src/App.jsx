// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home            from './pages/Home.jsx'
import UserLogin       from './pages/User/UserLogin.jsx'
import UserSignup      from './pages/User/UserSignup.jsx'

import AdminLayout     from './components/Admin/AdminLayout.jsx'
import AdminLogin      from './pages/User/UserLogin.jsx'
import AdminDashboard  from './pages/Admin/DashBoard.jsx'
import Products        from './pages/Admin/Products.jsx'
import Orders          from './pages/Admin/Orders.jsx'
import Users           from './pages/Admin/Users.jsx'
import Profile         from './pages/Admin/Profile.jsx'
import Settings        from './pages/Admin/Settings.jsx'
import Notifications from './pages/Admin/Notifications.jsx'

const App = () => (
  <Routes>
    {/* Public user routes */}
    <Route path="/"          element={<Home />} />
    <Route path="/userlogin" element={<UserLogin />} />
    <Route path="/usersignup" element={<UserSignup />} />

    {/* Admin login (public) */}
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* All /admin/* routes share the layout */}
    <Route path="/admin" element={<AdminLayout />}>
      {/* Redirect /admin → /admin/dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="products"  element={<Products />} />
      <Route path="orders"    element={<Orders />} />
      <Route path="users"     element={<Users />} />
      <Route path="profile"   element={<Profile />} />
      <Route path="settings"  element={<Settings />} />
      <Route path="notifications" element={<Notifications />} />

      {/* Redirect /admin/logout to /admin/login */}
      <Route
        path="logout"
        element={<Navigate to="/admin/login" replace />}
      />
    </Route>

    {/* Fallback to home */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default App
