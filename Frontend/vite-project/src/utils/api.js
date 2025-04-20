// File: Frontend/vite-project/src/utils/api.js (Updated)
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Create real API instance that connects to our Express backend
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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

// API Functions
export const authAPI = {
  login: async (email, password) => {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await API.post("/auth/register", userData);
    return response.data;
  },
  getMe: async () => {
    const response = await API.get("/auth/me");
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
  getTopProducts: async (limit = 5) => {
    const response = await API.get(`/admin/products/top?limit=${limit}`);
    return response.data;
  },
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

  // Admin notifications (mock only)
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

  // Mark notification as read
  mock.onPost(/\/admin\/notifications\/\d+\/read/).reply((config) => {
    console.log("[Mock] POST", config.url);
    return [200];
  });

  // Settings endpoints
  mock.onGet("/admin/settings").reply(200, {
    siteTitle: "My E‑Commerce",
    notificationsEnabled: true,
    itemsPerPage: 20,
    dashboardRefreshRate: 5, // minutes
    defaultDateRange: "30", // Default time period
  });

  mock.onPut("/admin/settings").reply((config) => {
    const newSettings = JSON.parse(config.data);
    console.log("[Mock] PUT /admin/settings", newSettings);
    return [200, newSettings];
  });
}

export default API;

