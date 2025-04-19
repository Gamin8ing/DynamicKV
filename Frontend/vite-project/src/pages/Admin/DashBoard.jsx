// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import API from '../../utils/api'

const AdminDashboard = () => {
  // States
  const [stats, setStats] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [months, setMonths] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('7')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    // 1) Stats & Sales
    const statsReq = API.get('/admin/stats')
    const salesReq = API.get(`/admin/sales?period=${selectedPeriod}`)
    // 2) Recent Orders
    const ordersReq = API.get('/admin/recent-orders')
    // 3) Top Products
    const topProdReq = API.get('/admin/top-products')

    Promise.all([statsReq, salesReq, ordersReq, topProdReq])
      .then(([sRes, salesRes, ordRes, prodRes]) => {
        setStats(sRes.data)
        setMonths(salesRes.data.labels)
        setSalesData(salesRes.data.values)
        setRecentOrders(ordRes.data)
        setTopProducts(prodRes.data)
      })
      .catch(err => {
        console.error(err)
        setError('Data load mein problem aayi')
      })
      .finally(() => setLoading(false))
  }, [selectedPeriod])

  if (loading) return <p className="p-6">Loading dashboard...</p>
  if (error)   return <p className="p-6 text-red-500">{error}</p>

  // Prepare chart data
  const chartData = months.map((m, i) => ({ month: m, value: salesData[i] || 0 }))
  // Stat cards config
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users size={24} />,
      change: stats.userGrowth,
      color: '#63D2FF'
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart size={24} />,
      change: stats.orderGrowth,
      color: '#72D3D5'
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue}`,
      icon: <DollarSign size={24} />,
      change: stats.revenueGrowth,
      color: '#BED8D4'
    }
  ]

  // StatCard component
  const StatCard = ({ title, value, icon, change, color }) => {
    const changeColor = change.startsWith('+') ? 'text-green-500' : 'text-red-500'
    return (
      <div
        className="bg-white rounded-xl shadow-sm p-6 border-l-4"
        style={{ borderColor: color }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-500">{title}</div>
          {icon}
        </div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className={`flex items-center text-xs mt-2 ${changeColor}`}>
          <TrendingUp size={14} className={change.startsWith('+') ? '' : 'transform rotate-180'} />
          <span className="ml-1">{change}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* Sales Overview */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className="text-sm border rounded-md px-3 py-1 text-gray-600"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
          </select>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#63D2FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        {recentOrders.length === 0
          ? <p className="text-gray-500">No recent orders.</p>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.status}</td>
                      <td>${o.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Products</h2>
        {topProducts.length === 0
          ? <p className="text-gray-500">No data.</p>
          : (
            <div className="space-y-4">
              {topProducts.map(p => (
                <div key={p.id} className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <img src={p.image} alt={p.name} className="w-8 h-8 object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{p.name}</h4>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: '#63D2FF', width: `${p.percent}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-600 ml-4">
                    {p.percent}%
                  </span>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default AdminDashboard
