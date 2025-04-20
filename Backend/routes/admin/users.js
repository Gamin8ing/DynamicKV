// File: backend/routes/admin/users.js
const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Admin: Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    console.error("Admin get users error:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Admin: Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Get user error:", error);
    res
      .status(500)
      .json({ message: "Error fetching user", error: error.message });
  }
});

// Admin: Create user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Create user error:", error);
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// Admin: Update user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
});

// Admin: Delete user
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.delete(req.params.id);
    res.json({ success: result });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;
