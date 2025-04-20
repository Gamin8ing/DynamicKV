// File: backend/models/Product.js
const dbClient = require("../config/db");

class Product {
  static async findById(id) {
    try {
      const response = await dbClient.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async getAll() {
    try {
      const response = await dbClient.get("/products");
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async create(productData) {
    // Enhanced product model with additional fields
    const product = {
      id: `product_${Date.now()}`,
      name: productData.name,
      price: productData.price,
      description: productData.description,
      categories: productData.categories || [],
      stock: productData.stock || 0,
      sku: productData.sku || `SKU-${Math.floor(Math.random() * 100000)}`,
      images: productData.images || [],
      attributes: productData.attributes || {},
      status: productData.status || "active", // active, inactive, archived
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      weight: productData.weight || 0,
      dimensions: productData.dimensions || {
        length: 0,
        width: 0,
        height: 0,
      },
      brand: productData.brand || "",
      manufacturer: productData.manufacturer || "",
      featured: productData.featured || false,
      tags: productData.tags || [],
      // Add more fields as needed
    };

    try {
      await dbClient.post("/products", product);
      return product;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      // First get the existing product
      const product = await this.findById(id);
      if (!product) {
        throw new Error("Product not found");
      }

      // Update the product data
      const updatedProduct = {
        ...product,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await dbClient.put(`/products/${id}`, updatedProduct);
      return updatedProduct;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await dbClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async findByPriceRange(min, max) {
    try {
      const response = await dbClient.get(`/products/price/${min}/${max}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async search(query) {
    try {
      const response = await dbClient.get(
        `/search?q=${encodeURIComponent(query)}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async getTopProducts(limit = 5) {
    try {
      // Get all products
      const products = await this.getAll();

      // Sort by stock (highest stock first)
      const sortedProducts = products.sort((a, b) => b.stock - a.stock);

      // Return top N products
      return sortedProducts.slice(0, limit).map((product) => ({
        id: product.id,
        name: product.name,
        image: product.images[0] || "/api/placeholder/40/40",
        percent: Math.min(100, Math.round((product.stock / 100) * 100)), // Convert stock to percentage with max 100%
      }));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Product;
