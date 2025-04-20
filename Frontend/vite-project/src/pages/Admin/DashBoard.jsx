// src/pages/Admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react'
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  ChevronRight,
  Package,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line
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
  const [historicalData, setHistoricalData] = useState({
    users: [],
    orders: [],
    revenue: []
  })
  const [availablePeriods, setAvailablePeriods] = useState([
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 3 months' },
    { value: '180', label: 'Last 6 months' },
    { value: '365', label: 'Last year' }
  ])

  const calculateTrends = (data) => {
    if (!data || data.length < 2) return '0%';
    
    const current = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    
    const percentChange = ((current - previous) / previous) * 100;
    return (percentChange >= 0 ? '+' : '') + percentChange.toFixed(1) + '%';
  };

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
    // 4) Historical Data for trends
    const historicalReq = API.get(`/admin/historical?period=${selectedPeriod}`)

    Promise.all([statsReq, salesReq, ordersReq, topProdReq, historicalReq])
      .then(([sRes, salesRes, ordRes, prodRes, histRes]) => {
        setStats(sRes.data)
        setMonths(salesRes.data.labels)
        setSalesData(salesRes.data.values)
        setRecentOrders(ordRes.data)
        setTopProducts(prodRes.data)
        
        // Set historical data
        setHistoricalData(histRes.data)
        
        // Calculate trends based on historical data
        if (histRes.data) {
          const userTrend = calculateTrends(histRes.data.users);
          const orderTrend = calculateTrends(histRes.data.orders);
          const revenueTrend = calculateTrends(histRes.data.revenue);
          
          // Update stats with calculated trends
          setStats(prev => ({
            ...prev,
            userGrowth: userTrend,
            orderGrowth: orderTrend,
            revenueGrowth: revenueTrend
          }));
        }
      })
      .catch(err => {
        console.error(err)
        setError('Data load mein problem aayi')
      })
      .finally(() => setLoading(false))
  }, [selectedPeriod])

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const chartData = months.map((m, i) => ({ month: m, value: salesData[i] || 0 }))
  
  // Stat cards config
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <Users size={24} />,
      change: stats.userGrowth,
      color: 'blue',
      data: historicalData.users
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: <ShoppingCart size={24} />,
      change: stats.orderGrowth,
      color: 'green',
      data: historicalData.orders
    },
    {
      title: 'Revenue',
      value: `$${stats.totalRevenue}`,
      icon: <DollarSign size={24} />,
      change: stats.revenueGrowth,
      color: 'purple',
      data: historicalData.revenue
    }
  ]

  // StatCard component
  const StatCard = ({ title, value, icon, change, color, data }) => {
    const isPositive = change && change.startsWith('+')
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
    
    // Color mapping
    const colorStyles = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        icon: 'bg-blue-100',
        line: '#3B82F6'
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        icon: 'bg-green-100',
        line: '#10B981'
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        icon: 'bg-purple-100',
        line: '#8B5CF6'
      }
    }

    const style = colorStyles[color]
    
    // Prepare mini chart data
    const miniChartData = data ? data.map((value, index) => ({
      value,
      index
    })) : [];

    return (
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-lg ${style.icon} flex items-center justify-center mr-3`}>
              <span className={style.text}>{icon}</span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500">{title}</div>
              <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${isPositive ? 'bg-green-100' : 'bg-red-100'} ${changeColor}`}>
            {isPositive ? (
              <ArrowUp size={14} />
            ) : (
              <ArrowDown size={14} />
            )}
            <span className="ml-1">{change}</span>
          </div>
        </div>
        
        {/* Mini trend chart */}
        {miniChartData.length > 1 && (
          <div className="h-12 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={miniChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={style.line} 
                  strokeWidth={2} 
                  dot={false} 
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    )
  }

  // Order status badge
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      'completed': 'bg-green-100 text-green-800',
      'processing': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'cancelled': 'bg-red-100 text-red-800'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>

        {/* Time Period Selector */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-2" />
            <span>Quick filter:</span>
          </div>
          <div className="flex space-x-2">
            {availablePeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  selectedPeriod === period.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((c, i) => <StatCard key={i} {...c} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Sales Overview</h2>
              <div className="text-sm font-medium text-gray-600">
                {selectedPeriod === '7' ? 'Last 7 days' : 
                 selectedPeriod === '30' ? 'Last 30 days' :
                 selectedPeriod === '90' ? 'Last 3 months' :
                 selectedPeriod === '180' ? 'Last 6 months' : 'Last year'}
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(236, 242, 255, 0.4)' }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#3B82F6" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Top Products</h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
                View All <ChevronRight size={16} />
              </button>
            </div>
            {topProducts.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Package size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500">No product data available</p>
              </div>
            ) : (
              <div className="space-y-5">
                {topProducts.map(p => (
                  <div key={p.id} className="flex items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden border border-gray-200">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{p.name}</h4>
                        <span className="text-xs font-medium text-gray-600">
                          {p.percent}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full mt-2">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${p.percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm mt-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center">
              View All <ChevronRight size={16} />
            </button>
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No recent orders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 font-medium">#{o.id}</td>
                      <td className="py-3">{o.customer}</td>
                      <td className="py-3">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="py-3 font-medium">${o.amount}</td>
                      <td className="py-3 text-gray-500">{o.date || 'N/A'}</td>
                      <td className="py-3 text-right">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard