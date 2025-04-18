// src/pages/Admin/Orders.jsx
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import API from '../../utils/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/admin/orders')
      .then(res => setOrders(res.data))
      .catch(err => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <ShoppingCart size={24} className="text-gray-700 mr-2" />
        <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders to display.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3">{o._id}</td>
                  <td className="py-3">{o.customerName}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-200 text-gray-700">
                      {o.status}
                    </span>
                  </td>
                  <td className="py-3 font-medium">${o.total}</td>
                  <td className="py-3">
                    <button className="text-[#63D2FF] hover:underline text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Orders;
