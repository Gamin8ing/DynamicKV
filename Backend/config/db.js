// File: backend/config/db.js
const axios = require("axios");

// Configuration for DynamicKV HTTP server
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 8080;
const BASE_URL = `http://${DB_HOST}:${DB_PORT}/api`;

// Create axios instance for DB communication
const dbClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to handle DB connection errors
dbClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Database connection error:", error.message);
    return Promise.reject(error);
  },
);

module.exports = dbClient;
