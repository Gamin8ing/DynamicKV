import React from 'react'
import { Route, Routes } from 'react-router-dom'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />  
      </Routes>
    </div>
  )
}

export default App