/**
 * Utility functions for authentication
 */

// Function to validate email format
export const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };
  
  // Function to validate password strength
  export const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  // Mock API calls (replace with real API calls later)
  export const loginUser = async (email, password, isAdmin = false) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, this would be an API call
    if (email === 'admin@example.com' && password === 'Admin123' && isAdmin) {
      return {
        success: true,
        user: {
          id: 'admin-1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          token: 'mock-admin-token-123'
        }
      };
    } else if (email === 'user@example.com' && password === 'User123' && !isAdmin) {
      return {
        success: true,
        user: {
          id: 'user-1',
          name: 'Regular User',
          email: 'user@example.com',
          role: 'user',
          token: 'mock-user-token-456'
        }
      };
    }
    
    // Simulate failed login
    return {
      success: false,
      error: 'Invalid email or password'
    };
  };
  
  export const registerUser = async (userData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email is already taken (in a real app, this would be handled by the server)
    if (userData.email === 'admin@example.com' || userData.email === 'user@example.com') {
      return {
        success: false,
        error: 'Email is already taken'
      };
    }
    
    // Validate password
    const passwordValidation = validatePassword(userData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        error: passwordValidation.errors[0]
      };
    }
    
    // In a real implementation, this would create a user in your database
    return {
      success: true,
      user: {
        id: 'new-' + Math.random().toString(36).substring(2),
        name: userData.name,
        email: userData.email,
        role: 'user'
      }
    };
  };
  
  // Helper function to get token from localStorage
  export const getAuthToken = () => {
    const user = JSON.parse(localStorage.getItem('dynamicKV_user'));
    return user ? user.token : null;
  };
  
  // Helper function to check if token is expired
  export const isTokenExpired = (token) => {
    // In a real implementation, you would check token expiration
    // For JWT tokens, you could decode and check the exp claim
    return false;
  };