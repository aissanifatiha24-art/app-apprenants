// frontend/src/components/Auth/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({
  children,
  isAuthenticated,
  userRole,
  requiredRole,
}) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={`/${userRole}/dashboard`} replace />;
  }

  return children;
};

export default PrivateRoute;
