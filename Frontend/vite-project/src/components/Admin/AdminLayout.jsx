// src/components/Admin/AdminLayout.jsx
import React from 'react'
import Sidebar from './Sidebar'
import AdminHeader from './AdminHeader'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F7F9F9]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />
        <main className="p-6 overflow-auto flex-1">
          {/* all child admin pages render here */}
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
