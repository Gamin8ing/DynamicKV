import React from 'react'
import { Route, Routes } from 'react-router-dom'
import  Start  from './pages/Start.jsx'
import  UserLogin  from './pages/UserLogin.jsx'
import  UserSignup  from './pages/UserSignup.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start/>} />
        <Route path="/userlogin" element={<UserLogin/>} />
        <Route path="/usersignup" element={<UserSignup/>} />  
      </Routes>
    </div>
  )
}

export default App