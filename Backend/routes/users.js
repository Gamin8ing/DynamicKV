// File: backend/routes/users.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Get user profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format user profile data
    const userProfile = {
      name:
        `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        user.username,
      email: user.email,
      role: user.role,
      joinedAt: user.createdAt,
      avatarUrl: user.avatarUrl || "https://i.pravatar.cc/150?img=12", // Default avatar
      bio: user.bio || "",
      phone: user.phone || "",
      address: user.address || {
        street: "",
        city: "",
        state: "",
        zip: "",
      },
      social: user.social || {
        twitter: "",
        github: "",
        linkedin: "",
      },
      stats: {
        orders: 0, // To be implemented with order tracking
        reviews: 0, // To be implemented with review system
        wishlist: 0, // To be implemented with wishlist feature
      },
      recentActivities: [], // To be implemented with activity tracking
    };

    res.json(userProfile);
  } catch (error) {
    console.error("Profile error:", error);
    res
      .status(500)
      .json({ message: "Error fetching profile", error: error.message });
  }
});

// Update user profile
router.put("/profile", async (req, res) => {
  try {
    const updatedUser = await User.update(req.user.id, req.body);
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = router;
