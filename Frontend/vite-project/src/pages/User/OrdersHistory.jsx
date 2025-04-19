import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Search, Filter, Package, Truck, Check, X } from 'lucide-react';

const OrdersHistory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock orders data
  const orders = [
    {
      id: "#3452",
      date: "April 15, 2025",
      status: "Delivered",
      amount: "$129.99",
      items: [
        { id: 1, name: "Premium Shirt", color: "Blue", size: "M", price: "$49.99", image: "/api/placeholder/80/80" },
        { id: 2, name: "Designer Jeans", color: "Black", size: "32", price: "$79.99", image: "/api/placeholder/80/80" }
      ]
    },
    {
      id: "#3451",
      date: "April 12, 2025",
      status: "Processing",
      amount: "$79.50",
      items: [
        { id: 3, name: "Casual Sneakers", color: "White", size: "42", price: "$79.50", image: "/api/placeholder/80/80" }
      ]
    },
    {
      id: "#3447",
      date: "April 8, 2025",
      status: "Shipped",
      amount: "$236.75",
      items: [
        { id: 4, name: "Winter Jacket", color: "Green", size: "L", price: "$159.99", image: "/api/placeholder/80/80" },
        { id: 5, name: "Woolen Scarf", color: "Gray", size: "One Size", price: "$29.99", image: "/api/placeholder/80/80" },
        { id: 6, name: "Leather Gloves", color: "Brown", size: "M", price: "$46.77", image: "/api/placeholder/80/80" }
      ]
    },
    {
      id: "#3442",
      date: "March 30, 2025",
      status: "Delivered",
      amount: "$49.99",
      items: [
        { id: 7, name: "Graphic T-Shirt", color: "Red", size: "S", price: "$24.99", image: "/api/placeholder/80/80" },
        { id: 8, name: "Cotton Shorts", color: "Navy", size: "M", price: "$24.99", image: "/api/placeholder/80/80" }
      ]
    },
    {
      id: "#3438",
      date: "March 22, 2025",
      status: "Delivered",
      amount: "$199.99",
      items: [
        { id: 9, name: "Smart Watch", color: "Black", size: "One Size", price: "$199.99", image: "/api/placeholder/80/80" }
      ]
    },
  ];

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab;
  }).filter(order => {
    if (!searchTerm) return true;
    return order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <Check size={16} className="text-green-500" />;
      case 'shipped':
        return <Truck size={16} className="text-blue-500" />;
      case 'processing':
        return <Package size={16} className="text-yellow-500" />;
      case 'cancelled':
        return <X size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
          <h2 className="text-3xl font-medium text-gray-800">Your Orders</h2>
          <p className="text-gray-500">View and track your purchase history</p>
        </div>

        <div className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-white/20">
          {/* Search and filters */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search orders by ID or product..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <div className="flex items-center">
                <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">
                  <Filter size={16} className="mr-2" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-100">
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'all' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('all')}
            >
              All Orders
            </button>
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'processing' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('processing')}
            >
              Processing
            </button>
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'shipped' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('shipped')}
            >
              Shipped
            </button>
            <button 
              className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === 'delivered' ? 'text-cyan-600 border-b-2 border-cyan-500' : 'text-gray-500'}`}
              onClick={() => setActiveTab('delivered')}
            >
              Delivered
            </button>
          </div>

          {/* Orders list */}
          <div className="divide-y divide-gray-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium text-gray-800">Order {order.id}</h3>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-500 text-sm">{order.date}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                        <span className="ml-4 font-medium">{order.amount}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <button className="flex items-center text-cyan-500 hover:text-cyan-600">
                        <span className="mr-1">View Details</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex overflow-x-auto space-x-4 pb-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex-shrink-0 w-20">
                        <div className="h-20 w-20 rounded-lg bg-gray-100 overflow-hidden">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Package size={24} className="text-gray-400" />
                </div>
                <h4 className="mt-4 font-medium text-gray-700">No orders found</h4>
                <p className="mt-2 text-sm text-gray-500">
                  {searchTerm ? 'Try a different search term or filter.' : 'You haven\'t placed any orders yet.'}
                </p>
                {!searchTerm && (
                  <button className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium">
                    Browse Products
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersHistory;