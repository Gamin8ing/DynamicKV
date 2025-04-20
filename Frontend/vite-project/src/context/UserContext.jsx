// File: Frontend/vite-project/src/context/UserContext.jsx (Updated)
import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../utils/api";

// Create the context
export const UserContext = createContext(null);

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedUser = localStorage.getItem("dynamicKV_user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);

          // Verify token is still valid with the backend
          try {
            await authAPI.getMe();
          } catch (err) {
            // If token is invalid, clear local storage and user state
            if (err.response && err.response.status === 401) {
              localStorage.removeItem("dynamicKV_user");
              setUser(null);
            }
          }
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setError("Failed to restore authentication session");
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  // Debug: log whenever context value changes
  useEffect(() => {
    console.log("🧩 [UserContext] value changed:", {
      user,
      loading,
      error,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
    });
  }, [user, loading, error]);

  // Login function
  const login = async (email, password, remember = false) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await authAPI.login(email, password);

      // Create user object with token
      const userData = {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        token,
      };

      setUser(userData);

      if (remember) {
        localStorage.setItem("dynamicKV_user", JSON.stringify(userData));
      }

      return { success: true, user: userData };
    } catch (err) {
      console.error("Login failed:", err);
      setError(err.response?.data?.message || "Failed to login");
      return {
        success: false,
        error: err.response?.data?.message || "Failed to login",
      };
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { user, token } = await authAPI.register(userData);

      return { success: true, user };
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.message || "Failed to register");
      return {
        success: false,
        error: err.response?.data?.message || "Failed to register",
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("dynamicKV_user");
  };

  // Helpers
  const isAuthenticated = () => !!user;
  const isAdmin = () => user?.role === "admin";

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

