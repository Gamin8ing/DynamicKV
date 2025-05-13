// src/pages/User/UserSignup.jsx
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

const UserSignup = () => {
  const { register, isAuthenticated, loading: authLoading } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("this changed -----------> ", name, value);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!acceptTerms)
      newErrors.terms = "You must accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const result = await register({
        username: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        alert("Account created successfully! Please login.");
        navigate("/login");
      } else {
        setErrors({
          form: result.error || "Account creation failed. Please try again.",
        });
      }
    } catch {
      setErrors({ form: "Account creation failed. Please try again." });
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
              Create Account
            </h2>

            {errors.form && (
              <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-xl border border-red-200">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-4 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500 ${
                    errors.name ? "border-red-500 focus:ring-red-400" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-4 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500 ${
                    errors.email ? "border-red-500 focus:ring-red-400" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">
                    {errors.email}
                  </p>
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

              <div className="mb-6">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-4 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : ""
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="mb-8 flex items-start">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms((prev) => !prev)}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 font-medium">
                    I agree to the{" "}
                    <Link
                      to="#"
                      className="font-bold text-blue-500 hover:text-blue-700"
                    >
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="#"
                      className="font-bold text-blue-500 hover:text-blue-700"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.terms && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">
                    {errors.terms}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 border border-transparent rounded-xl shadow-lg text-white font-bold text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-teal-500 transition-all duration-300"></div>
                <span className="relative">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </span>
              </button>
            </form>

            <div className="px-8 py-4 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-700">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-500 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
