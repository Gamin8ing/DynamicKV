import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

// Auth interceptor
API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ===== MOCK SETUP (DEV ONLY) =====
if (import.meta.env.DEV) {
  console.log('[Mock] DEV mode active – setting up mocks')
  const mock = new MockAdapter(API, { delayResponse: 500 })

  // Mock users endpoint
  mock.onGet('/admin/users').reply(() => {
    console.log('[Mock] GET /admin/users')
    return [200, [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
    ]]
  })

  // Mock products endpoint
  mock.onGet('/admin/products').reply(() => {
    console.log('[Mock] GET /admin/products')
    return [200, [
      { _id: '1', name: 'Product A', price: 29.99, stock: 100 },
      { _id: '2', name: 'Product B', price: 49.99, stock: 50 },
      { _id: '3', name: 'Product C', price: 19.99, stock: 200 },
    ]]
  })

  // Mock orders endpoint
  mock.onGet('/admin/orders').reply(() => {
    console.log('[Mock] GET /admin/orders')
    return [200, [
      { _id: '101', customerName: 'Alice Johnson', status: 'Pending', total: 89.99 },
      { _id: '102', customerName: 'Michael Brown', status: 'Processing', total: 59.50 },
      { _id: '103', customerName: 'Sarah Lee', status: 'Shipped', total: 120.00 },
    ]]
  })

  // Existing mocks
  mock.onGet('/admin/stats').reply(() => {
    console.log('[Mock] GET /admin/stats')
    return [200, {
      totalUsers: 1220,
      totalOrders: 450,
      totalRevenue: 95000,
      userGrowth: '+12%',
      orderGrowth: '+8%',
      revenueGrowth: '+15%',
    }]
  })

  mock.onGet(/\/admin\/sales\?period=\d+/).reply(config => {
    console.log('[Mock] GET', config.url)
    return [200, {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      values: [3000,4500,3800,5000,6200,5800,7200],
    }]
  })
}
// ===== END MOCK SETUP =====

export default API