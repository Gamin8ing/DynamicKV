import React, { useState, useEffect, useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import { UserContext } from "../../context/UserContext";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import {
  User,
  ShoppingBag,
  Bell,
  Moon,
  Sun,
  CreditCard,
  Compass,
  ChevronUp,
  Star,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// async function getProducts() {
//   const response = await fetch("http://localhost:8008/products");
//   const data = await response.json();
//   console.log(data, " this si daata");
//
//   const featuredItems = Object.values(data).map((item) => ({
//     _id: item._id,
//     name: item.name,
//     description: item.description,
//     imageUrl: item.imageUrl,
//     price: item.price,
//     stock: item.stock,
//   }));
//
//   return featuredItems;
// }

const Home = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [animatedElements, setAnimatedElements] = useState({
    stats: false,
    testimonials: false,
    featured: false,
    recommended: false,
    items: false,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      const statsElement = document.getElementById("stats-section");
      const testimonialsElement = document.getElementById(
        "testimonials-section",
      );
      const featuredElement = document.getElementById("featured-section");
      const recommendedElement = document.getElementById("recommended-section");
      const itemsElement = document.getElementById("items-section");

      const isInViewport = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
          rect.top <=
          (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
      };

      setAnimatedElements({
        stats: isInViewport(statsElement),
        testimonials: isInViewport(testimonialsElement),
        featured: isInViewport(featuredElement),
        recommended: isInViewport(recommendedElement),
        items: isInViewport(itemsElement),
      });
    };

    window.addEventListener("scroll", handleScroll);
    setTimeout(handleScroll, 300);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Replace getProducts with your actual fetch function if needed
    async function fetchProducts() {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();

      const featuredItems = Object.values(data).map((item) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        price: item.price,
        stock: item.stock,
      }));
      setProducts(Object.values(featuredItems));
    }
    fetchProducts();
  }, []);

  // Get first 7 entries for featured items
  const featuredItems = products.slice(0, 7);

  // Get last 3 entries for electronic items
  const electronicItems = products.slice(-3);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      content:
        "I've been shopping here for months and the quality of products is consistently excellent. Customer service is outstanding too!",
      rating: 5,
      image: "https://i.insider.com/5a8d9be342e1cc61d436df7f?width=700",
    },
    {
      id: 2,
      name: "Michael Smith",
      role: "Tech Reviewer",
      content:
        "Great selection of premium tech gadgets at reasonable prices. The shipping is incredibly fast and the packaging is secure.",
      rating: 5,
      image:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    },
    {
      id: 3,
      name: "Emma Davis",
      role: "Interior Designer",
      content:
        "I love the home decor collection! Found exactly what I needed for my latest project, and delivery was prompt and professional.",
      rating: 4,
      image:
        "https://media.istockphoto.com/id/1399395748/photo/cheerful-business-woman-with-glasses-posing-with-her-hands-under-her-face-showing-her-smile.jpg?s=612x612&w=0&k=20&c=EbnuxLE-RJP9a08h2zjfgKUSFqmjGubk0p6zwJHnbrI=",
    },
  ];

  // const electronicItems = [
  //   {
  //     id: 1,
  //     name: "Wireless Earbuds Pro",
  //     price: "$99.99",
  //     originalPrice: "$149.99",
  //     image: "/api/placeholder/300/200",
  //     category: "Audio",
  //   },
  //   {
  //     id: 2,
  //     name: "Smartwatch Ultra",
  //     price: "$199.00",
  //     originalPrice: "$249.00",
  //     image: "/api/placeholder/300/200",
  //     category: "Wearables",
  //   },
  //   {
  //     id: 3,
  //     name: "Portable Charger 20,000mAh",
  //     price: "$49.00",
  //     image: "/api/placeholder/300/200",
  //     category: "Accessories",
  //   },
  // ];

  const notifications = [
    { id: 1, title: "Order #3452 delivered", time: "2 hours ago", read: false },
    { id: 2, title: "New arrivals in stock", time: "Yesterday", read: true },
    {
      id: 3,
      title: "🔥 Flash sale ending soon!",
      time: "1 day ago",
      read: false,
    },
  ];

  return (
    <div
      className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50 to-teal-50"}`}
    >
      {/* Top navigation bar */}
      <header
        className={`${isDarkMode ? "bg-gray-800 bg-opacity-80 backdrop-blur-md border-gray-700" : "bg-white bg-opacity-70 backdrop-blur-md border-gray-100"} p-4 border-b sticky top-0 z-10`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
              KV
            </div>
            <h1
              className={`text-xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"} tracking-tight`}
            >
              Dynamic KV
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                className={`p-2 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
                onClick={toggleNotifications}
              >
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div
                  className={`absolute right-0 mt-2 w-72 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border shadow-lg rounded-lg overflow-hidden z-20`}
                >
                  <div className="flex justify-between items-center p-3 border-b border-gray-200">
                    <h3
                      className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      Notifications
                    </h3>
                    <button onClick={toggleNotifications}>
                      <X
                        size={16}
                        className={
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }
                      />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b ${isDarkMode ? "border-gray-700 hover:bg-gray-700/50" : "border-gray-100 hover:bg-gray-50"} ${!notification.read ? (isDarkMode ? "bg-gray-700/50" : "bg-blue-50") : ""}`}
                      >
                        <div className="flex justify-between">
                          <h4
                            className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center">
                    <button className="text-cyan-500 text-sm font-medium hover:underline">
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              className={`p-2 ${isDarkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
              onClick={toggleDarkMode}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>{" "}
            {user == null ? (
              <>
                <Link to="/login">
                  <button className="bg-gradient-to-r from-cyan-400 to-blue-400  text-gray-900 px-6 py-2 rounded-full w-fit text-white font-medium hover:bg-cyan-50 transition-colors">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="bg-gradient-to-r from-cyan-400 to-blue-400  text-gray-900 px-6 py-2 rounded-full w-fit text-white font-medium hover:bg-cyan-50 transition-colors">
                    Signup
                  </button>
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 opacity-0 animate-fade-in">
          <h2
            className={`text-3xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"} tracking-tight`}
          >
            Welcome back, {user == null ? "Guest" : user.username}
          </h2>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
            Here's what's happening with your account today.
          </p>
        </div>

        <div
          id="featured-section"
          className={`rounded-2xl overflow-hidden shadow-lg mb-12 transform transition-all duration-700 ${animatedElements.featured ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            className="carousel-container"
          >
            {featuredItems.map((item) => (
              <div key={item._id} className="relative h-64 md:h-80">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="object-cover h-full w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6 text-left">
                  <h3 className="text-white text-2xl font-medium mb-2 tracking-tight">
                    {item.name}
                  </h3>
                  <p className="text-white/80 mb-4">{item.description}</p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full w-fit font-medium hover:bg-cyan-50 transition-colors">
                    Explore Now
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        <div
          id="items-section"
          className={`mb-12 transition-all duration-700 ${animatedElements.items ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className={`text-2xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"} tracking-tight`}
            >
              Featured Items
            </h3>
            <button className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">
              Shop Now
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {electronicItems.map((item, index) => (
              <div
                key={item._id}
                className={`${isDarkMode ? "bg-gray-800 bg-opacity-60 border-gray-700" : "bg-white bg-opacity-60 border-white/20"} backdrop-blur-md rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="h-40 bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="text-sm text-cyan-600 font-medium">
                    category
                  </span>
                  <h4
                    className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"} mb-1 line-clamp-1`}
                  >
                    {item.name}
                  </h4>
                  <div className="flex justify-center items-center space-x-2">
                    <span
                      className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {item.price}
                    </span>
                    {item.price && (
                      <span
                        className={`text-sm line-through ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {(item.price + 23.0).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          id="testimonials-section"
          className={`mb-12 transition-all duration-700 ${animatedElements.testimonials ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-2xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"} tracking-tight`}
            >
              What Our Customers Say
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`${isDarkMode ? "bg-gray-800 bg-opacity-60 border-gray-700" : "bg-white bg-opacity-60 border-white/20"} backdrop-blur-md rounded-xl p-6 shadow-md hover:shadow-lg transition-all`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4
                      className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {testimonial.name}
                    </h4>
                    <p
                      className={
                        isDarkMode
                          ? "text-gray-400 text-sm"
                          : "text-gray-500 text-sm"
                      }
                    >
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={
                        i < testimonial.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p
                  className={
                    isDarkMode ? "text-gray-300 italic" : "text-gray-600 italic"
                  }
                >
                  {testimonial.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div
          id="recommended-section"
          className={`mb-12 transition-all duration-700 ${animatedElements.recommended ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="flex justify-between items-center mb-6">
            <h3
              className={`text-2xl font-medium ${isDarkMode ? "text-white" : "text-gray-800"} tracking-tight`}
            >
              Recommended For You
            </h3>
            <button className="text-cyan-500 hover:text-cyan-600 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, index) => (
              <div
                key={item._id}
                className={`${isDarkMode ? "bg-gray-800 bg-opacity-60 border-gray-700" : "bg-white bg-opacity-60 border-white/20"} backdrop-blur-md rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:scale-105 transition-all`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="h-40 bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt="Product image"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h4
                    className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"} mb-1`}
                  >
                    {item.name}
                  </h4>
                  <p
                    className={
                      isDarkMode
                        ? "text-gray-400 text-sm mb-2"
                        : "text-gray-500 text-sm mb-2"
                    }
                  >
                    Category
                  </p>
                  <div className="flex justify-between items-center">
                    <span
                      className={`font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
                    >
                      {item.price}
                    </span>
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
            <h3 className="text-2xl font-bold mb-4 tracking-tight">
              Stay Updated
            </h3>
            <p className="mb-6">
              Subscribe to our newsletter to receive the latest updates on new
              products and special offers.
            </p>
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

      <footer
        className={
          isDarkMode
            ? "bg-gray-900 text-white py-8 px-4 border-t border-gray-800"
            : "bg-gray-900 text-white py-8 px-4"
        }
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  KV
                </div>
                <h1 className="text-xl font-medium">Dynamic KV</h1>
              </div>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for premium products at competitive
                prices.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Categories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Returns & Refunds
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Contact Info</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center">
                  <MapPin size={16} className="mr-2 text-cyan-400" />
                  <span>123 Commerce St, Business City</span>
                </li>
                <li className="flex items-center">
                  <Phone size={16} className="mr-2 text-cyan-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Mail size={16} className="mr-2 text-cyan-400" />
                  <span>support@dynamickv.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} Dynamic KV. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <div
        className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? "bg-gray-800 bg-opacity-80 border-gray-700" : "bg-white bg-opacity-80 border-gray-200"} backdrop-blur-md border-t py-2 px-6 z-10`}
      >
        <div className="flex justify-between max-w-md mx-auto">
          <Link to="/">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === "dashboard" ? "text-cyan-600" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <Compass size={20} />
              <span className="text-xs mt-1">Home</span>
            </button>
          </Link>
          <Link to="/orders">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === "orders" ? "text-cyan-600" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              onClick={() => setActiveTab("orders")}
            >
              <ShoppingBag size={20} />
              <span className="text-xs mt-1">Orders</span>
            </button>
          </Link>
          <Link to="/profile">
            <button
              className={`flex flex-col items-center p-2 ${activeTab === "profile" ? "text-cyan-600" : isDarkMode ? "text-gray-400" : "text-gray-500"}`}
              onClick={() => setActiveTab("profile")}
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
            ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-white hover:bg-gray-100 text-gray-800"}`}
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
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
        ${isDarkMode
          ? `
          .shadow-dark {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
          }
        `
          : ""}
      `}</style>
    </div>
  );
};

export default Home;
