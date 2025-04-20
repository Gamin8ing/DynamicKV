// File: backend/routes/admin/products.js
const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");

// Admin: Get all products with additional details
router.get("/", async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    console.error("Admin get products error:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

// Admin: Create product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res
      .status(500)
      .json({ message: "Error creating product", error: error.message });
  }
});

// Admin: Update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
});

// Admin: Delete product
router.delete("/:id", async (req, res) => {
  try {
    const result = await Product.delete(req.params.id);
    res.json({ success: result });
  } catch (error) {
    console.error("Delete product error:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

// Admin: Get top products (sorted by stock)
router.get("/top", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const topProducts = await Product.getTopProducts(limit);
    res.json(topProducts);
  } catch (error) {
    console.error("Top products error:", error);
    res
      .status(500)
      .json({ message: "Error fetching top products", error: error.message });
  }
});

module.exports = router;
