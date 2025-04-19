import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react'

const menuItems = [
  { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
  { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
  { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
  { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
]

const Sidebar = () => {
  // Collapse state persistent in localStorage
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true'
  })

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed)
  }, [collapsed])

  return (
    <aside
      className={`
        flex flex-col
        ${collapsed ? 'w-16' : 'w-64'}
        h-screen bg-white border-r border-gray-100 shadow-sm transition-all duration-300
      `}
    >
      {/* Brand + toggle */}
      <div className="flex justify-between items-center px-4 py-5 border-b border-gray-100">
        {!collapsed && (
          <h2 className="font-bold text-lg bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Dynamic KV
          </h2>
        )}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className={`
            p-1.5 rounded-full hover:bg-gray-100 
            transition-colors text-gray-500 hover:text-gray-700
            ${collapsed ? 'mx-auto' : ''}
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.path} className="relative group">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center py-2.5 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
              
              {/* Tooltip on collapse */}
              {collapsed && (
                <span
                  className="
                    absolute left-full top-1/2 -translate-y-1/2
                    ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded
                    opacity-0 group-hover:opacity-100
                    z-10 whitespace-nowrap transition-opacity
                  "
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className={`
        p-4 border-t border-gray-100 
        text-xs text-gray-400 flex items-center justify-center
        ${collapsed ? 'py-3 px-0' : ''}
      `}>
        {collapsed ? (
          <span className="text-center">1.0</span>
        ) : (
          <span>Version 1.0.0</span>
        )}
      </div>
    </aside>
  )
}

export default Sidebar