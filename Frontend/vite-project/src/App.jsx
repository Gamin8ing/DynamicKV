// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Home          from './pages/Home.jsx'
import UserLogin     from './pages/UserLogin.jsx'
import UserSignup    from './pages/UserSignup.jsx'

import AdminLayout   from './components/Admin/AdminLayout.jsx'
//import AdminLogin    from './pages/Admin/AdminLogin.jsx'
import AdminDashboard from './pages/Admin/DashBoard.jsx'
import Products      from './pages/Admin/Products.jsx'
import Orders        from './pages/Admin/Orders.jsx'
import User          from './pages/Admin/Users.jsx'

const App = () => (
  <Routes>
    {/* public user routes */}
    <Route path="/"         element={<Home/>} />
    <Route path="/userlogin"   element={<UserLogin/>} />
    <Route path="/usersignup"  element={<UserSignup/>} />

    {/* admin login (public) */}
    {/* <Route path="/admin/login" element={<AdminLogin/>} /> */}

    {/* all /admin/* routes share the layout */}
    <Route path="/admin" element={<AdminLayout/>}>
      {/* redirect /admin → /admin/dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />

      <Route path="dashboard" element={<AdminDashboard/>} />
      <Route path="products"  element={<Products/>}      />
      <Route path="orders"    element={<Orders/>}        />
      <Route path="users"     element={<User/>}          />
    </Route>

    {/* fallback */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default App
