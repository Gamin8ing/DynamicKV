import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {User,ShoppingBag, Bell, Moon, Sun, CreditCard, Compass, ChevronUp, Star, Mail, Phone, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [animatedElements, setAnimatedElements] = useState({
    stats: false,
    testimonials: false,
    featured: false,
    recommended: false,
    items: false
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const statsElement = document.getElementById('stats-section');
      const testimonialsElement = document.getElementById('testimonials-section');
      const featuredElement = document.getElementById('featured-section');
      const recommendedElement = document.getElementById('recommended-section');
      const itemsElement = document.getElementById('items-section');

      const isInViewport = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
      };

      setAnimatedElements({
        stats: isInViewport(statsElement),
        testimonials: isInViewport(testimonialsElement),
        featured: isInViewport(featuredElement),
        recommended: isInViewport(recommendedElement),
        items: isInViewport(itemsElement)
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

  const featuredItems = [
    {
      id: 1,
      title: "Summer Collection",
      description: "Discover our latest arrivals for the season",
      image: "/api/placeholder/1200/600"
    },
    {
      id: 2,
      title: "Special Offers",
      description: "Limited time discounts on premium products",
      image: "/api/placeholder/1200/600"
    },
    {
      id: 3,
      title: "New Arrivals",
      description: "Be the first to explore our newest items",
      image: "/api/placeholder/1200/600"
    }
  ];

  const recentOrders = [
    { id: "#3452", date: "April 15, 2025", status: "Delivered", amount: "$129.99" },
    { id: "#3451", date: "April 12, 2025", status: "Processing", amount: "$79.50" },
    { id: "#3447", date: "April 8, 2025", status: "Shipped", amount: "$236.75" }
  ];

  const stats = [
    { title: "Orders", value: "8", icon: <ShoppingBag size={20} /> },
    { title: "Rewards", value: "320", icon: <CreditCard size={20} /> },
    { title: "Notifications", value: "3", icon: <Bell size={20} /> }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content: "I've been shopping here for months and the quality of products is consistently excellent. Customer service is outstanding too!",
      rating: 5,
      image: "/api/placeholder/100/100"
    },
    {
      id: 2,
      name: "Michael Smith",
      role: "Tech Reviewer",
      content: "Great selection of premium tech gadgets at reasonable prices. The shipping is incredibly fast and the packaging is secure.",
      rating: 5,
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Interior Designer",
      content: "I love the home decor collection! Found exactly what I needed for my latest project, and delivery was prompt and professional.",
      rating: 4,
      image: "/api/placeholder/100/100"
    }
  ];

  const electronicItems = [
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      price: "$99.99",
      originalPrice: "$149.99",
      image: "/api/placeholder/300/200",
      category: "Audio"
    },
    {
      id: 2,
      name: "Smartwatch Ultra",
      price: "$199.00",
      originalPrice: "$249.00",
      image: "/api/placeholder/300/200",
      category: "Wearables"
    },
    {
      id: 3,
      name: "Portable Charger 20,000mAh",
      price: "$49.00",
      image: "/api/placeholder/300/200",
      category: "Accessories"
    }
  ];

  const notifications = [
    { id: 1, title: "Order #3452 delivered", time: "2 hours ago", read: false },
    { id: 2, title: "New arrivals in stock", time: "Yesterday", read: true },
    { id: 3, title: "🔥 Flash sale ending soon!", time: "1 day ago", read: false }
  ];

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
        <div className="mb-8 opacity-0 animate-fade-in">
          <h2 className={`text-3xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Welcome back, Alex</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Here's what's happening with your account today.</p>
        </div>

        <div id="featured-section" className={`rounded-2xl overflow-hidden shadow-lg mb-12 transform transition-all duration-700 ${animatedElements.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            className="carousel-container"
          >
            {featuredItems.map(item => (
              <div key={item.id} className="relative h-64 md:h-80">
                <img src={item.image} alt={item.title} className="object-cover h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-left">
                  <h3 className="text-white text-2xl font-medium mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-white/80 mb-4">{item.description}</p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full w-fit font-medium hover:bg-cyan-50 transition-colors">
                    Explore Now
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div id="items-section" className={`mb-12 transition-all duration-700 ${animatedElements.items ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-2xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Featured Items</h3>
            <button className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">Shop Now</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {electronicItems.map((item, index) => (
              <div
                key={item.id}
                className={`${isDarkMode ? 'bg-gray-800 bg-opacity-60 border-gray-700' : 'bg-white bg-opacity-60 border-white/20'} backdrop-blur-md rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="h-40 bg-gray-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-4 text-center">
                  <span className="text-sm text-cyan-600 font-medium">{item.category}</span>
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1 line-clamp-1`}>{item.name}</h4>
                  <div className="flex justify-center items-center space-x-2">
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.price}</span>
                    {item.originalPrice && (
                      <span className={`text-sm line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="stats-section" className={`grid grid-cols-2 md:grid-cols-3 gap-4 mb-12 transition-all duration-700 ${animatedElements.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${isDarkMode ? 'bg-gray-800 bg-opacity-60 border-gray-700' : 'bg-white bg-opacity-60 border-white/20'} backdrop-blur-md rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-opacity-80 transition-all`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-2 text-cyan-600">
                {stat.icon}
                <span className="ml-2 font-medium">{stat.title}</span>
              </div>
              <p className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800 bg-opacity-60 border-gray-700' : 'bg-white bg-opacity-60 border-white/20'} backdrop-blur-md rounded-xl p-6 shadow-md mb-12`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Recent Orders</h3>
            <Link to="/orders">
              <button className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">View All</button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={isDarkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                  <th className={`text-left py-3 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>Order ID</th>
                  <th className={`text-left py-3 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>Date</th>
                  <th className={`text-left py-3 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>Status</th>
                  <th className={`text-left py-3 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium text-sm`}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className={isDarkMode ? 'border-b border-gray-700 hover:bg-gray-700/50' : 'border-b border-gray-100 hover:bg-gray-50'}>
                    <td className="py-3 px-2 text-sm font-medium text-cyan-600">{order.id}</td>
                    <td className={`py-3 px-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{order.date}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className={`py-3 px-2 text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="testimonials-section" className={`mb-12 transition-all duration-700 ${animatedElements.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-2xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>What Our Customers Say</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`${isDarkMode ? 'bg-gray-800 bg-opacity-60 border-gray-700' : 'bg-white bg-opacity-60 border-white/20'} backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg transition-all`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img src={testimonial.image} alt={testimonial.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{testimonial.name}</h4>
                    <p className={isDarkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <p className={isDarkMode ? 'text-gray-300 italic' : 'text-gray-600 italic'}>{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="recommended-section" className={`mb-12 transition-all duration-700 ${animatedElements.recommended ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-2xl font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} tracking-tight`}>Recommended For You</h3>
            <button className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">View All</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={item}
                className={`${isDarkMode ? 'bg-gray-800 bg-opacity-60 border-gray-700' : 'bg-white bg-opacity-60 border-white/20'} backdrop-blur-md rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-105 transition-all`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="h-40 bg-gray-100">
                  <img src={`/api/placeholder/400/320`} alt="Product image" className="h-full w-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'} mb-1`}>Premium Product {item}</h4>
                  <p className={isDarkMode ? 'text-gray-400 text-sm mb-2' : 'text-gray-500 text-sm mb-2'}>Category</p>
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>$59.99</span>
                    <button className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm px-3 py-1 rounded-full transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-8 text-white mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4 tracking-tight">Stay Updated</h3>
            <p className="mb-6">Subscribe to our newsletter to receive the latest updates on new products and special offers.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-cyan-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
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
          className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all z-20
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
        .carousel-container .control-arrow {
          background: rgba(0, 0, 0, 0.2) !important;
          border-radius: 50%;
          height: 40px;
          width: 40px;
          margin: 0 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        ${isDarkMode ? `
          .shadow-dark {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
          }
        ` : ''}
      `}</style>
    </div>
  );
};

export default Home;
