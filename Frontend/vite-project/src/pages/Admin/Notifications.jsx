// src/pages/Admin/Notifications.jsx
import React, { useState, useEffect } from 'react'
import { BellIcon } from 'lucide-react'
import API from '../../utils/api'

const Notifications = () => {
  const [notifs, setNotifs]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
        <BellIcon size={24} /> <span>Notifications</span>
      </h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error   && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-4">
          {notifs.length === 0 && (
            <li className="text-gray-500">Koi notification nahi hai.</li>
          )}
          {notifs.map(n => (
            <li
              key={n.id}
              className={`
                p-4 bg-white rounded shadow-sm flex flex-col
                ${n.read ? '' : 'border-l-4 border-blue-500'}
              `}
            >
              <div className="flex justify-between items-start">
                <p className="text-gray-800">{n.message}</p>
                {!n.read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>
              {n.date && (
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(n.date).toLocaleString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Notifications
