import React from 'react'
import { Route, Routes } from 'react-router-dom'
import  UserLogin  from './pages/UserLogin.jsx'
import  UserSignup  from './pages/UserSignup.jsx'
import Home from './pages/Home.jsx'
import AdminDashBoard from './pages/AdminDashBoard.jsx'
import AdminRoute from './routes/AdminRoute.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/userlogin" element={<UserLogin/>} />
        <Route path="/usersignup" element={<UserSignup/>} />  
        <Route path="/admin/dashboard" element={
             <AdminRoute>
              <AdminDashBoard/>
             </AdminRoute>
          } />
      </Routes>
    </div>
  )
}

export default App