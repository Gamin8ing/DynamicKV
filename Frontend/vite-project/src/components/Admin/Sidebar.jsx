import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  ChevronRight
} from 'lucide-react'

const menuItems = [
  { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/admin/users',     icon: <Users size={20} />,             label: 'Users'     },
  { path: '/admin/products',  icon: <Package size={20} />,           label: 'Products'  },
  { path: '/admin/orders',    icon: <ShoppingCart size={20} />,      label: 'Orders'    },
  { path: '/admin/settings',  icon: <Settings size={20} />,          label: 'Settings'  },
]

const Sidebar = () => {
  // collapse state persistent in localStorage
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
        h-screen bg-[#BED8D4] shadow-lg transition-all duration-300
      `}
    >
      {/* Brand + toggle */}
      <div className="flex justify-between items-center p-4 border-b border-[#72D3D5]/30">
        {!collapsed && (
          <h2 className="font-bold text-lg text-[#63D2FF]">Dynamic KV</h2>
        )}
        <button
          onClick={() => setCollapsed(prev => !prev)}
          className="p-1 rounded-full bg-white/30 hover:bg-white/50 transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight
            size={18}
            className={`transform transition-transform ${
              collapsed ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.path} className="relative group">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition ${
                    isActive
                      ? 'bg-[#63D2FF] text-white'
                      : 'text-gray-700 hover:bg-[#63D2FF]/20'
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && (
                  <span className="ml-3 font-medium">{item.label}</span>
                )}
              </NavLink>

              {/* Tooltip on collapse */}
              {collapsed && (
                <span
                  className="
                    absolute left-full top-1/2 -translate-y-1/2 
                    ml-2 px-2 py-1 text-xs text-white bg-gray-800 rounded 
                    opacity-0 group-hover:opacity-100 
                    whitespace-nowrap transition-opacity
                  "
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Optional footer */}
      {!collapsed && (
        <div className="p-4 border-t border-[#72D3D5]/30 text-sm text-gray-600">
          v1.0.0
        </div>
      )}
    </aside>
  )
}

export default Sidebar
