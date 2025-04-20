import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, ChevronUp, Bell, Moon, Sun, MapPin, Phone, Mail, Compass, Settings, LogOut, Heart } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Profile = () => {
  const { user, logout } = useUser();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Handle scroll to show/hide footer and scroll button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      setShowFooter(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-teal-50'}`}>
      {/* Top navigation bar */}
      <header className={`${isDarkMode ? 'bg-gray-800 bg-opacity-80 backdrop-blur-md border-gray-700' : 'bg-white bg-opacity-70 backdrop-blur-md border-gray-100'} p-4 border-b sticky top-0 z-10`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
              KV
            </div>
            <h1 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Dynamic KV</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        <div className={`max-w-2xl mx-auto ${isDarkMode ? 'bg-gray-800 bg-opacity-60' : 'bg-white bg-opacity-60'} backdrop-blur-md rounded-xl shadow-lg overflow-hidden`}>
          <div className={`p-6 ${isDarkMode ? 'bg-gray-700 bg-opacity-30' : 'bg-blue-50 bg-opacity-30'}`}>
            <div className="text-center mb-4">
              <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white text-2xl font-bold">
                {user?.name?.[0] || 'U'}
              </div>
              <h2 className={`text-2xl font-bold mt-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{user?.name || 'Guest User'}</h2>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{user?.email || 'guest@example.com'}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-700 bg-opacity-50' : 'bg-gray-50'}`}>
              <Link to="/orders">
                <div className={`flex items-center p-4 ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} transition-colors`}>
                  <ShoppingBag size={20} className="mr-3 text-cyan-500" />
                  <div className="flex-1">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>My Orders</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>View your order history</p>
                  </div>
                  <span className="text-cyan-500">→</span>
                </div>
              </Link>

              <Link to="/wishlist">
                <div className={`flex items-center p-4 border-t ${isDarkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-100'} transition-colors`}>
                  <Heart size={20} className="mr-3 text-cyan-500" />
                  <div className="flex-1">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>My Wishlist</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Products you've saved</p>
                  </div>
                  <span className="text-cyan-500">→</span>
                </div>
              </Link>

              <Link to="/settings">
                <div className={`flex items-center p-4 border-t ${isDarkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-100'} transition-colors`}>
                  <Settings size={20} className="mr-3 text-cyan-500" />
                  <div className="flex-1">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Account Settings</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your profile</p>
                  </div>
                  <span className="text-cyan-500">→</span>
                </div>
              </Link>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </main>

      {showFooter && (
        <footer className={`${isDarkMode ? "bg-gray-900 text-white border-gray-800" : "bg-gray-900 text-white"} py-6 px-4 border-t fixed bottom-0 left-0 right-0 z-10 transform transition-transform duration-300 ease-in-out translate-y-0`}>
          <div className="container mx-auto text-center">
            <h4 className="font-medium mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex justify-center items-center"><MapPin size={16} className="mr-2 text-cyan-400" /><span>123 Commerce St, Business City</span></li>
              <li className="flex justify-center items-center"><Phone size={16} className="mr-2 text-cyan-400" /><span>+1 (555) 123-4567</span></li>
              <li className="flex justify-center items-center"><Mail size={16} className="mr-2 text-cyan-400" /><span>support@dynamickv.com</span></li>
            </ul>
            <p className="mt-4 text-xs text-gray-500">© {new Date().getFullYear()} Dynamic KV. All rights reserved.</p>
          </div>
        </footer>
      )}

      <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 bg-opacity-80 border-gray-700' : 'bg-white bg-opacity-80 border-gray-200'} backdrop-blur-md border-t py-2 px-6 z-20`}>
        <div className="flex justify-between max-w-md mx-auto">
          <Link to="/">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-cyan-600' : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('home')}
            >
              <Compass size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>
          </Link>
          <Link to="/orders">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === 'orders' ? 'text-cyan-600' : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={20} />
              <span className="text-xs mt-1">Orders</span>
            </button>
          </Link>
          <Link to="/profile">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-cyan-600' : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={20} />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </Link>
        </div>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-20 right-6 p-3 rounded-full shadow-lg z-30
            ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800'}`}
        >
          <ChevronUp size={20} />
        </button>
      )}
    </div>
  );
};

export default Profile;
