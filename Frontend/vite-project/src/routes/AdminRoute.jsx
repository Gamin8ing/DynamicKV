/*import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/adminlogin" />;

  try {
    const decoded = jwtDecode(token);
    if (decoded.role !== "admin") {
      return <Navigate to="/adminlogin" />;
    }
    return children;
  } catch (err) {
    return <Navigate to="/adminlogin" />;
  }
};

export default AdminRoute;
// This component checks if the user is an admin by decoding the JWT token stored in localStorage.
// If the token is not present or the user is not an admin, it redirects to the admin login page.
// If the user is an admin, it renders the children components.
// This is useful for protecting admin routes in a React application.
*/
import React from 'react'

const AdminRoute = () => {
  return (
    <div>AdminRoute</div>
  )
}

export default AdminRoute