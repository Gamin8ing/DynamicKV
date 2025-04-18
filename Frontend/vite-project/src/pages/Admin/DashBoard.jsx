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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    userGrowth: '0%',
    orderGrowth: '0%',
    revenueGrowth: '0%',
  })
  const [salesData, setSalesData] = useState([])
  const [months, setMonths] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('7')

  // Fetch stats & sales on mount and when period changes
  useEffect(() => {
    Promise.all([
      API.get('/admin/stats'),
      API.get(`/admin/sales?period=${selectedPeriod}`)
    ])
      .then(([statsRes, salesRes]) => {
        setStats(statsRes.data)
        setMonths(salesRes.data.labels)
        setSalesData(salesRes.data.values)
      })
      .catch(err => console.error('Dashboard data error', err))
  }, [selectedPeriod])

  // Prepare data for Recharts
  const chartData = months.map((month, idx) => ({ month, value: salesData[idx] || 0 }))

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
          {change.startsWith('+') ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingUp
              size={14}
              style={{ transform: 'rotate(180deg)' }}
            />
          )}
          <span className="ml-1">{change}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((card, idx) => (
          <StatCard key={idx} {...card} />
        ))}
      </div>

      {/* Sales Overview with Recharts */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Sales Overview
          </h2>
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
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#63D2FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* You can add Recent Orders & Top Products sections similarly */}
    </div>
  )
}

export default AdminDashboard
