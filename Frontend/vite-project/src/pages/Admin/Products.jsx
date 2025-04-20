import React, { useEffect, useState } from 'react';
import { Package, Plus, Edit, Trash2, AlertCircle, RefreshCw, X } from 'lucide-react';
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

// New AddProductModal component
const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    imageUrl: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (!formData.name || !formData.price || !formData.stock) {
      setError('Name, price and stock are required');
      return;
    }
    
    // Price validation
    if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      setError('Price must be a positive number');
      return;
    }
    
    // Stock validation
    if (isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
      setError('Stock must be a non-negative number');
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await API.post('/admin/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      });
      onAddProduct(response.data);
      onClose();
      // Reset form
      setFormData({
        name: '',
        price: '',
        stock: '',
        description: '',
        imageUrl: ''
      });
    } catch (err) {
      console.error('Error adding product:', err);
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Product description"
              ></textarea>
            </div>
            
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
            >
              {isSubmitting && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    setIsAddModalOpen(true);
  };

  const handleProductAdded = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
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
      
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleProductAdded}
      />
    </div>
  );
};

export default Products;