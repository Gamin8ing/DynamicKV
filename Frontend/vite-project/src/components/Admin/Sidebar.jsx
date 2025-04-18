import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  Settings,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const menuItems = [
    { path: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Products' },
    { path: '/admin/orders', icon: <ShoppingCart size={20} />, label: 'Orders' },
  ];
  
  return (
    <aside className={`${collapsed ? 'w-16' : 'w-64'} h-screen bg-[#BED8D4] shadow-lg transition-all duration-300`}>
      <div className="flex justify-between items-center p-4 border-b border-[#72D3D5]/30">
        {!collapsed && (
          <h2 className="font-bold text-lg text-[#63D2FF]">Dynamic KV</h2>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-full bg-white/30 hover:bg-white/50 transition"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight size={18} className={`transform ${collapsed ? 'rotate-180' : 'rotate-0'} transition-transform`} />
        </button>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center p-2 rounded-lg transition ${
                    isActive 
                      ? 'bg-[#63D2FF] text-white' 
                      : 'text-gray-700 hover:bg-[#63D2FF]/20'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;