import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// Component for routes that require authentication
export const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useUser();
  
  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-700">
          Loading...
        </div>
      </div>
    );
  }
  
  // Check if user is authenticated
  const authenticated = isAuthenticated();
  
  // For admin routes, also check if user is admin
 if (adminOnly && (!authenticated || !isAdmin())) {
    return <Navigate to="/login" replace />;
  }
  
  // For normal protected routes, just check authentication
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated (and admin if required), render the child routes
  return <Outlet />;
};

// Component for routes that should redirect authenticated users (like login/signup)
export const PublicOnlyRoute = () => {
  const { isAuthenticated, loading } = useUser();
  
  // Show loading indicator while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl font-medium text-gray-700">
          Loading...
        </div>
      </div>
    );
  }
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, render the child routes
  return <Outlet />;
};