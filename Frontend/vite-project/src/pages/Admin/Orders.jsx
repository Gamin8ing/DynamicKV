import React, { useEffect, useState } from 'react';
import { ShoppingCart, RefreshCw, AlertCircle } from 'lucide-react';
import API from '../../utils/api';

const OrderStatus = ({ status }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-green-100 text-green-800",
    delivered: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
  };
  
  // Default to a neutral style if status isn't in our mapping
  const style = statusStyles[status.toLowerCase()] || "bg-gray-200 text-gray-700";
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {status}
    </span>
  );
};

const OrderRow = ({ order, onViewOrder }) => {
  const { _id, customerName, status, total } = order;
  
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-2">{_id}</td>
      <td className="py-4 px-2">{customerName}</td>
      <td className="py-4 px-2">
        <OrderStatus status={status} />
      </td>
      <td className="py-4 px-2 font-medium">${total.toFixed(2)}</td>
      <td className="py-4 px-2">
        <button 
          onClick={() => onViewOrder(order)}
          className="text-blue-500 hover:text-blue-700 hover:underline text-sm font-medium transition-colors" 
          aria-label={`View order ${_id}`}
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const response = await API.get('/admin/orders');
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.response?.data?.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {
    // Implement navigation or modal display logic here
    console.log('Viewing order:', order);
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchOrders();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-3"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <ShoppingCart size={24} className="text-blue-600 mr-3" />
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <ShoppingCart size={40} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders to display.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 pt-1 px-2 font-medium">Order ID</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Customer</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Status</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Total</th>
                  <th className="pb-3 pt-1 px-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <OrderRow 
                    key={order._id} 
                    order={order} 
                    onViewOrder={handleViewOrder}
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

export default Orders;