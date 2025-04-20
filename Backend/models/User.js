// File: backend/models/User.js
const dbClient = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  static async findById(id) {
    try {
      const response = await dbClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      // We need to get all users and filter by email since the DB API doesn't support this natively
      const response = await dbClient.get("/users");
      const users = response.data;
      return users.find((user) => user.email === email) || null;
    } catch (error) {
      throw error;
    }
  }

  static async create(userData) {
    // Hash the password before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Enhanced user model with additional fields
    const user = {
      id: `user_${Date.now()}`,
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || "user", // Default role is 'user'
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      phone: userData.phone || "",
      address: {
        street: userData.street || "",
        city: userData.city || "",
        state: userData.state || "",
        zip: userData.zip || "",
      },
      bio: userData.bio || "",
      preferences: userData.preferences || {},
      lastLogin: new Date().toISOString(),
      // Add more fields as needed
    };

    try {
      await dbClient.post("/users", user);
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const response = await dbClient.get("/users");
      // Remove passwords from response
      return response.data.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw error;
    }
  }

  static async update(id, updates) {
    try {
      // First get the existing user
      const user = await this.findById(id);
      if (!user) {
        throw new Error("User not found");
      }

      // Update the user data
      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // If password is being updated, hash it
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updatedUser.password = await bcrypt.hash(updates.password, salt);
      }

      await dbClient.put(`/users/${id}`, updatedUser);

      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      await dbClient.delete(`/users/${id}`);
      return true;
    } catch (error) {
      throw error;
    }
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;
