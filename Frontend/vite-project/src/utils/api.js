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

  // Users
  mock.onGet('/admin/users').reply(200, [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com' },
  ])

  // Products
  mock.onGet('/admin/products').reply(200, [
    { _id: '1', name: 'Product A', price: 29.99, stock: 100 },
    { _id: '2', name: 'Product B', price: 49.99, stock: 50 },
    { _id: '3', name: 'Product C', price: 19.99, stock: 200 },
  ])

  // Orders (all orders page)
  mock.onGet('/admin/orders').reply(200, [
    { _id: '101', customerName: 'Alice Johnson', status: 'Pending', total: 89.99 },
    { _id: '102', customerName: 'Michael Brown', status: 'Processing', total: 59.50 },
    { _id: '103', customerName: 'Sarah Lee', status: 'Shipped', total: 120.00 },
  ])

  // Stats
  mock.onGet('/admin/stats').reply(200, {
    totalUsers: 1220,
    totalOrders: 450,
    totalRevenue: 95000,
    userGrowth: '+12%',
    orderGrowth: '+8%',
    revenueGrowth: '+15%',
  })

  // Sales with period query
  mock.onGet(/\/admin\/sales\?period=\d+/).reply(config => {
    console.log('[Mock] GET', config.url)
    return [200, {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul'],
      values: [3000,4500,3800,5000,6200,5800,7200],
    }]
  })

  // Recent Orders (dashboard)
  mock.onGet('/admin/recent-orders').reply(200, [
    { id: '201', customer: 'Tom Cruise', status: 'Delivered', amount: 150.00 },
    { id: '202', customer: 'Emma Watson', status: 'Processing', amount: 75.50 },
    { id: '203', customer: 'Chris Evans', status: 'Pending', amount: 120.75 },
  ])

  // Top Products (dashboard)
  mock.onGet('/admin/top-products').reply(200, [
    { id: 'p1', name: 'Alpha', image: 'https://via.placeholder.com/40', percent: 80 },
    { id: 'p2', name: 'Beta',  image: 'https://via.placeholder.com/40', percent: 60 },
    { id: 'p3', name: 'Gamma', image: 'https://via.placeholder.com/40', percent: 40 },
  ])

  // Notifications list
  mock.onGet('/admin/notifications').reply(200, [
    { id: '301', message: 'New user registered', read: false, date: '2025-04-18T10:00:00Z' },
    { id: '302', message: 'Order #102 processed', read: true, date: '2025-04-17T15:30:00Z' },
    { id: '303', message: 'Server maintenance at midnight', read: false, date: '2025-04-19T08:45:00Z' },
  ])

  // Mark notification as read
  mock.onPost(/\/admin\/notifications\/\d+\/read/).reply(config => {
    console.log('[Mock] POST', config.url)
    return [200]
  })

  // Settings endpoints
  mock.onGet('/admin/settings').reply(200, {
    siteTitle: 'My E‑Commerce',
    notificationsEnabled: true,
    itemsPerPage: 20,
  })

  mock.onPut('/admin/settings').reply(config => {
    const newSettings = JSON.parse(config.data)
    console.log('[Mock] PUT /admin/settings', newSettings)
    return [200, newSettings]
  })

  mock.onGet('/user/profile').reply(() => {
    console.log('[Mock] GET /user/profile');
    return [
      200,
      {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Administrator',
        joinedAt: '2022-01-15T10:30:00Z',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        bio: 'Passionate full‑stack developer with 5+ years building scalable web apps. Coffee addict ☕️ and open‑source contributor.',
        phone: '+1 (555) 123‑4567',
        address: {
          street: '123 Maple Street',
          city: 'Springfield',
          state: 'IL',
          zip: '62704'
        },
        social: {
          twitter: 'johndoe',
          github: 'johndoe',
          linkedin: 'john-doe'
        },
        stats: {
          orders: 34,
          reviews: 12,
          wishlist: 5
        },
        recentActivities: [
          { id: 1, action: 'Placed order #4532', date: '2025-04-10T14:20:00Z' },
          { id: 2, action: 'Added “Vue Mastery” to wishlist', date: '2025-04-08T09:15:00Z' },
          { id: 3, action: 'Left a review on “React Handbook”', date: '2025-04-05T18:40:00Z' },
        ]
      }
    ]
  });
}
// ===== END MOCK SETUP =====

export default API
