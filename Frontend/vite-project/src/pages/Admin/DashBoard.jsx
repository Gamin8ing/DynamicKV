import React, { useState } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const salesData = [4000, 3000, 5000, 2780, 1890, 2390, 3490];
  const maxSales = Math.max(...salesData);

  const statCards = [
    { title: 'Total Users', value: '1,250', icon: <Users size={24} />, change: '+12%', color: '#63D2FF' },
    { title: 'Orders', value: '540', icon: <ShoppingCart size={24} />, change: '+5%', color: '#72D3D5' },
    { title: 'Revenue', value: '$21,300', icon: <DollarSign size={24} />, change: '+8%', color: '#BED8D4' },
  ];

  const StatCard = ({ title, value, icon, change, color }) => {
    const changeColor = change.startsWith('+') ? '#22c55e' : '#ef4444';
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border-l-4" style={{ borderColor: color }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            <div className="flex items-center mt-2 text-xs font-medium">
              <span style={{ color: changeColor }}>
                <TrendingUp size={14} className="mr-1 inline" />
                {change}
              </span>
              <span className="text-gray-500 ml-1">this month</span>
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: `${color}20` }}>
            {icon}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="text-sm border rounded-md px-3 py-1 text-gray-600"
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>

        <div className="h-64 flex items-end space-x-4 p-4 border-b border-l border-gray-200">
          {salesData.map((value, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-[#63D2FF] rounded-t-sm transition-all hover:bg-[#72D3D5]"
                style={{ height: `${(value / maxSales) * 100}%` }}
              />
              <div className="text-xs text-gray-600 mt-2">{months[index]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'ORD-5293', name: 'John Smith', status: 'Delivered', amount: '$125.00', bg: 'green' },
                  { id: 'ORD-5294', name: 'Lisa Wang', status: 'Processing', amount: '$243.85', bg: 'blue' },
                  { id: 'ORD-5295', name: 'Michael Johnson', status: 'Pending', amount: '$78.50', bg: 'yellow' },
                ].map((order, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3">#{order.id}</td>
                    <td className="py-3">{order.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs bg-${order.bg}-100 text-${order.bg}-800`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 font-medium">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h2>
          <div className="space-y-4">
            {[
              { name: 'Product Alpha', color: '#63D2FF', percent: 75 },
              { name: 'Product Beta', color: '#72D3D5', percent: 50 },
              { name: 'Product Gamma', color: '#BED8D4', percent: 25 },
            ].map((prod, i) => (
              <div key={i} className="flex items-center">
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                  <Package size={20} className="text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{prod.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <div className="bg-gray-200 h-2 rounded-full w-full max-w-xs">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          backgroundColor: prod.color,
                          width: `${prod.percent}%`
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 ml-4">{prod.percent}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
