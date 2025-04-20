// File: backend/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

// Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
});

// Search products
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const results = await Product.search(query);
    res.json(results);
  } catch (error) {
    console.error("Search error:", error);
    res
      .status(500)
      .json({ message: "Error searching products", error: error.message });
  }
});

// Get products by price range
router.get("/price/:min/:max", async (req, res) => {
  try {
    const min = parseFloat(req.params.min);
    const max = parseFloat(req.params.max);

    if (isNaN(min) || isNaN(max)) {
      return res.status(400).json({ message: "Invalid price range" });
    }

    const products = await Product.findByPriceRange(min, max);
    res.json(products);
  } catch (error) {
    console.error("Price range error:", error);
    res
      .status(500)
      .json({
        message: "Error fetching products by price",
        error: error.message,
      });
  }
});

module.exports = router;
