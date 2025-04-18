import React, { useState } from 'react';

// Custom logo component for Dynamic KV (same as login page)
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

const UserSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validate()) {
      setIsLoading(true);
      try {
        // Here you would make an API call to your backend
        console.log('Creating account with:', formData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate to login or dashboard
        alert('Account created successfully!');
      } catch (error) {
        console.error('Account creation failed:', error);
        setErrors({ form: 'Account creation failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Background gradient with blur effect - matching login page */}
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
              Create Account
            </h2>
            
            {errors.form && (
              <div className="mb-6 p-3 bg-red-100 text-red-800 rounded-xl border border-red-200">
                {errors.form}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-4 pr-10 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-black placeholder-gray-500 ${
                      errors.name ? 'border-red-500 focus:ring-red-400' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1 pl-1 font-medium">{errors.name}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-4 pr-10 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-black placeholder-gray-500 ${
                      errors.email ? 'border-red-500 focus:ring-red-400' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1 pl-1 font-medium">{errors.email}</p>
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
              
              <div className="mb-6">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-4 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-black placeholder-gray-500 ${
                    errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : ''
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 pl-1 font-medium">{errors.confirmPassword}</p>
                )}
              </div>
              
              <div className="mb-8">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700 font-medium">
                      I agree to the <a href="#" className="font-bold text-blue-500 hover:text-blue-700">Terms</a> and <a href="#" className="font-bold text-blue-500 hover:text-blue-700">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 border border-transparent rounded-xl shadow-lg text-white font-bold text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-teal-500 transition-all duration-300"></div>
                <span className="relative">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </span>
              </button>
            </form>
          </div>
          
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Already have an account?{' '}
                <a href="/UserLogin" className="font-bold text-blue-500 hover:text-blue-700">
                  Sign in
                </a>
              </div>
              <div className="text-xs text-gray-600 font-medium">
                &copy; 2025 Dynamic KV
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;