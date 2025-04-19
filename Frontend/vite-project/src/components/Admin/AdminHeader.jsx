import React, { useState, useEffect, useRef, useContext } from 'react'
import {
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../utils/api'
import { AdminDataContext } from '../../context/AdminContext'

const AdminHeader = () => {
  const { user, logout } = useContext(AdminDataContext)  // user context se naam/email
  const navigate = useNavigate()

  // dropdown state
  const [showProfile, setShowProfile] = useState(false)
  const [showNotifs, setShowNotifs]   = useState(false)
  const [notifications, setNotifications] = useState([])
  const profileRef = useRef(null)
  const notifRef   = useRef(null)

  // fetch notifications on mount
  useEffect(() => {
    API.get('/admin/notifications').then(res => {
      setNotifications(res.data)    // assume [{id, message, read}]
    })
  }, [])

  // close on outside click or ESC
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
    logout()          // context logout: clear token
    navigate('/admin/login')
  }

  return (
    <header className="flex justify-between items-center bg-gradient-to-r from-[#72D3D5] to-[#63D2FF] text-white px-6 py-3 shadow-lg">
      {/* Brand */}
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl font-bold">Dynamic KV</h1>
        <span className="bg-white text-[#63D2FF] text-xs px-2 py-1 rounded-full font-medium">
          ADMIN
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifs(prev => !prev)
              setShowProfile(false)
            }}
            className="relative p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Notifications"
            aria-expanded={showNotifs}
          >
            <BellIcon size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* notif dropdown */}
          {showNotifs && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden animate-fadeIn">
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-4 text-sm">No notifications.</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-2 text-sm flex justify-between items-start ${
                        n.read ? '' : 'bg-blue-50'
                      } hover:bg-gray-100`}
                    >
                      <span>{n.message}</span>
                      <button
                        onClick={() => {
                          API.post(`/admin/notifications/${n.id}/read`)
                            .then(() => {
                              setNotifications(prev =>
                                prev.map(x =>
                                  x.id === n.id ? { ...x, read: true } : x
                                )
                              )
                            })
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark read
                      </button>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t px-4 py-2 text-center text-xs">
                <Link to="/admin/notifications" className="hover:underline">
                  View all
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
            className="flex items-center space-x-2 bg-white/10 rounded-full px-3 py-1 hover:bg-white/20 transition"
            aria-label="User menu"
            aria-expanded={showProfile}
          >
            <UserCircleIcon size={20} />
            <span className="text-sm font-medium">{user?.fullName.firstName || 'Admin'}</span>
            <ChevronDownIcon size={16} />
          </button>

          {/* profile dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-1 animate-fadeIn">
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setShowProfile(false)}
              >
                Profile
              </Link>
              <Link
                to="/admin/settings"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
                onClick={() => setShowProfile(false)}
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
