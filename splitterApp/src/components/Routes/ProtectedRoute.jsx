import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show a loading indicator while the authentication state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p> {/* Replace with a spinner or loader component if available */}
      </div>
    );
  }

  // Redirect to the login page if the user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the child routes when authentication is valid
  return <Outlet />;
};

export default ProtectedRoute;
