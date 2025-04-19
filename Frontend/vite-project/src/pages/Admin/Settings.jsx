import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import API from '../../utils/api';

const FormField = ({ label, name, type = 'text', value, onChange, children, required = false }) => {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {children || (
        type === 'checkbox' ? (
          <div className="flex items-center space-x-2">
            <input
              id={name}
              type="checkbox"
              name={name}
              checked={value}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor={name} className="text-sm text-gray-700">
              {label}
            </label>
          </div>
        ) : (
          <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required={required}
          />
        )
      )}
    </div>
  );
};

const Settings = () => {
  // State
  const [settings, setSettings] = useState({
    siteTitle: '',
    notificationsEnabled: false,
    itemsPerPage: 10,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch settings on component mount
  const fetchSettings = async () => {
    try {
      const response = await API.get('/admin/settings');
      setSettings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await API.put('/admin/settings', settings);
      setSettings(response.data);
      setSuccess('Settings saved successfully!');
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchSettings();
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-3"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <SettingsIcon size={24} className="text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        </div>
        
        <button 
          onClick={handleRefresh}
          className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>
      
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
            <AlertCircle size={20} className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 flex items-start">
            <CheckCircle size={20} className="text-green-500 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}
        
        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Site Title */}
          <FormField
            label="Site Title"
            name="siteTitle"
            value={settings.siteTitle}
            onChange={handleChange}
            required
          />
          
          {/* Notifications Toggle */}
          <div className="flex items-center space-x-3">
            <input
              id="notificationsEnabled"
              type="checkbox"
              name="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onChange={handleChange}
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <label htmlFor="notificationsEnabled" className="text-gray-700">
              Enable Email Notifications
            </label>
          </div>
          
          {/* Items Per Page */}
          <div className="space-y-2">
            <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700">
              Items Per Page
            </label>
            <select
              id="itemsPerPage"
              name="itemsPerPage"
              value={settings.itemsPerPage}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {[10, 20, 50, 100].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {saving ? (
              <>
                <RefreshCw size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;