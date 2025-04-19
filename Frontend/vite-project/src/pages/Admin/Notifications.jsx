// src/pages/Admin/Notifications.jsx
import React, { useState, useEffect } from 'react'
import { BellIcon, Check, Clock, XCircle, Mail } from 'lucide-react'
import API from '../../utils/api'

const Notifications = () => {
  const [notifs, setNotifs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 1) Fetch notifications on mount
  useEffect(() => {
    API.get('/admin/notifications')
      .then(res => setNotifs(res.data))
      .catch(err => {
        console.error(err)
        setError('Notifications load nahi hui')
      })
      .finally(() => setLoading(false))
  }, [])

  // 2) Mark single notif as read
  const markAsRead = id => {
    API.post(`/admin/notifications/${id}/read`)
      .then(() => {
        setNotifs(prev =>
          prev.map(n => (n.id === id ? { ...n, read: true } : n))
        )
      })
      .catch(err => console.error('Mark read error', err))
  }

  // 3) Mark all as read
  const markAllAsRead = () => {
    API.post('/admin/notifications/read-all')
      .then(() => {
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))
      })
      .catch(err => console.error('Mark all read error', err))
  }

  // Calculate unread count
  const unreadCount = notifs.filter(n => !n.read).length

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <BellIcon className="mr-2" size={24} /> Notifications
            </h1>
            <p className="text-gray-500 mt-1">Stay updated with important system alerts</p>
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center text-sm font-medium"
            >
              <Check size={16} className="mr-1" /> Mark all as read
            </button>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 text-red-600 p-6 rounded-lg">
            <div className="flex items-center">
              <XCircle size={20} className="mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && notifs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-16 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications</h3>
            <p className="text-gray-500">Koi notification nahi hai.</p>
          </div>
        )}

        {/* Notifications list */}
        {!loading && !error && notifs.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {notifs.map(n => (
                <li
                  key={n.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    n.read ? '' : 'bg-blue-50 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`mt-1 mr-3 ${n.read ? 'text-gray-400' : 'text-blue-500'}`}>
                      {n.read ? <BellIcon size={18} /> : <BellIcon size={18} />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className={`${n.read ? 'text-gray-600' : 'text-gray-800 font-medium'}`}>
                          {n.message}
                        </p>
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="ml-4 text-blue-600 text-sm hover:text-blue-800 flex items-center"
                          >
                            <Check size={16} className="mr-1" /> Mark read
                          </button>
                        )}
                      </div>
                      
                      {n.date && (
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {formatDate(n.date)}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications