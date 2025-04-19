import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft, Search, Filter } from 'lucide-react';

const Wishlist = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock wishlist data
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Premium White Sneakers",
      price: "$99.99",
      image: "/api/placeholder/200/200",
      category: "Footwear",
      inStock: true
    },
    {
      id: 2,
      name: "Classic Denim Jacket",
      price: "$129.50",
      image: "/api/placeholder/200/200",
      category: "Outerwear",
      inStock: true
    },
    {
      id: 3,
      name: "Wireless Noise-Canceling Headphones",
      price: "$249.99",
      image: "/api/placeholder/200/200",
      category: "Electronics",
      inStock: true
    },
    {
      id: 4,
      name: "Vintage Leather Watch",
      price: "$189.00",
      image: "/api/placeholder/200/200",
      category: "Accessories",
      inStock: false
    },
    {
      id: 5,
      name: "Organic Cotton T-Shirt",
      price: "$39.99",
      image: "/api/placeholder/200/200",
      category: "Clothing",
      inStock: true
    },
    {
      id: 6,
      name: "Smart Fitness Tracker",
      price: "$79.95",
      image: "/api/placeholder/200/200",
      category: "Electronics",
      inStock: true
    },
    {
      id: 7,
      name: "Designer Sunglasses",
      price: "$159.00",
      image: "/api/placeholder/200/200",
      category: "Accessories",
      inStock: true
    },
    {
      id: 8,
      name: "Minimalist Ceramic Vase",
      price: "$45.00",
      image: "/api/placeholder/200/200",
      category: "Home Decor",
      inStock: false
    },
    {
      id: 9,
      name: "Premium Yoga Mat",
      price: "$65.99",
      image: "/api/placeholder/200/200",
      category: "Fitness",
      inStock: true
    },
    {
      id: 10,
      name: "Stainless Steel Water Bottle",
      price: "$34.50",
      image: "/api/placeholder/200/200",
      category: "Accessories",
      inStock: true
    },
    {
      id: 11,
      name: "Leather Crossbody Bag",
      price: "$149.99",
      image: "/api/placeholder/200/200",
      category: "Bags",
      inStock: true
    },
    {
      id: 12,
      name: "Scented Soy Candle Set",
      price: "$29.99",
      image: "/api/placeholder/200/200",
      category: "Home Decor",
      inStock: true
    }
  ]);

  // Filter items based on search
  const filteredItems = wishlistItems.filter(item => {
    if (!searchTerm) return true;
    return item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           item.category.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  const moveToCart = (itemId) => {
    // In a real app, this would add the item to cart
    console.log(`Moving item ${itemId} to cart`);
    // Optionally remove from wishlist
    // removeFromWishlist(itemId);
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
          <h2 className="text-3xl font-medium text-gray-800">Your Wishlist</h2>
          <p className="text-gray-500">Items you've saved for later</p>
        </div>

        <div className="bg-white bg-opacity-60 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-white/20">
          {/* Search and filters */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search wishlist items..."
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

          {/* Wishlist items grid */}
          {filteredItems.length > 0 ? (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 relative group">
                    <div className="absolute top-2 right-2 z-10">
                      <button 
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="h-48 bg-gray-100 relative">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      {!item.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-medium px-3 py-1 rounded-full border border-white/30">
                            Out of Stock
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className="text-sm text-cyan-600 font-medium">{item.category}</span>
                      <h4 className="font-medium text-gray-800 mb-1 line-clamp-2">{item.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-gray-800">{item.price}</span>
                        <button 
                          className={`flex items-center text-sm px-3 py-1 rounded-full ${
                            item.inStock 
                              ? 'bg-cyan-500 hover:bg-cyan-600 text-white' 
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!item.inStock}
                          onClick={() => item.inStock && moveToCart(item.id)}
                        >
                          <ShoppingBag size={14} className="mr-1" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Heart size={24} className="text-gray-400" />
              </div>
              <h4 className="mt-4 font-medium text-gray-700">Your wishlist is empty</h4>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm ? 'No items match your search.' : 'Save items for later by clicking the heart icon on products.'}
              </p>
              {!searchTerm && (
                <Link to="/">
                  <button className="mt-4 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium">
                    Browse Products
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile action button for empty state */}
      {wishlistItems.length === 0 && !searchTerm && (
        <div className="fixed bottom-20 right-4 md:right-8">
          <Link to="/">
            <button className="h-12 w-12 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white rounded-full shadow-lg">
              <ShoppingBag size={20} />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;