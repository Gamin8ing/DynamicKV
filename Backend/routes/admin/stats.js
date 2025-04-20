// File: backend/routes/admin/stats.js
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Product = require("../../models/Product");

// Admin: Get dashboard stats
router.get("/", async (req, res) => {
  try {
    // Get users count
    const users = await User.getAll();
    const totalUsers = users.length;

    // Mock order and revenue data (to be implemented with real order tracking)
    const totalOrders = 450;
    const totalRevenue = 95000;

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
});

// Admin: Get historical data for charts
router.get("/historical", async (req, res) => {
  try {
    const period = parseInt(req.query.period) || 7;

    // This is a mock implementation as requested
    // In a real application, this would fetch actual historical data
    let users, orders, revenue;

    switch (period) {
      case 7:
        users = [1180, 1195, 1205, 1210, 1215, 1218, 1220];
        orders = [430, 435, 438, 440, 442, 445, 450];
        revenue = [92000, 92500, 93000, 93500, 94000, 94500, 95000];
        break;
      case 30:
        users = [1080, 1100, 1120, 1140, 1160, 1180, 1200, 1220];
        orders = [400, 410, 415, 420, 425, 435, 445, 450];
        revenue = [85000, 87000, 88500, 90000, 91500, 93000, 94000, 95000];
        break;
      case 90:
        users = [950, 1000, 1050, 1100, 1150, 1180, 1220];
        orders = [350, 375, 390, 405, 420, 435, 450];
        revenue = [75000, 80000, 83000, 86000, 89000, 92000, 95000];
        break;
      default:
        users = [1180, 1195, 1205, 1210, 1215, 1218, 1220];
        orders = [430, 435, 438, 440, 442, 445, 450];
        revenue = [92000, 92500, 93000, 93500, 94000, 94500, 95000];
    }

    res.json({ users, orders, revenue });
  } catch (error) {
    console.error("Historical data error:", error);
    res
      .status(500)
      .json({
        message: "Error fetching historical data",
        error: error.message,
      });
  }
});

// Admin: Get sales data for charts
router.get("/sales", async (req, res) => {
  try {
    const period = parseInt(req.query.period) || 7;

    // This is a mock implementation as requested
    let labels, values;

    switch (period) {
      case 7:
        labels = [
          "Apr 14",
          "Apr 15",
          "Apr 16",
          "Apr 17",
          "Apr 18",
          "Apr 19",
          "Apr 20",
        ];
        values = [3800, 4200, 3900, 4500, 5100, 4800, 5200];
        break;
      case 30:
        labels = ["Week 1", "Week 2", "Week 3", "Week 4", "Current"];
        values = [15000, 17500, 16800, 18500, 20000];
        break;
      case 90:
        labels = ["Feb", "Mar", "Apr"];
        values = [45000, 52000, 58000];
        break;
      default:
        labels = [
          "Apr 14",
          "Apr 15",
          "Apr 16",
          "Apr 17",
          "Apr 18",
          "Apr 19",
          "Apr 20",
        ];
        values = [3800, 4200, 3900, 4500, 5100, 4800, 5200];
    }

    res.json({ labels, values });
  } catch (error) {
    console.error("Sales data error:", error);
    res
      .status(500)
      .json({ message: "Error fetching sales data", error: error.message });
  }
});

// Admin: Get recent orders (mock implementation)
router.get("/recent-orders", async (req, res) => {
  try {
    // This is a mock implementation as requested
    const recentOrders = [
      {
        id: "201",
        customer: "Tom Cruise",
        status: "Delivered",
        amount: 150.0,
        date: "2025-04-19T15:30:00Z",
      },
      {
        id: "202",
        customer: "Emma Watson",
        status: "Processing",
        amount: 75.5,
        date: "2025-04-19T10:45:00Z",
      },
      {
        id: "203",
        customer: "Chris Evans",
        status: "Pending",
        amount: 120.75,
        date: "2025-04-18T18:20:00Z",
      },
      {
        id: "204",
        customer: "Scarlett Johansson",
        status: "Processing",
        amount: 95.25,
        date: "2025-04-18T14:10:00Z",
      },
      {
        id: "205",
        customer: "Robert Downey Jr.",
        status: "Completed",
        amount: 210.5,
        date: "2025-04-17T09:35:00Z",
      },
    ];

    res.json(recentOrders);
  } catch (error) {
    console.error("Recent orders error:", error);
    res
      .status(500)
      .json({ message: "Error fetching recent orders", error: error.message });
  }
});

module.exports = router;
