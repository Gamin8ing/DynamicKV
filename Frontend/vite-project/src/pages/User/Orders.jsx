import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronUp, User, Bell, Moon, Sun, MapPin, Phone, Mail, X, Compass, Package, Clock, ArrowLeft } from 'lucide-react';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [animatedElements, setAnimatedElements] = useState({
    ordersList: false,
    summary: false
  });
  const navigate = useNavigate();

  // Mock orders (replace with actual data)
  const orderItems = [
    {
      id: "#3452",
      date: "April 15, 2025",
      status: "Delivered",
      amount: "$129.99",
      items: [
        { id: 1, name: 'Wireless Earbuds Pro', price: '$99.99', image: '/api/placeholder/300/200', quantity: 1 },
        { id: 4, name: 'USB-C Charging Cable', price: '$19.99', image: '/api/placeholder/300/200', quantity: 1 }
      ]
    },
    {
      id: "#3451",
      date: "April 12, 2025",
      status: "Processing",
      amount: "$79.50",
      items: [
        { id: 2, name: 'Smartwatch Ultra', price: '$79.50', image: '/api/placeholder/300/200', quantity: 1 }
      ]
    },
    {
      id: "#3447",
      date: "April 8, 2025",
      status: "Shipped",
      amount: "$236.75",
      items: [
        { id: 3, name: 'Portable Charger 20,000mAh', price: '$49.00', image: '/api/placeholder/300/200', quantity: 1 },
        { id: 5, name: 'Smart Home Hub', price: '$187.75', image: '/api/placeholder/300/200', quantity: 1 }
      ]
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const ordersListElement = document.getElementById('orders-list-section');
      const summaryElement = document.getElementById('summary-section');

      const isInViewport = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
      };

      setAnimatedElements({
        ordersList: isInViewport(ordersListElement),
        summary: isInViewport(summaryElement)
      });
    };

    window.addEventListener('scroll', handleScroll);
    setTimeout(handleScroll, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const notifications = [
    { id: 1, title: "Order #3452 delivered", time: "2 hours ago", read: false },
    { id: 2, title: "New arrivals in stock", time: "Yesterday", read: true },
    { id: 3, title: "🔥 Flash sale ending soon!", time: "1 day ago", read: false }
  ];

  const getStatusClass = (status) => {
    switch(status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
            <div className="relative">
              <button
                className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={toggleNotifications}
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-72 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg rounded-lg overflow-hidden z-20`}>
                  <div className="flex justify-between items-center p-3 border-b border-gray-200">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                    <button onClick={toggleNotifications}>
                      <X size={16} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'} ${!notification.read ? (isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50') : ''}`}
                      >
                        <div className="flex justify-between">
                          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{notification.title}</h4>
                          {!notification.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                        </div>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center">
                    <button className="text-cyan-500 text-sm font-medium hover:underline">Mark all as read</button>
                  </div>
                </div>
              )}
            </div>
            <button
              className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/profile">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={18} className="text-blue-600" />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-8 opacity-0 animate-fade-in">
          <button
            onClick={() => navigate('/')}
            className={`mr-4 p-2 rounded-full ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-sm`}
          >
            <ArrowLeft size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
          </button>
          <div>
            <h2 className={`text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Your Orders</h2>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Track and manage your orders</p>
          </div>
        </div>

        <div id="orders-list-section" className={`mb-12 transition-all duration-700 ${animatedElements.ordersList ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {orderItems.length === 0 ? (
            <div className={`flex flex-col items-center justify-center p-10 ${isDarkMode ? 'bg-gray-800 bg-opacity-60' : 'bg-white bg-opacity-60'} backdrop-blur-md rounded-xl shadow-md text-center`}>
              <Package size={48} className={isDarkMode ? 'text-gray-400 mb-4' : 'text-gray-500 mb-4'} />
              <h3 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-2`}>No orders yet</h3>
              <p className={isDarkMode ? 'text-gray-400 mb-6' : 'text-gray-500 mb-6'}>Start shopping to see your orders here</p>
              <Link to="/">
                <button className="bg-cyan-500 text-white px-6 py-2 rounded-full hover:bg-cyan-600 transition-colors">
                  Browse Products
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orderItems.map((order, index) => (
                <div
                  key={order.id}
                  className={`${isDarkMode ? 'bg-gray-800 bg-opacity-60 border-gray-700' : 'bg-white bg-opacity-60 border-white/20'} backdrop-blur-md rounded-xl overflow-hidden shadow-md transition-all`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex items-start sm:items-center mb-3 sm:mb-0">
                      <div className={`mr-4 p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <Clock size={20} className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'} />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Order {order.id}</h3>
                          <span className={`ml-3 px-2 py-1 text-xs rounded-full ${getStatusClass(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{order.amount}</span>
                      <button className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">Details</button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Items in this order:</h4>
                    <div className="space-y-4">
                      {order.items.map(item => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                          <div className="flex-1">
                            <h5 className={`font-medium text-base ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</h5>
                            <div className="flex items-center justify-between mt-1">
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.quantity}</span>
                              <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.price}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="summary-section" className={`mb-12 transition-all duration-700 ${animatedElements.summary ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className={`${isDarkMode ? 'bg-gray-800 bg-opacity-60 border-gray-700' : 'bg-white bg-opacity-60 border-white/20'} backdrop-blur-md rounded-xl p-6 shadow-md`}>
            <h3 className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Need Help?</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              If you have any questions about your orders or need assistance, our customer service team is here to help.
            </p>
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-full hover:bg-cyan-600 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </main>

      <footer className={isDarkMode ? "bg-gray-900 text-white py-8 px-4 border-t border-gray-800" : "bg-gray-900 text-white py-8 px-4"}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  KV
                </div>
                <h1 className="text-xl font-medium">Dynamic KV</h1>
              </div>
              <p className="text-gray-400 text-sm">Your one-stop destination for premium products at competitive prices.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns & Refunds</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center"><MapPin size={16} className="mr-2 text-cyan-400" /><span>123 Commerce St, Business City</span></li>
                <li className="flex items-center"><Phone size={16} className="mr-2 text-cyan-400" /><span>+1 (555) 123-4567</span></li>
                <li className="flex items-center"><Mail size={16} className="mr-2 text-cyan-400" /><span>support@dynamickv.com</span></li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Dynamic KV. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800 bg-opacity-80 border-gray-700' : 'bg-white bg-opacity-80 border-gray-200'} backdrop-blur-md border-t py-2 px-6 z-10`}>
        <div className="flex justify-between max-w-md mx-auto">
          <Link to="/">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === 'dashboard' ? 'text-cyan-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Compass size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>
          </Link>
          <Link to="/orders">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === 'orders' ? 'text-cyan-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={20} />
              <span className="text-xs mt-1">Orders</span>
            </button>
          </Link>
          <Link to="/profile">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-cyan-600' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
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
          className={`fixed bottom-20 right-6 p-3 rounded-full shadow-lg transition-all z-20
            ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800'}`}
        >
          <ChevronUp size={20} />
        </button>
      )}

      <style jsx global>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Orders;
