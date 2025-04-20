// File: backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const productRoutes = require("./routes/products");
// const orderRoutes = require("./routes/orders");

// DB Connection - We'll use a connection to your DynamicKV database
const dbConnection = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
      (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }

        req.user = user;
        next();
      },
    );
  } else {
    res.sendStatus(401);
  }
};

// Role-based Authentication Middleware
const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden - Insufficient permissions" });
    }

    next();
  };
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/products", productRoutes); // Public access for viewing products
app.use(
  "/api/admin/products",
  authenticateJWT,
  authorizeRole(["admin"]),
  require("./routes/admin/products"),
);
app.use(
  "/api/admin/users",
  authenticateJWT,
  authorizeRole(["admin"]),
  require("./routes/admin/users"),
);
app.use(
  "/api/admin/stats",
  authenticateJWT,
  authorizeRole(["admin"]),
  require("./routes/admin/stats"),
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DynamicKV API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
