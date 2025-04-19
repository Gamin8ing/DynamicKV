import React, { useState } from 'react';
import { User, LogOut, Mail, Phone, MapPin, CreditCard, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('details');
  
  // Mock user data - in a real app, this would come from your auth context
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Anytown, AN 12345",
    joinDate: "January 2023"
  };

  const handleLogout = () => {
    // In a real app, this would call your logout function from auth context
    console.log("Logging out...");
    // Then redirect to login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 pb-20">
      {/* Top navigation bar */}
      <header className="bg-white bg-opacity-70 backdrop-blur-md p-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
                KV
              </div>
              <h1 className="text-xl font-medium text-gray-800">Dynamic KV</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-cyan-600">
              <ArrowLeft size={18} className="mr-1" />
              <span>Back</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-3xl font-medium text-gray-800">Your Profile</h2>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>

        <div className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-white/20">
          <div className="p-8 border-b border-gray-100 flex items-center">
            <div className="h-20 w-20 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center text-white text-3xl font-medium">
              {userData.name.split(' ').map(name => name[0]).join('')}
            </div>
            <div className="ml-6">
              <h3 className="text-2xl font-medium text-gray-800">{userData.name}</h3>
              <p className="text-gray-500">Member since {userData.joinDate}</p>
            </div>
          </div>

          <div className="flex border-b border-gray-100">
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'details' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Account Details
            </button>
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'security' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button 
              className={`px-6 py-4 font-medium ${activeTab === 'payment' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('payment')}
            >
              Payment Methods
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-white">
                      <User size={18} className="text-gray-400 mr-2" />
                      <span>{userData.name}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                    <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-white">
                      <Mail size={18} className="text-gray-400 mr-2" />
                      <span>{userData.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-white">
                      <Phone size={18} className="text-gray-400 mr-2" />
                      <span>{userData.phone}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <div className="flex items-center border border-gray-200 rounded-lg p-3 bg-white">
                      <MapPin size={18} className="text-gray-400 mr-2" />
                      <span>{userData.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium">
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Password Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Current Password</label>
                      <input 
                        type="password" 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-white"
                        placeholder="••••••••••"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">New Password</label>
                      <input 
                        type="password" 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-white"
                        placeholder="••••••••••"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        className="w-full border border-gray-200 rounded-lg p-3 bg-white"
                        placeholder="••••••••••"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium">
                      Update Password
                    </button>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <h4 className="text-lg font-medium text-gray-800 mb-4">Account Security</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center">
                        <Shield size={20} className="text-gray-400 mr-3" />
                        <div>
                          <h5 className="font-medium text-gray-800">Two-Factor Authentication</h5>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 border border-cyan-500 text-cyan-500 hover:bg-cyan-50 rounded-lg font-medium">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h4 className="text-lg font-medium text-gray-800 mb-4">Saved Payment Methods</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center">
                      <CreditCard size={20} className="text-gray-400 mr-3" />
                      <div>
                        <h5 className="font-medium text-gray-800">•••• •••• •••• 4242</h5>
                        <p className="text-sm text-gray-500">Expires 12/26</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 border border-red-300 text-red-500 hover:bg-red-50 rounded-lg font-medium text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium">
                    Add Payment Method
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={handleLogout}
            className="inline-flex items-center px-6 py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg font-medium"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default Profile;