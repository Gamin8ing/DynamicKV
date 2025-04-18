import React, { useState } from 'react';

// Custom logo component for Dynamic KV
const DynamicKVLogo = () => (
  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-md mx-auto mb-6">
    <div className="relative">
      {/* Colorful circle animation similar to Apple's design */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              transform: `rotate(${i * 15}deg) translateY(-24px)`,
              background: i % 3 === 0 ? '#72D3D5' : i % 3 === 1 ? '#63D2FF' : '#BED8D4',
              opacity: 0.8 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>
      {/* KV text in the center */}
      <div className="text-black font-bold text-xl z-10 relative">KV</div>
    </div>
  </div>
);

const Login = () => {
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleLoginType = (isAdmin) => {
    setIsAdminLogin(isAdmin);
    setErrors({});
    setFormData({ email: '', password: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate to dashboard or handle response
        alert(`${isAdminLogin ? 'Admin' : 'User'} login successful!`);
      } catch (error) {
        console.error('Login failed:', error);
        setErrors({ form: 'Login failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background gradient with blur effect - using your color palette */}
      <div 
        className="fixed inset-0 bg-cover bg-center z-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(circle at center, #F7F9F9 0%, #BED8D4 30%, #72D3D5 60%, #63D2FF 100%)",
          filter: "blur(60px)"
        }}
      />
      
      <div className="max-w-md w-full mx-4 z-10">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <DynamicKVLogo />
            
            <h2 className="text-2xl font-bold text-center text-black mb-8">
              Sign in with Dynamic KV Account
            </h2>
            
            {/* Login Type Selector */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button 
                onClick={() => toggleLoginType(false)}
                className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-300 ${
                  !isAdminLogin 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-500 hover:bg-white hover:bg-opacity-50'
                }`}
              >
                User
              </button>
              <button 
                onClick={() => toggleLoginType(true)}
                className={`flex-1 text-center py-2 rounded-lg font-medium transition-colors duration-300 ${
                  isAdminLogin 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-gray-500 hover:bg-white hover:bg-opacity-50'
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
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email or Phone Number"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-4 pr-10 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-black placeholder-gray-500 ${
                      errors.email ? 'border-red-500 focus:ring-red-400' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 pl-1 font-medium">{errors.email}</p>
                  )}
                  {formData.email && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={() => setFormData({...formData, email: ''})}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-4 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-black placeholder-gray-500 ${
                    errors.password ? 'border-red-500 focus:ring-red-400' : ''
                  }`}
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">{errors.password}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 font-medium">
                    Keep me signed in
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="font-bold text-blue-500 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 border border-transparent rounded-xl shadow-lg text-white font-bold text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-teal-500 transition-all duration-300"></div>
                <span className="relative">
                  {isLoading ? 'Signing in...' : isAdminLogin ? 'Sign in as Admin' : 'Sign in'}
                </span>
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-700 font-medium">
                Don't have an account?{' '}
                <a href="/signup" className="font-bold text-blue-500 hover:text-blue-700">
                  Create Account
                </a>
              </p>
            </div>
          </div>
          
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-600 font-medium">
                &copy; 2025 Dynamic KV. All rights reserved.
              </div>
              <div className="flex space-x-3">
                <a href="#" className="text-xs text-gray-600 hover:text-black font-medium">Privacy Policy</a>
                <a href="#" className="text-xs text-gray-600 hover:text-black font-medium">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;