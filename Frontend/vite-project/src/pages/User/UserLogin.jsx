// src/pages/User/UserLogin.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// Custom logo component for Dynamic KV
const DynamicKVLogo = () => (
  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mx-auto mb-6">
    <div className="relative">
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              transform: `rotate(${i * 15}deg) translateY(-24px)`,
              background:
                i % 3 === 0 ? "#72D3D5" : i % 3 === 1 ? "#63D2FF" : "#BED8D4",
              opacity: 0.8 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>
      <div className="text-black font-bold text-xl z-10 relative">KV</div>
    </div>
  </div>
);

const UserLogin = () => {
  const { login, isAuthenticated, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // useEffect(() => {
  //   if (isAuthenticated()) {
  //     if ()
  //     navigate("/dashboard");
  //   }
  // }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const toggleLoginType = (isAdmin) => {
  //   setIsAdminLogin(isAdmin);
  //   setErrors({});
  //   // setFormData({ username: "", password: "" });
  // };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.email = "Username is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const result = await login(
        formData.username,
        formData.password,
        isAdminLogin,
        rememberMe,
      );
      if (result.success) {
        console.log("logign as ", isAdminLogin, " is  --------------");
        if (isAdminLogin == true) {
          navigate("/admin/dashboard");
          navigate("/admin/dashboard");
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setErrors({ form: result.error || "Login failed. Please try again." });
      }
    } catch {
      setErrors({ form: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-700">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div
        className="fixed inset-0 bg-cover bg-center z-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #F7F9F9 0%, #BED8D4 30%, #72D3D5 60%, #63D2FF 100%)",
          filter: "blur(60px)",
        }}
      />
      <div className="max-w-md w-full mx-4 z-10">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <DynamicKVLogo />
            <h2 className="text-2xl font-bold text-center text-black mb-8">
              Sign in with Dynamic KV Account
            </h2>

            {/* Login type selector */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => setIsAdminLogin(false)}
                className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-300 ${
                  !isAdminLogin
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:bg-white hover:bg-opacity-50"
                }`}
              >
                User
              </button>
              <button
                onClick={() => setIsAdminLogin(true)}
                className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-300 ${
                  isAdminLogin
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:bg-white hover:bg-opacity-50"
                }`}
              >
                Admin
              </button>
            </div>

            {errors.form && (
              <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-xl border border-red-200">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6 relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full p-4 pr-10 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500 ${
                    errors.email ? "border-red-500 focus:ring-red-400" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">
                    {errors.email}
                  </p>
                )}
                {formData.username && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, username: "" }))
                    }
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="mb-6">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-4 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500 ${
                    errors.password ? "border-red-500 focus:ring-red-400" : ""
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between mb-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe((prev) => !prev)}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600 font-medium">
                    Keep me signed in
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 border border-transparent rounded-xl shadow-lg text-white font-bold text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-teal-500 transition-all duration-300"></div>
                <span className="relative">
                  {isLoading
                    ? "Signing in..."
                    : isAdminLogin
                      ? "Sign in as Admin"
                      : "Sign in"}
                </span>
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-700 font-medium">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-blue-500 hover:text-blue-700"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-600">
              © 2025 Dynamic KV. All rights reserved.
            </span>
            <div className="flex space-x-3">
              <Link to="#" className="text-xs text-gray-600 hover:text-black">
                Privacy Policy
              </Link>
              <Link to="#" className="text-xs text-gray-600 hover:text-black">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
