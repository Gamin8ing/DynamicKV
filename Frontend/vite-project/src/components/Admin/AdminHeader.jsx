import React, { useState, useEffect, useRef } from 'react';
import { BellIcon, UserCircleIcon, ChevronDownIcon } from 'lucide-react';
import { Link } from 'react-router-dom'; // Optional: for proper navigation

const AdminHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dropdown items as an array for maintainability
  const dropdownItems = [
    { label: 'Profile', path: '/admin/profile' },
    { label: 'Settings', path: '/admin/settings' },
    { label: 'Logout', path: '/logout', color: 'text-red-600' },
  ];

  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-[#72D3D5] to-[#63D2FF] text-white px-6 py-3 shadow-lg">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">Dynamic KV</h1>
        <span className="bg-white text-[#63D2FF] text-xs px-2 py-1 rounded-full font-medium">ADMIN</span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          className="relative p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <BellIcon size={20} />
          <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 hover:bg-white/20 transition"
          >
            <UserCircleIcon size={20} />
            <span className="text-sm font-medium">Admin</span>
            <ChevronDownIcon size={16} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              {dropdownItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path} // Replace with <a href={item.path}> if not using react-router-dom
                  className={`block px-4 py-2 text-sm ${item.color || 'text-gray-700'} hover:bg-gray-100`}
                  onClick={() => setShowDropdown(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;