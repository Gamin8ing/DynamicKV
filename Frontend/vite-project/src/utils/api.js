// File: Frontend/vite-project/src/utils/api.js (Updated)
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Create real API instance that connects to our Express backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/",
});

// Auth interceptor
API.interceptors.request.use((cfg) => {
  const userData = localStorage.getItem("dynamicKV_user");
  if (userData) {
    const user = JSON.parse(userData);
    if (user?.token) cfg.headers.Authorization = `Bearer ${user.token}`;
  }
  return cfg;
});

// Response interceptor for handling 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear user data on authentication error
      localStorage.removeItem("dynamicKV_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Mock data for /admin/products
const mockProducts = [
  {
    _id: "1",
    name: "Wireless Mouse",
    price: 29.99,
    stock: 15,
    imageUrl: "",
    description: "Ergonomic wireless mouse with adjustable DPI.",
  },
  {
    _id: "2",
    name: "Mechanical Keyboard",
    price: 89.99,
    stock: 8,
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/3-Tasten-Maus_Microsoft.jpg/640px-3-Tasten-Maus_Microsoft.jpg",
    description: "RGB backlit mechanical keyboard with blue switches.",
  },
  {
    _id: "3",
    name: "USB-C Hub",
    price: 39.99,
    stock: 0,
    imageUrl: "https://example.com/images/usb-c-hub.jpg",
    description: "Multi-port USB-C hub with HDMI and Ethernet.",
  },
  {
    _id: "4",
    name: "Noise-Cancelling Headphones",
    price: 129.99,
    stock: 3,
    imageUrl: "",
    description: "Over-ear headphones with active noise cancellation.",
  },
  {
    _id: "5",
    name: "Portable SSD 1TB",
    price: 149.99,
    stock: 20,
    imageUrl: "https://example.com/images/portable-ssd.jpg",
    description: "High-speed portable SSD with 1TB storage.",
  },
];

// API Functions
export const authAPI = {
  login: async (username, password) => {
    const response = await API.post("/login", { username, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await API.post("/signup", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await API.get("me");
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await API.get("/users/profile");
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await API.put("/users/profile", userData);
    return response.data;
  },
};

export const productAPI = {
  getAll: async () => {
    const response = await API.get("/products");
    return response.data;
  },
  getById: async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },
  search: async (query) => {
    const response = await API.get(
      `/products/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },
  getByPriceRange: async (min, max) => {
    const response = await API.get(`/products/price/${min}/${max}`);
    return response.data;
  },
};

export const adminAPI = {
  getUsers: async () => {
    const response = await API.get("/admin/users");
    return response.data;
  },
  createUser: async (userData) => {
    const response = await API.post("/admin/users", userData);
    return response.data;
  },
  updateUser: async (id, userData) => {
    const response = await API.put(`/admin/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await API.delete(`/admin/users/${id}`);
    return response.data;
  },
  getProducts: async () => {
    const response = await API.get("/admin/products");
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await API.post("/admin/products", productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await API.put(`/admin/products/${id}`, productData);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await API.delete(`/admin/products/${id}`);
    return response.data;
  },
  // getTopProducts: async (limit = 5) => {
  //   const response = await API.get(`/admin/products/top?limit=${limit}`);
  //   return response.data;
  // },
  getStats: async () => {
    const response = await API.get("/admin/stats");
    return response.data;
  },
  getHistoricalData: async (period = 7) => {
    const response = await API.get(`/admin/stats/historical?period=${period}`);
    return response.data;
  },
  getSalesData: async (period = 7) => {
    const response = await API.get(`/admin/stats/sales?period=${period}`);
    return response.data;
  },
  getRecentOrders: async () => {
    const response = await API.get("/admin/stats/recent-orders");
    return response.data;
  },
};

// For development, keep the mock adapter for features that aren't implemented yet
if (import.meta.env.DEV) {
  console.log(
    "[Mock] DEV mode active – setting up mocks for incomplete features",
  );
  const mock = new MockAdapter(API, {
    delayResponse: 500,
    onNoMatch: "passthrough",
  });

  // Mock for /admin/products GET
  mock.onGet("/admin/products").reply(200, mockProducts);

  // Mock for /admin/products POST
  mock.onPost("/admin/products").reply((config) => {
    const productData = JSON.parse(config.data);
    const newProduct = {
      _id: `p${mockProducts.length + 1}`,
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      imageUrl: productData.imageUrl || "",
      description: productData.description || "",
    };
    mockProducts.push(newProduct); // Persist new product in mock data
    console.log("[Mock] Created new product:", newProduct);
    return [201, newProduct];
  });

  // // Existing mock endpoints
  // mock.onGet("/admin/users").reply(200, [
  //   {
  //     id: "u1",
  //     name: "John Doe",
  //     email: "john@example.com",
  //     role: "admin",
  //     avatarUrl: "/api/placeholder/48/48",
  //   },
  //   {
  //     id: "u2",
  //     name: "Jane Smith",
  //     email: "jane@example.com",
  //     role: "manager",
  //     avatarUrl: "/api/placeholder/48/48",
  //   },
  //   {
  //     id: "u3",
  //     name: "Michael Johnson",
  //     email: "michael@example.com",
  //     role: "user",
  //     avatarUrl: null,
  //   },
  //   {
  //     id: "u4",
  //     name: "Sarah Williams",
  //     email: "sarah@example.com",
  //     role: "user",
  //     avatarUrl: null,
  //   },
  // ]);

  mock.onPost("/admin/users").reply((config) => {
    const userData = JSON.parse(config.data);
    const newUser = {
      id: `u${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      avatarUrl: null,
    };
    console.log("[Mock] Created new user:", newUser);
    return [201, newUser];
  });

  mock.onPut(/\/admin\/users\/\w+/).reply((config) => {
    const userId = config.url.split("/").pop();
    const userData = JSON.parse(config.data);
    console.log(`[Mock] Updated user ${userId}:`, userData);
    return [200, { ...userData, id: userId }];
  });

  mock.onDelete(/\/admin\/users\/\w+/).reply((config) => {
    const userId = config.url.split("/").pop();
    console.log(`[Mock] Deleted user ${userId}`);
    return [200, { message: `User ${userId} deleted successfully` }];
  });

  mock.onGet("/admin/notifications").reply(200, [
    {
      id: "301",
      message: "New user registered",
      read: false,
      date: "2025-04-18T10:00:00Z",
    },
    {
      id: "302",
      message: "Order #102 processed",
      read: true,
      date: "2025-04-17T15:30:00Z",
    },
    {
      id: "303",
      message: "Server maintenance at midnight",
      read: false,
      date: "2025-04-19T08:45:00Z",
    },
    {
      id: "304",
      message: "Low stock alert: Premium Headphones",
      read: false,
      date: "2025-04-19T11:20:00Z",
    },
    {
      id: "305",
      message: "New feature deployed: Dashboard v2",
      read: true,
      date: "2025-04-16T09:15:00Z",
    },
  ]);

  mock.onPost(/\/admin\/notifications\/\d+\/read/).reply((config) => {
    console.log("[Mock] POST", config.url);
    return [200];
  });

  mock.onGet("/admin/settings").reply(200, {
    siteTitle: "My E-Commerce",
    notificationsEnabled: true,
    itemsPerPage: 20,
    dashboardRefreshRate: 5,
    defaultDateRange: "30",
  });

  mock.onPut("/admin/settings").reply((config) => {
    const newSettings = JSON.parse(config.data);
    console.log("[Mock] PUT /admin/settings", newSettings);
    return [200, newSettings];
  });

  // Dashboard mock endpoints
  mock.onGet("/admin/stats").reply(200, {
    totalUsers: 1234,
    totalOrders: 567,
    totalRevenue: 78900,
    totalProducts: 234,
    userGrowth: "+5.2%",
    orderGrowth: "+3.7%",
    revenueGrowth: "+8.1%",
  });

  mock.onGet(/\/admin\/sales\?period=\d+/).reply((config) => {
    const period = config.url.split("=")[1];
    const labels = [];
    const values = [];
    const dataPoints =
      period === "7"
        ? 7
        : period === "30"
          ? 10
          : period === "90"
            ? 12
            : period === "180"
              ? 6
              : 12;

    for (let i = 0; i < dataPoints; i++) {
      if (period === "7" || period === "30") {
        labels.push(`Day ${i + 1}`);
      } else if (period === "90") {
        labels.push(`Week ${i + 1}`);
      } else {
        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        labels.push(months[i % 12]);
      }
      values.push(Math.floor(Math.random() * 5000) + 1000);
    }

    return [200, { labels, values }];
  });

  mock.onGet("/admin/recent-orders").reply(200, [
    {
      id: "ORD201",
      customer: "David Smith",
      status: "completed",
      amount: 140.5,
      date: "2025-04-29",
    },
    {
      id: "ORD202",
      customer: "Eva Johnson",
      status: "processing",
      amount: 76.0,
      date: "2025-04-28",
    },
    {
      id: "ORD203",
      customer: "Michael Brown",
      status: "pending",
      amount: 214.75,
      date: "2025-04-28",
    },
    {
      id: "ORD204",
      customer: "Sarah Williams",
      status: "completed",
      amount: 89.99,
      date: "2025-04-27",
    },
    {
      id: "ORD205",
      customer: "John Davis",
      status: "cancelled",
      amount: 125.5,
      date: "2025-04-26",
    },
  ]);

  mock.onGet("/admin/top-products").reply(200, [
    {
      id: "P101",
      name: "Wireless Mouse",
      image: "/api/placeholder/48/48",
      percent: 85,
    },
    {
      id: "P102",
      name: "Bluetooth Headphones",
      image: "/api/placeholder/48/48",
      percent: 72,
    },
    {
      id: "P103",
      name: "Mechanical Keyboard",
      image: "/api/placeholder/48/48",
      percent: 63,
    },
    {
      id: "P104",
      name: "Gaming Monitor",
      image: "/api/placeholder/48/48",
      percent: 47,
    },
  ]);

  mock.onGet(/\/admin\/historical\?period=\d+/).reply((config) => {
    const period = config.url.split("=")[1];
    const generateData = (base, volatility, count) => {
      const result = [];
      let value = base;
      for (let i = 0; i < count; i++) {
        value += Math.random() * volatility * 2 - volatility;
        value = Math.max(0, value);
        result.push(Math.round(value));
      }
      return result;
    };
    const dataPoints =
      period === "7"
        ? 7
        : period === "30"
          ? 10
          : period === "90"
            ? 12
            : period === "180"
              ? 6
              : 12;

    return [
      200,
      {
        users: generateData(100, 10, dataPoints),
        orders: generateData(50, 8, dataPoints),
        revenue: generateData(2000, 300, dataPoints),
      },
    ];
  });
}

export default API;
