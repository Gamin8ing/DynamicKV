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
    { _id: '101', customerName: 'Alice Johnson', status: 'Pending', total: 89.99, date: '2025-04-18T09:30:00Z' },
    { _id: '102', customerName: 'Michael Brown', status: 'Processing', total: 59.50, date: '2025-04-17T14:15:00Z' },
    { _id: '103', customerName: 'Sarah Lee', status: 'Shipped', total: 120.00, date: '2025-04-16T11:45:00Z' },
  ])

  // Stats - Updated to not include growth rates as they will be calculated dynamically
  mock.onGet('/admin/stats').reply(200, {
    totalUsers: 1240,
    totalOrders: 450,
    totalRevenue: 95000
    // growth rates removed as they will be calculated from historical data
  })

  // Historical data for trend calculations
  mock.onGet(/\/admin\/historical\?period=\d+/).reply(config => {
    console.log('[Mock] GET', config.url)
    const period = config.url.split('=')[1]
    
    // Generate different data based on period
    let users, orders, revenue
    
    switch(period) {
      case '7':
        users = [1180, 1195, 1205, 1210, 1215, 1218, 1220]
        orders = [430, 435, 438, 440, 442, 445, 450]
        revenue = [92000, 92500, 93000, 93500, 94000, 94500, 95000]
        break
      case '30':
        users = [1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220]
        orders = [400, 410, 415, 420, 425, 435, 445, 450]
        revenue = [85000, 87000, 88500, 90000, 91500, 93000, 94000, 95000]
        break
      case '90':
        users = [950, 1000, 1050, 1100, 1150, 1180, 1220]
        orders = [350, 375, 390, 405, 420, 435, 450]
        revenue = [75000, 80000, 83000, 86000, 89000, 92000, 95000]
        break
      case '180':
        users = [800, 900, 950, 1050, 1100, 1150, 1220]
        orders = [300, 330, 360, 390, 410, 430, 450]
        revenue = [65000, 72000, 78000, 83000, 87000, 91000, 95000]
        break
      case '365':
        users = [600, 700, 800, 900, 1000, 1100, 1220]
        orders = [200, 250, 300, 350, 380, 420, 450]
        revenue = [50000, 60000, 70000, 78000, 85000, 90000, 95000]
        break
      default:
        users = [1180, 1195, 1205, 1210, 1215, 1218, 1220]
        orders = [430, 435, 438, 440, 442, 445, 450]
        revenue = [92000, 92500, 93000, 93500, 94000, 94500, 95000]
    }
    
    return [200, { users, orders, revenue }]
  })

  // Sales with period query - Enhanced to support different periods
  mock.onGet(/\/admin\/sales\?period=\d+/).reply(config => {
    console.log('[Mock] GET', config.url)
    const period = config.url.split('=')[1]
    
    // Different data for different periods
    let labels, values
    
    switch(period) {
      case '7':
        labels = ['Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20']
        values = [3800, 4200, 3900, 4500, 5100, 4800, 5200]
        break
      case '30':
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current']
        values = [15000, 17500, 16800, 18500, 20000]
        break
      case '90':
        labels = ['Feb', 'Mar', 'Apr']
        values = [45000, 52000, 58000]
        break
      case '180':
        labels = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr']
        values = [38000, 42000, 45000, 48000, 52000, 58000]
        break
      case '365':
        labels = ['Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025']
        values = [82000, 88000, 95000, 105000, 116000]
        break
      default:
        labels = ['Apr 14', 'Apr 15', 'Apr 16', 'Apr 17', 'Apr 18', 'Apr 19', 'Apr 20']
        values = [3800, 4200, 3900, 4500, 5100, 4800, 5200]
    }
    
    return [200, { labels, values }]
  })

  // Recent Orders (dashboard) - Updated with dates
  mock.onGet('/admin/recent-orders').reply(200, [
    { id: '201', customer: 'Tom Cruise', status: 'Delivered', amount: 150.00, date: '2025-04-19T15:30:00Z' },
    { id: '202', customer: 'Emma Watson', status: 'Processing', amount: 75.50, date: '2025-04-19T10:45:00Z' },
    { id: '203', customer: 'Chris Evans', status: 'Pending', amount: 120.75, date: '2025-04-18T18:20:00Z' },
    { id: '204', customer: 'Scarlett Johansson', status: 'Processing', amount: 95.25, date: '2025-04-18T14:10:00Z' },
    { id: '205', customer: 'Robert Downey Jr.', status: 'Completed', amount: 210.50, date: '2025-04-17T09:35:00Z' }
  ])

  // Top Products (dashboard) - Updated with proper data
  mock.onGet('/admin/top-products').reply(200, [
    { id: 'p1', name: 'Premium Headphones', image: '/api/placeholder/40/40', percent: 85 },
    { id: 'p2', name: 'Wireless Keyboard', image: '/api/placeholder/40/40', percent: 72 },
    { id: 'p3', name: 'Smart Watch', image: '/api/placeholder/40/40', percent: 63 },
    { id: 'p4', name: 'Bluetooth Speaker', image: '/api/placeholder/40/40', percent: 51 },
    { id: 'p5', name: 'Laptop Stand', image: '/api/placeholder/40/40', percent: 45 }
  ])

  // Notifications list
  mock.onGet('/admin/notifications').reply(200, [
    { id: '301', message: 'New user registered', read: false, date: '2025-04-18T10:00:00Z' },
    { id: '302', message: 'Order #102 processed', read: true, date: '2025-04-17T15:30:00Z' },
    { id: '303', message: 'Server maintenance at midnight', read: false, date: '2025-04-19T08:45:00Z' },
    { id: '304', message: 'Low stock alert: Premium Headphones', read: false, date: '2025-04-19T11:20:00Z' },
    { id: '305', message: 'New feature deployed: Dashboard v2', read: true, date: '2025-04-16T09:15:00Z' }
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
    dashboardRefreshRate: 5, // minutes
    defaultDateRange: '30' // Default time period
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
          { id: 2, action: 'Added "Vue Mastery" to wishlist', date: '2025-04-08T09:15:00Z' },
          { id: 3, action: 'Left a review on "React Handbook"', date: '2025-04-05T18:40:00Z' },
        ]
      }
    ]
  });

  // Handle POST request for adding a new user
  mock.onPost('/admin/users').reply(config => {
    console.log('[Mock] POST /admin/users', JSON.parse(config.data));
    const userData = JSON.parse(config.data);
    
    // Create a new user with random ID
    const newUser = {
      ...userData,
      id: Math.floor(Math.random() * 1000) + 10, // Generate random ID (avoid collision with existing IDs)
      avatarUrl: null // No avatar for new users
    };
    
    return [201, newUser]; // Return 201 Created status with the new user data
  });

  // Handle POST request for adding a new product
  mock.onPost('/admin/products').reply(config => {
    console.log('[Mock] POST /admin/products', JSON.parse(config.data));
    const productData = JSON.parse(config.data);
    
    // Create a new product with random ID
    const newProduct = {
      ...productData,
      _id: Math.random().toString(36).substring(2, 15), // Generate random ID
    };
    
    return [201, newProduct]; // Return 201 Created status with the new product data
  });
}
// ===== END MOCK SETUP =====

export default API