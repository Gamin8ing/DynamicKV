import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  Bell,
  UserCircle,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Check,
  X,
  Clock,
  AlertCircle
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import { AdminDataContext } from '../../context/AdminContext'

// Helper to format time
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Notification item component
const NotificationItem = ({ notification, onMarkAsRead }) => {
  // Determine icon based on notification type
  const getIcon = (type) => {
    switch(type) {
      case 'alert': return <AlertCircle size={16} className="text-red-500" />;
      case 'info': return <Clock size={16} className="text-blue-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };
  
  return (
    <div 
      className={`p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
        notification.read ? 'text-gray-600' : 'border-l-2 border-l-blue-500'
      }`}
    >
      <div className="flex items-start">
        <div className="mt-0.5 mr-3 flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <p className={`text-sm ${notification.read ? 'font-normal' : 'font-medium'}`}>
              {notification.message}
            </p>
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="ml-2 flex-shrink-0 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Mark as read"
              >
                <Check size={14} />
              </button>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {formatTimeAgo(notification.timestamp || new Date())}
            </span>
            
            {notification.actionUrl && (
              <Link 
                to={notification.actionUrl}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                View details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminHeader = () => {
  const { user, logout } = useContext(AdminDataContext)
  const navigate = useNavigate()

  // Dropdown states
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const profileRef = useRef(null)
  const notifRef = useRef(null)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [])
  
  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await API.get('/admin/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdowns on outside click or ESC
  useEffect(() => {
    const handleClick = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false)
      }
    }
    
    const handleEsc = e => {
      if (e.key === 'Escape') {
        setShowProfile(false)
        setShowNotifs(false)
      }
    }
    
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleEsc)
    
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const markAsRead = async (id) => {
    try {
      await API.post(`/admin/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(x => x.id === id ? { ...x, read: true } : x)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }
  
  const markAllAsRead = async () => {
    try {
      await API.post('/admin/notifications/read-all');
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Dynamic KV
          </h1>
          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
            ADMIN
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setShowNotifs(prev => !prev)
                setShowProfile(false)
              }}
              className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
              aria-expanded={showNotifs}
            >
              <Bell size={20} className="text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-4 h-4 text-xs flex items-center justify-center px-1">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Modernized Notifications dropdown */}
            {showNotifs && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden animate-fadeIn">
                <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h3 className="font-medium text-gray-800 flex items-center">
                    <Bell size={16} className="mr-2 text-blue-500" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center font-medium hover:underline"
                    >
                      <Check size={12} className="mr-1" />
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-3">
                        <Bell size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">No notifications yet</p>
                      <p className="text-gray-400 text-xs mt-1">We'll notify you when something happens</p>
                    </div>
                  ) : (
                    <>
                      {notifications.some(n => !n.read) && (
                        <div className="bg-blue-50 px-3 py-2">
                          <p className="text-xs text-blue-600 font-medium">New notifications</p>
                        </div>
                      )}
                      
                      {notifications.filter(n => !n.read).map(notification => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onMarkAsRead={markAsRead} 
                        />
                      ))}
                      
                      {notifications.some(n => n.read) && (
                        <div className="bg-gray-50 px-3 py-2">
                          <p className="text-xs text-gray-500 font-medium">Earlier</p>
                        </div>
                      )}
                      
                      {notifications.filter(n => n.read).map(notification => (
                        <NotificationItem 
                          key={notification.id} 
                          notification={notification} 
                          onMarkAsRead={markAsRead} 
                        />
                      ))}
                    </>
                  )}
                </div>
                
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={fetchNotifications}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Clock size={12} className="mr-1" />
                    Refresh
                  </button>
                  
                  <Link 
                    to="/admin/notifications" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    onClick={() => setShowNotifs(false)}
                  >
                    All notifications
                    <ChevronDown size={16} className="ml-1 rotate-270" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setShowProfile(prev => !prev)
                setShowNotifs(false)
              }}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors"
              aria-label="User menu"
              aria-expanded={showProfile}
            >
              <UserCircle size={20} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user?.fullName?.firstName || 'Admin'}
              </span>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            {/* Profile dropdown */}
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.fullName?.firstName} {user?.fullName?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {user?.email || 'admin@example.com'}
                  </p>
                </div>
                
                <div className="py-1">
                  <Link
                    to="/admin/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfile(false)}
                  >
                    <User size={16} className="mr-3 text-gray-500" />
                    Profile
                  </Link>
                  <Link
                    to="/admin/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowProfile(false)}
                  >
                    <Settings size={16} className="mr-3 text-gray-500" />
                    Settings
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    <LogOut size={16} className="mr-3 text-red-500" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader