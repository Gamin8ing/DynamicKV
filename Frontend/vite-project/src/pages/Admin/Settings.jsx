// src/pages/Admin/Settings.jsx
import React, { useState, useEffect } from 'react'
import API from '../../utils/api'

const Settings = () => {
  // state
  const [settings, setSettings] = useState({
    siteTitle: '',
    notificationsEnabled: false,
    itemsPerPage: 10,
  })
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(null)

  // 1. mount pe settings fetch karo
  useEffect(() => {
    API.get('/admin/settings')
      .then(res => {
        setSettings(res.data)
      })
      .catch(() => {
        setError('Settings load nahi hui')
      })
      .finally(() => setLoading(false))
  }, [])

  // 2. form input change handler
  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // 3. form submit handler
  const handleSubmit = e => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    API.put('/admin/settings', settings)
      .then(res => {
        setSettings(res.data)
        setSuccess('Settings saved successfully!')
      })
      .catch(() => {
        setError('Save karte time error aayi')
      })
      .finally(() => setSaving(false))
  }

  // 4. render
  if (loading) return <p className="p-6 text-gray-500">Loading settings...</p>

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Site Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Site Title
          </label>
          <input
            type="text"
            name="siteTitle"
            value={settings.siteTitle}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Notifications Toggle */}
        <div className="flex items-center space-x-2">
          <input
            id="notificationsEnabled"
            type="checkbox"
            name="notificationsEnabled"
            checked={settings.notificationsEnabled}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="notificationsEnabled" className="text-sm text-gray-700">
            Enable Email Notifications
          </label>
        </div>

        {/* Items Per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Items Per Page
          </label>
          <select
            name="itemsPerPage"
            value={settings.itemsPerPage}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            {[10, 20, 50, 100].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#63D2FF] text-white py-2 rounded hover:bg-[#72D3D5] transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

export default Settings
