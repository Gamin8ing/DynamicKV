import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import API from '../../utils/api';

const StockIndicator = ({ stock }) => {
  let stockStyle;
  
  if (stock <= 0) {
    stockStyle = "text-red-600 bg-red-50";
  } else if (stock < 10) {
    stockStyle = "text-orange-600 bg-orange-50";
  } else {
    stockStyle = "text-green-600 bg-green-50";
  }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stockStyle}`}>
      {stock <= 0 ? 'Out of stock' : stock < 10 ? 'Low stock' : 'In stock'} ({stock})
    </span>
  );
};

const ProductRow = ({ product, onEdit, onDelete }) => {
  const { _id, name, price, stock, imageUrl } = product;
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-2">
        <div className="flex items-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-10 h-10 mr-3 rounded object-cover"
            />
          ) : (
            <div className="w-10 h-10 mr-3 bg-gray-100 rounded flex items-center justify-center">
              <Package size={18} className="text-gray-400" />
            </div>
          )}
          <span className="font-medium text-gray-800">{name}</span>
        </div>
      </td>
      <td className="py-4 px-2 font-medium">${parseFloat(price).toFixed(2)}</td>
      <td className="py-4 px-2">
        <StockIndicator stock={stock} />
      </td>
      <td className="py-4 px-2">
        <div className="flex space-x-3">
          <button 
            onClick={() => onEdit(product)}
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors" 
            aria-label={`Edit ${name}`}
          >
            <Edit size={16} className="mr-1" />
            <span className="text-xs">Edit</span>
          </button>
          
          <button 
            onClick={() => onDelete(product._id)}
            className="flex items-center text-red-500 hover:text-red-700 transition-colors" 
            aria-label={`Delete ${name}`}
          >
            <Trash2 size={16} className="mr-1" />
            <span className="text-xs">Delete</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      setRefreshing(true);
      const response = await API.get('/admin/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.response?.data?.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    // Implement navigation to add product page or open modal
    console.log('Add product clicked');
  };

  const handleEditProduct = (product) => {
    // Implement edit product functionality
    console.log('Edit product:', product);
  };

  const handleDeleteProduct = (productId) => {
    // Implement delete confirmation and API call
    console.log('Delete product ID:', productId);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-3"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Package size={24} className="text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button 
            onClick={handleAddProduct}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            <span className="text-sm font-medium">Add Product</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {products.length === 0 ? (
          <div className="py-12 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products to display.</p>
            <button 
              onClick={handleAddProduct}
              className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 pt-1 px-2 font-medium">Product</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Price</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Stock</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <ProductRow 
                    key={product._id} 
                    product={product} 
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;